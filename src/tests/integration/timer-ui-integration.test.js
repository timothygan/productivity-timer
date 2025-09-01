/**
 * Integration Tests for Timer-UI Components
 * Tests the interaction between TimerEngine, VisualRenderer, and ControlPanel
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TimerEngine } from '@/js/timer/TimerEngine.js'
import { VisualRenderer } from '@/js/ui/VisualRenderer.js'
import { ControlPanel } from '@/js/ui/ControlPanel.js'
import { ThemeProvider } from '@/js/ui/ThemeProvider.js'

describe('Timer-UI Integration', () => {
  let timer, renderer, controls, themeProvider
  let container
  
  beforeEach(() => {
    // Set up DOM container
    container = document.createElement('div')
    container.id = 'app'
    container.innerHTML = `
      <div id="timer-display"></div>
      <div id="control-panel">
        <button id="start-btn">Start</button>
        <button id="pause-btn">Pause</button>
        <button id="reset-btn">Reset</button>
      </div>
      <div id="settings-modal" class="hidden">
        <input id="focus-time" type="number" value="25">
        <input id="break-time" type="number" value="5">
      </div>
    `
    document.body.appendChild(container)
    
    // Initialize components
    timer = new TimerEngine()
    themeProvider = new ThemeProvider()
    renderer = new VisualRenderer('#timer-display', timer)
    controls = new ControlPanel('#control-panel', timer)
  })
  
  afterEach(() => {
    timer.destroy()
    renderer.destroy()
    controls.destroy()
    themeProvider.destroy()
    document.body.removeChild(container)
    vi.restoreAllMocks()
  })

  describe('Timer-Visual Integration', () => {
    it('should update visual display when timer ticks', async () => {
      const renderSpy = vi.spyOn(renderer, 'render')
      
      timer.configure({ focusTime: 2 })
      timer.start()
      
      // Wait for tick events
      await new Promise(resolve => setTimeout(resolve, 100))
      
      expect(renderSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          phase: 'focus',
          remainingTime: expect.any(Number),
          progress: expect.any(Number)
        })
      )
    })
    
    it('should change visual mode when timer phase changes', async () => {
      const setModeSpy = vi.spyOn(renderer, 'setMode')
      
      timer.configure({ focusTime: 1, breakTime: 1 })
      timer.start()
      
      // Simulate time completion to trigger phase change
      await simulateTimerComplete()
      
      expect(setModeSpy).toHaveBeenCalledWith('break')
    })
    
    it('should animate phase transitions', async () => {
      const animateSpy = vi.spyOn(renderer, 'animate')
      
      timer.configure({ focusTime: 1 })
      timer.start()
      
      await simulateTimerComplete()
      
      expect(animateSpy).toHaveBeenCalledWith('phase-transition')
    })
    
    it('should sync visual state with timer state', () => {
      timer.configure({ focusTime: 10 })
      timer.start()
      timer.pause()
      
      const timerState = timer.getState()
      const rendererState = renderer.getCurrentState()
      
      expect(rendererState.isRunning).toBe(timerState.isRunning)
      expect(rendererState.phase).toBe(timerState.phase)
      expect(rendererState.progress).toBe(1 - (timerState.remainingTime / timerState.totalTime))
    })
  })

  describe('Timer-Control Integration', () => {
    it('should start timer when start button is clicked', () => {
      const startSpy = vi.spyOn(timer, 'start')
      const startBtn = container.querySelector('#start-btn')
      
      startBtn.click()
      
      expect(startSpy).toHaveBeenCalled()
      expect(timer.getState().isRunning).toBe(true)
    })
    
    it('should pause timer when pause button is clicked', () => {
      timer.start()
      const pauseSpy = vi.spyOn(timer, 'pause')
      const pauseBtn = container.querySelector('#pause-btn')
      
      pauseBtn.click()
      
      expect(pauseSpy).toHaveBeenCalled()
      expect(timer.getState().isPaused).toBe(true)
    })
    
    it('should reset timer when reset button is clicked', () => {
      timer.start()
      const resetSpy = vi.spyOn(timer, 'reset')
      const resetBtn = container.querySelector('#reset-btn')
      
      resetBtn.click()
      
      expect(resetSpy).toHaveBeenCalled()
      expect(timer.getState().isRunning).toBe(false)
      expect(timer.getState().phase).toBe('focus')
    })
    
    it('should update control states based on timer state', () => {
      const updateSpy = vi.spyOn(controls, 'updateState')
      
      timer.start()
      
      expect(updateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          isRunning: true,
          phase: 'focus'
        })
      )
    })
    
    it('should handle keyboard shortcuts', () => {
      const startSpy = vi.spyOn(timer, 'start')
      
      // Simulate spacebar press
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space' }))
      
      expect(startSpy).toHaveBeenCalled()
    })
  })

  describe('Theme-Visual Integration', () => {
    it('should update visual colors when theme changes', () => {
      const updateThemeSpy = vi.spyOn(renderer, 'updateTheme')
      
      themeProvider.setTheme('dark')
      
      expect(updateThemeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'dark',
          colors: expect.any(Object)
        })
      )
    })
    
    it('should apply theme transitions to visual elements', async () => {
      renderer.setMode('shapes')
      
      themeProvider.setTheme('purple')
      
      const visualElement = container.querySelector('#timer-display')
      expect(visualElement.classList.contains('theme-transition')).toBe(true)
      
      // Simulate transition end
      visualElement.dispatchEvent(new TransitionEvent('transitionend'))
      
      await new Promise(resolve => setTimeout(resolve, 50))
      expect(visualElement.classList.contains('theme-transition')).toBe(false)
    })
    
    it('should maintain visual mode consistency across theme changes', () => {
      renderer.setMode('minimal')
      const initialMode = renderer.getCurrentMode()
      
      themeProvider.setTheme('dark')
      
      expect(renderer.getCurrentMode()).toBe(initialMode)
    })
  })

  describe('Settings Integration', () => {
    it('should update timer configuration from settings', () => {
      const configSpy = vi.spyOn(timer, 'configure')
      const focusInput = container.querySelector('#focus-time')
      const breakInput = container.querySelector('#break-time')
      
      focusInput.value = '30'
      breakInput.value = '10'
      
      focusInput.dispatchEvent(new Event('change'))
      breakInput.dispatchEvent(new Event('change'))
      
      expect(configSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          focusTime: 30,
          breakTime: 10
        })
      )
    })
    
    it('should validate settings input', () => {
      const focusInput = container.querySelector('#focus-time')
      
      focusInput.value = '0' // Invalid
      focusInput.dispatchEvent(new Event('change'))
      
      expect(focusInput.classList.contains('error')).toBe(true)
    })
    
    it('should persist settings changes', () => {
      const focusInput = container.querySelector('#focus-time')
      
      focusInput.value = '45'
      focusInput.dispatchEvent(new Event('change'))
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'pomodoro-config',
        expect.stringContaining('"focusTime":45')
      )
    })
  })

  describe('Fullscreen Integration', () => {
    it('should trigger fullscreen mode and update visuals', async () => {
      const enterFullscreenSpy = vi.spyOn(document.documentElement, 'requestFullscreen')
      const updateLayoutSpy = vi.spyOn(renderer, 'updateLayout')
      
      // Simulate fullscreen button click
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'F11' }))
      
      expect(enterFullscreenSpy).toHaveBeenCalled()
      
      // Simulate fullscreen change
      Object.defineProperty(document, 'fullscreenElement', { 
        value: document.documentElement,
        configurable: true
      })
      document.dispatchEvent(new Event('fullscreenchange'))
      
      expect(updateLayoutSpy).toHaveBeenCalledWith({ fullscreen: true })
    })
    
    it('should exit fullscreen and restore layout', async () => {
      const exitFullscreenSpy = vi.spyOn(document, 'exitFullscreen')
      const updateLayoutSpy = vi.spyOn(renderer, 'updateLayout')
      
      // First enter fullscreen
      Object.defineProperty(document, 'fullscreenElement', { 
        value: document.documentElement,
        configurable: true
      })
      
      // Then exit
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      
      expect(exitFullscreenSpy).toHaveBeenCalled()
      
      // Simulate fullscreen exit
      Object.defineProperty(document, 'fullscreenElement', { 
        value: null,
        configurable: true
      })
      document.dispatchEvent(new Event('fullscreenchange'))
      
      expect(updateLayoutSpy).toHaveBeenCalledWith({ fullscreen: false })
    })
  })

  describe('Audio Integration', () => {
    it('should play notification sound on timer complete', async () => {
      // Mock Howler audio
      const mockHowl = {
        play: vi.fn(),
        volume: vi.fn().mockReturnValue(mockHowl)
      }
      global.Howl = vi.fn(() => mockHowl)
      
      timer.configure({ focusTime: 1 })
      timer.start()
      
      await simulateTimerComplete()
      
      expect(mockHowl.play).toHaveBeenCalled()
    })
    
    it('should respect audio settings', async () => {
      const mockHowl = {
        play: vi.fn(),
        volume: vi.fn().mockReturnValue(mockHowl)
      }
      global.Howl = vi.fn(() => mockHowl)
      
      // Disable audio in settings
      localStorage.setItem('pomodoro-settings', JSON.stringify({ audioEnabled: false }))
      
      timer.configure({ focusTime: 1 })
      timer.start()
      
      await simulateTimerComplete()
      
      expect(mockHowl.play).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling Integration', () => {
    it('should handle component initialization failures gracefully', () => {
      // Simulate renderer initialization failure
      const mockRenderer = vi.spyOn(VisualRenderer.prototype, 'constructor')
        .mockImplementation(() => { throw new Error('Renderer failed') })
      
      expect(() => {
        new VisualRenderer('#timer-display', timer)
      }).not.toThrow()
      
      mockRenderer.mockRestore()
    })
    
    it('should maintain functionality when one component fails', () => {
      // Simulate visual renderer failure
      vi.spyOn(renderer, 'render').mockImplementation(() => {
        throw new Error('Render failed')
      })
      
      // Timer should still function
      expect(() => timer.start()).not.toThrow()
      expect(timer.getState().isRunning).toBe(true)
    })
    
    it('should handle DOM element not found errors', () => {
      expect(() => {
        new VisualRenderer('#non-existent-element', timer)
      }).not.toThrow()
    })
  })

  describe('Performance Integration', () => {
    it('should maintain 60fps during animations', async () => {
      const frameCount = { count: 0 }
      const originalRAF = global.requestAnimationFrame
      
      global.requestAnimationFrame = vi.fn((callback) => {
        frameCount.count++
        return originalRAF(callback)
      })
      
      renderer.setMode('shapes')
      timer.start()
      
      await new Promise(resolve => setTimeout(resolve, 1000)) // 1 second
      
      // Should have approximately 60 frames
      expect(frameCount.count).toBeGreaterThan(50)
      expect(frameCount.count).toBeLessThan(70)
      
      global.requestAnimationFrame = originalRAF
    })
    
    it('should debounce rapid user interactions', async () => {
      const startSpy = vi.spyOn(timer, 'start')
      const startBtn = container.querySelector('#start-btn')
      
      // Rapid clicks
      for (let i = 0; i < 10; i++) {
        startBtn.click()
      }
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Should only call start once
      expect(startSpy).toHaveBeenCalledTimes(1)
    })
  })

  // Helper functions
  async function simulateTimerComplete() {
    // Mock timer completion
    vi.spyOn(timer, 'getState').mockReturnValue({
      ...timer.getState(),
      remainingTime: 0
    })
    
    timer.dispatchEvent(new CustomEvent('timer:complete', {
      detail: { phase: 'focus', completedCycle: 1 }
    }))
    
    await new Promise(resolve => setTimeout(resolve, 50))
  }
})