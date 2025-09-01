/**
 * Unit Tests for TimerEngine
 * Tests the core timer functionality including precision timing, state management,
 * and event emission according to the architecture specification.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TimerEngine } from '@/js/timer/TimerEngine.js'

describe('TimerEngine', () => {
  let timer
  let mockDate
  let mockRAF
  
  beforeEach(() => {
    // Mock Date for consistent timing
    mockDate = vi.spyOn(Date, 'now')
    mockDate.mockReturnValue(1000000)
    
    // Mock requestAnimationFrame
    mockRAF = vi.spyOn(global, 'requestAnimationFrame')
    mockRAF.mockImplementation(cb => setTimeout(cb, 16))
    
    // Create fresh timer instance
    timer = new TimerEngine()
  })
  
  afterEach(() => {
    timer.destroy()
    vi.restoreAllMocks()
  })

  describe('Singleton Pattern', () => {
    it('should return the same instance for multiple instantiations', () => {
      const timer1 = new TimerEngine()
      const timer2 = new TimerEngine()
      expect(timer1).toBe(timer2)
    })
    
    it('should maintain state across instance references', () => {
      const timer1 = new TimerEngine()
      timer1.configure({ focusTime: 30 })
      
      const timer2 = new TimerEngine()
      expect(timer2.getState().config.focusTime).toBe(30)
    })
  })

  describe('Configuration', () => {
    it('should set default configuration on initialization', () => {
      const state = timer.getState()
      expect(state.config).toEqual({
        focusTime: 25,
        breakTime: 5,
        longBreakTime: 15,
        cyclesUntilLongBreak: 4
      })
    })
    
    it('should update configuration and persist to localStorage', () => {
      const newConfig = {
        focusTime: 30,
        breakTime: 10,
        longBreakTime: 20,
        cyclesUntilLongBreak: 3
      }
      
      timer.configure(newConfig)
      
      expect(timer.getState().config).toEqual(newConfig)
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'pomodoro-config',
        JSON.stringify(newConfig)
      )
    })
    
    it('should validate configuration ranges', () => {
      expect(() => timer.configure({ focusTime: 0 })).toThrow('Focus time must be at least 1 second')
      expect(() => timer.configure({ focusTime: 86401 })).toThrow('Focus time cannot exceed 24 hours')
      expect(() => timer.configure({ breakTime: -1 })).toThrow('Break time must be at least 1 second')
    })
    
    it('should emit configuration change event', () => {
      const mockListener = vi.fn()
      timer.addEventListener('config-changed', mockListener)
      
      const newConfig = { focusTime: 30 }
      timer.configure(newConfig)
      
      expect(mockListener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'config-changed',
          detail: { config: expect.objectContaining(newConfig) }
        })
      )
    })
  })

  describe('Timer State Management', () => {
    it('should initialize with correct default state', () => {
      const state = timer.getState()
      expect(state).toMatchObject({
        phase: 'focus',
        isRunning: false,
        isPaused: false,
        remainingTime: 25 * 60 * 1000, // 25 minutes in ms
        totalTime: 25 * 60 * 1000,
        currentCycle: 1,
        completedCycles: 0,
        sessionCount: 0
      })
    })
    
    it('should transition through all phases correctly', async () => {
      timer.configure({ focusTime: 1, breakTime: 1, longBreakTime: 1, cyclesUntilLongBreak: 2 })
      
      // Cycle 1: Focus -> Break
      timer.start()
      await simulateTimePass(1000)
      expect(timer.getState().phase).toBe('break')
      
      // Cycle 2: Focus -> Long Break (after 2 cycles)
      await simulateTimePass(1000) // Complete break
      expect(timer.getState().phase).toBe('focus')
      expect(timer.getState().currentCycle).toBe(2)
      
      await simulateTimePass(1000) // Complete focus
      expect(timer.getState().phase).toBe('longBreak')
    })
    
    it('should handle pause and resume correctly', () => {
      timer.start()
      expect(timer.getState().isRunning).toBe(true)
      
      timer.pause()
      expect(timer.getState().isPaused).toBe(true)
      expect(timer.getState().isRunning).toBe(false)
      
      timer.resume()
      expect(timer.getState().isRunning).toBe(true)
      expect(timer.getState().isPaused).toBe(false)
    })
    
    it('should reset to initial state', () => {
      timer.start()
      timer.pause()
      timer.reset()
      
      const state = timer.getState()
      expect(state.phase).toBe('focus')
      expect(state.isRunning).toBe(false)
      expect(state.isPaused).toBe(false)
      expect(state.currentCycle).toBe(1)
      expect(state.remainingTime).toBe(25 * 60 * 1000)
    })
  })

  describe('Timer Precision', () => {
    it('should maintain 1ms precision with requestAnimationFrame', async () => {
      let tickCount = 0
      timer.addEventListener('timer:tick', () => tickCount++)
      
      timer.configure({ focusTime: 2 })
      timer.start()
      
      // Simulate RAF callbacks at 60fps (16.67ms intervals)
      for (let i = 0; i < 60; i++) {
        mockDate.mockReturnValue(1000000 + (i * 16.67))
        await new Promise(resolve => setTimeout(resolve, 0))
      }
      
      expect(tickCount).toBeGreaterThan(50) // Should have many precision updates
    })
    
    it('should handle browser tab backgrounding', () => {
      timer.configure({ focusTime: 5 })
      timer.start()
      
      const initialTime = timer.getState().remainingTime
      
      // Simulate tab becoming hidden
      Object.defineProperty(document, 'visibilityState', { value: 'hidden' })
      document.dispatchEvent(new Event('visibilitychange'))
      
      // Simulate time passing while hidden (3 seconds)
      mockDate.mockReturnValue(1000000 + 3000)
      
      // Simulate tab becoming visible
      Object.defineProperty(document, 'visibilityState', { value: 'visible' })
      document.dispatchEvent(new Event('visibilitychange'))
      
      expect(timer.getState().remainingTime).toBe(initialTime - 3000)
    })
    
    it('should handle system clock changes', () => {
      timer.configure({ focusTime: 10 })
      timer.start()
      
      // Simulate system clock jump backward (should not add time)
      mockDate.mockReturnValue(999000) // 1 second backward
      timer._handleTick()
      
      expect(timer.getState().remainingTime).toBeLessThan(10 * 60 * 1000)
    })
  })

  describe('Event System', () => {
    it('should emit timer:start event', () => {
      const mockListener = vi.fn()
      timer.addEventListener('timer:start', mockListener)
      
      timer.start()
      
      expect(mockListener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'timer:start',
          detail: {
            phase: 'focus',
            totalTime: 25 * 60 * 1000
          }
        })
      )
    })
    
    it('should emit timer:tick events with remaining time', async () => {
      const mockListener = vi.fn()
      timer.addEventListener('timer:tick', mockListener)
      
      timer.configure({ focusTime: 2 })
      timer.start()
      
      await simulateTimePass(1000)
      
      expect(mockListener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'timer:tick',
          detail: expect.objectContaining({
            remainingTime: expect.any(Number),
            phase: 'focus',
            progress: expect.any(Number)
          })
        })
      )
    })
    
    it('should emit timer:complete event', async () => {
      const mockListener = vi.fn()
      timer.addEventListener('timer:complete', mockListener)
      
      timer.configure({ focusTime: 1 })
      timer.start()
      
      await simulateTimePass(1000)
      
      expect(mockListener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'timer:complete',
          detail: {
            phase: 'focus',
            completedCycle: 1
          }
        })
      )
    })
    
    it('should emit timer:phase-change event', async () => {
      const mockListener = vi.fn()
      timer.addEventListener('timer:phase-change', mockListener)
      
      timer.configure({ focusTime: 1, breakTime: 1 })
      timer.start()
      
      await simulateTimePass(1000)
      
      expect(mockListener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'timer:phase-change',
          detail: {
            fromPhase: 'focus',
            toPhase: 'break',
            cycleCount: 1
          }
        })
      )
    })
    
    it('should allow event listener removal', () => {
      const mockListener = vi.fn()
      timer.addEventListener('timer:tick', mockListener)
      timer.removeEventListener('timer:tick', mockListener)
      
      timer.start()
      
      expect(mockListener).not.toHaveBeenCalled()
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle multiple start calls gracefully', () => {
      timer.start()
      const firstState = timer.getState()
      
      timer.start() // Second start should not change state
      const secondState = timer.getState()
      
      expect(firstState).toEqual(secondState)
    })
    
    it('should handle pause when not running', () => {
      expect(() => timer.pause()).not.toThrow()
      expect(timer.getState().isRunning).toBe(false)
    })
    
    it('should handle resume when not paused', () => {
      timer.start()
      expect(() => timer.resume()).not.toThrow()
      expect(timer.getState().isRunning).toBe(true)
    })
    
    it('should handle localStorage failures gracefully', () => {
      localStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })
      
      expect(() => timer.configure({ focusTime: 30 })).not.toThrow()
      expect(timer.getState().config.focusTime).toBe(30)
    })
    
    it('should handle invalid localStorage data', () => {
      localStorage.getItem.mockReturnValue('invalid-json')
      
      const newTimer = new TimerEngine()
      expect(newTimer.getState().config.focusTime).toBe(25) // Should use defaults
    })
    
    it('should handle extreme time values', () => {
      timer.configure({ focusTime: 86400 }) // 24 hours - maximum
      expect(timer.getState().config.focusTime).toBe(86400)
      expect(timer.getState().totalTime).toBe(86400 * 1000)
    })
    
    it('should handle rapid start/stop cycling', async () => {
      for (let i = 0; i < 10; i++) {
        timer.start()
        timer.pause()
        timer.reset()
      }
      
      expect(timer.getState().phase).toBe('focus')
      expect(timer.getState().isRunning).toBe(false)
    })
  })

  describe('Performance and Memory', () => {
    it('should clean up RAF callbacks when destroyed', () => {
      const cancelSpy = vi.spyOn(global, 'cancelAnimationFrame')
      
      timer.start()
      timer.destroy()
      
      expect(cancelSpy).toHaveBeenCalled()
    })
    
    it('should remove event listeners when destroyed', () => {
      const mockListener = vi.fn()
      timer.addEventListener('timer:tick', mockListener)
      
      timer.destroy()
      timer.start() // Should not trigger listener
      
      expect(mockListener).not.toHaveBeenCalled()
    })
    
    it('should handle memory pressure scenarios', () => {
      // Simulate creating many event listeners
      for (let i = 0; i < 1000; i++) {
        timer.addEventListener('timer:tick', () => {})
      }
      
      expect(() => timer.start()).not.toThrow()
      expect(() => timer.destroy()).not.toThrow()
    })
  })

  // Helper function to simulate time passing
  async function simulateTimePass(ms) {
    const steps = Math.ceil(ms / 16) // 60fps
    for (let i = 0; i < steps; i++) {
      mockDate.mockReturnValue(mockDate.mock.results[0].value + (i + 1) * 16)
      await new Promise(resolve => setTimeout(resolve, 0))
    }
  }
})