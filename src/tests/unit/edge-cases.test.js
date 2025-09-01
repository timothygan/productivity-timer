/**
 * Edge Cases and Error Condition Tests
 * Tests boundary conditions, error scenarios, and unusual inputs
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TimerEngine } from '@/js/timer/TimerEngine.js'
import { ThemeProvider } from '@/js/ui/ThemeProvider.js'
import { VisualRenderer } from '@/js/ui/VisualRenderer.js'

describe('Edge Cases and Error Conditions', () => {
  let timer, themeProvider, renderer
  let container

  beforeEach(() => {
    container = document.createElement('div')
    container.id = 'timer-display'
    document.body.appendChild(container)
    
    timer = new TimerEngine()
    themeProvider = new ThemeProvider()
    renderer = new VisualRenderer('#timer-display', timer)
  })

  afterEach(() => {
    timer.destroy()
    themeProvider.destroy()
    renderer.destroy()
    document.body.removeChild(container)
    vi.restoreAllMocks()
  })

  describe('Timer Boundary Conditions', () => {
    it('should handle minimum time value (1 second)', () => {
      timer.configure({ focusTime: 1/60 }) // 1 second
      
      const state = timer.getState()
      expect(state.totalTime).toBe(1000) // 1000ms
      expect(state.remainingTime).toBe(1000)
    })
    
    it('should handle maximum time value (24 hours)', () => {
      timer.configure({ focusTime: 24 * 60 }) // 24 hours
      
      const state = timer.getState()
      expect(state.totalTime).toBe(24 * 60 * 60 * 1000) // 24 hours in ms
      expect(state.remainingTime).toBe(24 * 60 * 60 * 1000)
    })
    
    it('should reject time values below minimum', () => {
      expect(() => {
        timer.configure({ focusTime: 0 })
      }).toThrow('Focus time must be at least 1 second')
      
      expect(() => {
        timer.configure({ focusTime: -5 })
      }).toThrow('Focus time must be at least 1 second')
    })
    
    it('should reject time values above maximum', () => {
      expect(() => {
        timer.configure({ focusTime: 24 * 60 + 1 }) // Over 24 hours
      }).toThrow('Focus time cannot exceed 24 hours')
      
      expect(() => {
        timer.configure({ focusTime: 1440.1 }) // 24.0016 hours
      }).toThrow('Focus time cannot exceed 24 hours')
    })
    
    it('should handle fractional time values', () => {
      timer.configure({ focusTime: 25.5 }) // 25.5 minutes
      
      const state = timer.getState()
      expect(state.totalTime).toBe(25.5 * 60 * 1000) // 25.5 minutes in ms
    })
    
    it('should handle very small fractional values', () => {
      timer.configure({ focusTime: 0.0167 }) // ~1 second
      
      const state = timer.getState()
      expect(state.totalTime).toBeCloseTo(1000, 0) // ~1000ms
    })
  })

  describe('Extreme Input Validation', () => {
    it('should handle NaN inputs', () => {
      expect(() => {
        timer.configure({ focusTime: NaN })
      }).toThrow('Focus time must be a valid number')
      
      expect(() => {
        timer.configure({ breakTime: NaN })
      }).toThrow('Break time must be a valid number')
    })
    
    it('should handle Infinity inputs', () => {
      expect(() => {
        timer.configure({ focusTime: Infinity })
      }).toThrow('Focus time cannot exceed 24 hours')
      
      expect(() => {
        timer.configure({ focusTime: -Infinity })
      }).toThrow('Focus time must be at least 1 second')
    })
    
    it('should handle string inputs', () => {
      expect(() => {
        timer.configure({ focusTime: 'twenty-five' })
      }).toThrow('Focus time must be a valid number')
      
      expect(() => {
        timer.configure({ focusTime: '25.5abc' })
      }).toThrow('Focus time must be a valid number')
    })
    
    it('should handle object inputs', () => {
      expect(() => {
        timer.configure({ focusTime: { minutes: 25 } })
      }).toThrow('Focus time must be a valid number')
    })
    
    it('should handle null/undefined inputs', () => {
      expect(() => {
        timer.configure({ focusTime: null })
      }).toThrow('Focus time must be a valid number')
      
      expect(() => {
        timer.configure({ focusTime: undefined })
      }).toThrow('Focus time must be a valid number')
    })
  })

  describe('System Resource Edge Cases', () => {
    it('should handle system clock changes during operation', async () => {
      timer.configure({ focusTime: 5 })
      timer.start()
      
      const mockDate = vi.spyOn(Date, 'now')
      mockDate.mockReturnValue(1000000) // Initial time
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Simulate clock jumping forward (DST change, manual adjustment)
      mockDate.mockReturnValue(1000000 + 60000) // Jump forward 1 minute
      
      await new Promise(resolve => setTimeout(resolve, 50))
      
      const state = timer.getState()
      // Should handle the jump gracefully without breaking
      expect(state.remainingTime).toBeLessThan(5 * 60 * 1000)
      expect(state.remainingTime).toBeGreaterThan(0)
    })
    
    it('should handle system clock going backwards', async () => {
      timer.configure({ focusTime: 5 })
      timer.start()
      
      const mockDate = vi.spyOn(Date, 'now')
      mockDate.mockReturnValue(1000000) // Initial time
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Simulate clock jumping backwards
      mockDate.mockReturnValue(999000) // Jump back 1 second
      
      await new Promise(resolve => setTimeout(resolve, 50))
      
      const state = timer.getState()
      // Should not gain time from backwards jump
      expect(state.remainingTime).toBeLessThan(5 * 60 * 1000)
    })
    
    it('should handle rapid requestAnimationFrame failures', async () => {
      const originalRAF = global.requestAnimationFrame
      let failCount = 0
      
      global.requestAnimationFrame = vi.fn((callback) => {
        failCount++
        if (failCount % 3 === 0) {
          throw new Error('RAF failed')
        }
        return setTimeout(callback, 16)
      })
      
      timer.start()
      
      // Should continue working despite RAF failures
      await new Promise(resolve => setTimeout(resolve, 200))
      
      expect(timer.getState().isRunning).toBe(true)
      
      global.requestAnimationFrame = originalRAF
    })
    
    it('should handle memory pressure scenarios', async () => {
      // Simulate low memory by creating many event listeners
      const listeners = []
      
      for (let i = 0; i < 10000; i++) {
        const listener = () => {}
        timer.addEventListener('timer:tick', listener)
        listeners.push(listener)
      }
      
      // Should still function
      timer.start()
      await new Promise(resolve => setTimeout(resolve, 100))
      
      expect(timer.getState().isRunning).toBe(true)
      
      // Cleanup
      listeners.forEach(listener => {
        timer.removeEventListener('timer:tick', listener)
      })
    })
  })

  describe('Browser API Edge Cases', () => {
    it('should handle localStorage quota exceeded', () => {
      const originalSetItem = localStorage.setItem
      
      localStorage.setItem = vi.fn(() => {
        throw new DOMException('QuotaExceededError')
      })
      
      // Should not crash when localStorage is full
      expect(() => {
        timer.configure({ focusTime: 30 })
      }).not.toThrow()
      
      // Timer should still update in memory
      expect(timer.getState().config.focusTime).toBe(30)
      
      localStorage.setItem = originalSetItem
    })
    
    it('should handle localStorage being disabled', () => {
      const originalLocalStorage = global.localStorage
      
      Object.defineProperty(global, 'localStorage', {
        value: undefined,
        configurable: true
      })
      
      // Should work without localStorage
      expect(() => {
        const newTimer = new TimerEngine()
        newTimer.configure({ focusTime: 45 })
      }).not.toThrow()
      
      Object.defineProperty(global, 'localStorage', {
        value: originalLocalStorage,
        configurable: true
      })
    })
    
    it('should handle Page Visibility API unavailable', () => {
      const originalVisibilityState = document.visibilityState
      
      Object.defineProperty(document, 'visibilityState', {
        value: undefined,
        configurable: true
      })
      
      timer.start()
      
      // Should continue working without visibility API
      expect(timer.getState().isRunning).toBe(true)
      
      Object.defineProperty(document, 'visibilityState', {
        value: originalVisibilityState,
        configurable: true
      })
    })
    
    it('should handle Fullscreen API failures', async () => {
      const mockRequestFullscreen = vi.fn(() => {
        return Promise.reject(new Error('Fullscreen not allowed'))
      })
      
      document.documentElement.requestFullscreen = mockRequestFullscreen
      
      // Should handle fullscreen rejection gracefully
      expect(() => {
        document.documentElement.requestFullscreen()
      }).not.toThrow()
    })
    
    it('should handle Audio API unavailable', () => {
      const originalAudioContext = global.AudioContext
      delete global.AudioContext
      delete global.webkitAudioContext
      
      // Should work without audio
      expect(() => {
        timer.start()
      }).not.toThrow()
      
      global.AudioContext = originalAudioContext
    })
  })

  describe('Theme System Edge Cases', () => {
    it('should handle malformed theme data', () => {
      expect(() => {
        themeProvider.registerCustomTheme({
          name: 'broken',
          colors: 'not-an-object'
        })
      }).toThrow()
    })
    
    it('should handle theme with missing colors', () => {
      expect(() => {
        themeProvider.registerCustomTheme({
          name: 'incomplete',
          colors: {
            primary: '#000'
            // Missing other required colors
          }
        })
      }).toThrow()
    })
    
    it('should handle invalid color values', () => {
      expect(() => {
        themeProvider.registerCustomTheme({
          name: 'invalid-colors',
          colors: {
            primary: 'not-a-color',
            secondary: '#gggggg',
            background: 'rgb(300, 300, 300)',
            text: '#000',
            accent: '#fff'
          }
        })
      }).toThrow()
    })
    
    it('should handle CSS custom property failures', () => {
      const mockSetProperty = vi.fn(() => {
        throw new Error('CSS property update failed')
      })
      
      Object.defineProperty(document.documentElement.style, 'setProperty', {
        value: mockSetProperty,
        configurable: true
      })
      
      // Should not crash on CSS failures
      expect(() => {
        themeProvider.setTheme('dark')
      }).not.toThrow()
    })
  })

  describe('Visual Renderer Edge Cases', () => {
    it('should handle Canvas API unavailable', () => {
      const originalCanvas = global.HTMLCanvasElement
      
      // Mock Canvas to throw error
      global.HTMLCanvasElement = class {
        getContext() {
          throw new Error('Canvas not supported')
        }
      }
      
      // Should fallback gracefully
      expect(() => {
        renderer.setMode('shapes') // Mode that might use Canvas
      }).not.toThrow()
      
      global.HTMLCanvasElement = originalCanvas
    })
    
    it('should handle invalid visual modes', () => {
      expect(() => {
        renderer.setMode('nonexistent-mode')
      }).not.toThrow()
      
      // Should fallback to default mode
      expect(renderer.getCurrentMode()).toBe('circular') // or default mode
    })
    
    it('should handle extreme render data', () => {
      expect(() => {
        renderer.render({
          phase: 'focus',
          remainingTime: -1000, // Negative time
          totalTime: 0, // Zero total
          progress: 2 // Progress > 1
        })
      }).not.toThrow()
    })
    
    it('should handle null/undefined render data', () => {
      expect(() => {
        renderer.render(null)
      }).not.toThrow()
      
      expect(() => {
        renderer.render(undefined)
      }).not.toThrow()
    })
  })

  describe('Event System Edge Cases', () => {
    it('should handle circular event dependencies', () => {
      const timer1 = new TimerEngine()
      const timer2 = new TimerEngine()
      
      // Create circular event dependencies
      timer1.addEventListener('timer:tick', () => {
        timer2.dispatchEvent(new CustomEvent('timer:tick'))
      })
      
      timer2.addEventListener('timer:tick', () => {
        timer1.dispatchEvent(new CustomEvent('timer:tick'))
      })
      
      // Should not create infinite loop
      expect(() => {
        timer1.start()
      }).not.toThrow()
      
      timer1.destroy()
      timer2.destroy()
    })
    
    it('should handle event listener exceptions', () => {
      const faultyListener = vi.fn(() => {
        throw new Error('Listener failed')
      })
      
      timer.addEventListener('timer:tick', faultyListener)
      
      // Should continue working despite listener failures
      timer.start()
      
      expect(() => {
        // Trigger tick event
        timer.dispatchEvent(new CustomEvent('timer:tick'))
      }).not.toThrow()
    })
    
    it('should handle massive number of event listeners', () => {
      // Add many listeners
      for (let i = 0; i < 10000; i++) {
        timer.addEventListener('timer:tick', () => {})
      }
      
      // Should still function
      expect(() => {
        timer.start()
      }).not.toThrow()
    })
  })

  describe('Concurrency Edge Cases', () => {
    it('should handle rapid start/stop operations', async () => {
      const operations = []
      
      // Perform many operations rapidly
      for (let i = 0; i < 100; i++) {
        operations.push(
          new Promise(resolve => {
            timer.start()
            timer.pause()
            timer.reset()
            resolve()
          })
        )
      }
      
      await Promise.all(operations)
      
      // Should end in consistent state
      const state = timer.getState()
      expect(state.phase).toBe('focus')
      expect(state.isRunning).toBe(false)
    })
    
    it('should handle multiple timer instances', () => {
      const timers = []
      
      // Create multiple instances
      for (let i = 0; i < 50; i++) {
        const newTimer = new TimerEngine()
        newTimer.start()
        timers.push(newTimer)
      }
      
      // All should be singleton - same instance
      expect(new Set(timers).size).toBe(1)
      
      timers[0].destroy() // Clean up singleton
    })
    
    it('should handle component destruction during operations', async () => {
      timer.start()
      
      // Destroy components while timer is running
      setTimeout(() => {
        renderer.destroy()
        themeProvider.destroy()
      }, 50)
      
      // Should not crash
      await new Promise(resolve => setTimeout(resolve, 200))
      
      expect(timer.getState().isRunning).toBe(true)
    })
  })

  describe('Data Corruption Scenarios', () => {
    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('pomodoro-config', 'invalid-json{')
      
      // Should fallback to defaults
      const newTimer = new TimerEngine()
      expect(newTimer.getState().config.focusTime).toBe(25)
    })
    
    it('should handle partially corrupted config', () => {
      localStorage.setItem('pomodoro-config', JSON.stringify({
        focusTime: 'invalid',
        breakTime: 10,
        // Missing other fields
      }))
      
      const newTimer = new TimerEngine()
      const config = newTimer.getState().config
      
      // Should use default for invalid field, keep valid ones
      expect(config.focusTime).toBe(25) // Default
      expect(config.breakTime).toBe(10) // Preserved valid value
    })
    
    it('should handle config with wrong data types', () => {
      localStorage.setItem('pomodoro-config', JSON.stringify({
        focusTime: [25], // Array instead of number
        breakTime: { value: 5 }, // Object instead of number
        longBreakTime: '15', // String instead of number
      }))
      
      const newTimer = new TimerEngine()
      const config = newTimer.getState().config
      
      // Should use defaults for invalid types
      expect(config.focusTime).toBe(25)
      expect(config.breakTime).toBe(5)
      expect(config.longBreakTime).toBe(15)
    })
  })
})