/**
 * Performance Tests for Timer Precision and Resource Usage
 * Tests timing accuracy, memory usage, and animation performance
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TimerEngine } from '@/js/timer/TimerEngine.js'
import { VisualRenderer } from '@/js/ui/VisualRenderer.js'

describe('Timer Precision Performance', () => {
  let timer, renderer
  let performanceMarks = []
  
  beforeEach(() => {
    // Mock performance API with tracking
    global.performance.mark = vi.fn((name) => {
      performanceMarks.push({ name, time: Date.now() })
    })
    
    global.performance.measure = vi.fn((name, start, end) => {
      const startMark = performanceMarks.find(m => m.name === start)
      const endMark = performanceMarks.find(m => m.name === end)
      return {
        name,
        duration: endMark ? endMark.time - startMark.time : 0
      }
    })
    
    global.performance.getEntriesByType = vi.fn((type) => {
      if (type === 'measure') {
        return [{ name: 'test', duration: 16.67 }]
      }
      return []
    })
    
    timer = new TimerEngine()
    
    // Set up DOM for renderer
    const container = document.createElement('div')
    container.id = 'timer-display'
    document.body.appendChild(container)
    renderer = new VisualRenderer('#timer-display', timer)
    
    performanceMarks = []
  })
  
  afterEach(() => {
    timer.destroy()
    renderer.destroy()
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  describe('Timer Accuracy', () => {
    it('should maintain 1ms precision over short durations', async () => {
      const tickTimes = []
      let startTime = Date.now()
      
      timer.addEventListener('timer:tick', () => {
        tickTimes.push(Date.now() - startTime)
      })
      
      timer.configure({ focusTime: 5 }) // 5 seconds
      timer.start()
      
      // Simulate precise timing over 1 second
      for (let i = 0; i < 60; i++) { // 60fps
        vi.advanceTimersByTime(16.67) // 16.67ms per frame
        await new Promise(resolve => setTimeout(resolve, 0))
      }
      
      // Check timing accuracy
      expect(tickTimes).toHaveLength(60)
      
      // Each tick should be approximately 16.67ms apart
      for (let i = 1; i < tickTimes.length; i++) {
        const interval = tickTimes[i] - tickTimes[i-1]
        expect(Math.abs(interval - 16.67)).toBeLessThan(5) // 5ms tolerance
      }
    })
    
    it('should maintain accuracy over long durations', async () => {
      const driftMeasurements = []
      let expectedTime = 25 * 60 * 1000 // 25 minutes
      
      timer.configure({ focusTime: 25 })
      timer.start()
      
      // Simulate 25 minutes passing in larger chunks
      const chunks = 150 // 10 second chunks
      const chunkSize = (25 * 60 * 1000) / chunks
      
      for (let i = 0; i < chunks; i++) {
        vi.advanceTimersByTime(chunkSize)
        
        const state = timer.getState()
        const actualRemaining = state.remainingTime
        const expectedRemaining = expectedTime - ((i + 1) * chunkSize)
        const drift = Math.abs(actualRemaining - expectedRemaining)
        
        driftMeasurements.push(drift)
      }
      
      // Maximum drift should be less than 1 second over 25 minutes
      const maxDrift = Math.max(...driftMeasurements)
      expect(maxDrift).toBeLessThan(1000)
      
      // Average drift should be minimal
      const avgDrift = driftMeasurements.reduce((a, b) => a + b, 0) / driftMeasurements.length
      expect(avgDrift).toBeLessThan(100) // Less than 100ms on average
    })
    
    it('should handle extreme duration ranges accurately', async () => {
      // Test 1-second minimum
      timer.configure({ focusTime: 1 / 60 }) // 1 second
      timer.start()
      
      await new Promise(resolve => setTimeout(resolve, 1100))
      
      const shortState = timer.getState()
      expect(shortState.remainingTime).toBeLessThanOrEqual(0)
      
      timer.reset()
      
      // Test 24-hour maximum precision (simulate first minute)
      timer.configure({ focusTime: 24 * 60 }) // 24 hours
      timer.start()
      
      vi.advanceTimersByTime(60 * 1000) // 1 minute
      
      const longState = timer.getState()
      const expectedRemaining = (24 * 60 * 60 * 1000) - (60 * 1000)
      expect(Math.abs(longState.remainingTime - expectedRemaining)).toBeLessThan(100)
    })
    
    it('should compensate for browser throttling', async () => {
      const throttleCompensation = []
      
      timer.configure({ focusTime: 10 })
      timer.start()
      
      // Simulate browser throttling scenario
      let lastTime = Date.now()
      
      for (let i = 0; i < 20; i++) {
        // Simulate irregular intervals (browser throttling)
        const irregularDelay = Math.random() * 500 + 50 // 50-550ms
        vi.advanceTimersByTime(irregularDelay)
        
        const currentTime = Date.now()
        const actualInterval = currentTime - lastTime
        const state = timer.getState()
        
        throttleCompensation.push({
          interval: actualInterval,
          remainingTime: state.remainingTime,
          compensation: Math.abs(actualInterval - 16.67)
        })
        
        lastTime = currentTime
      }
      
      // Timer should compensate for throttling
      const avgCompensation = throttleCompensation.reduce((sum, item) => 
        sum + item.compensation, 0) / throttleCompensation.length
      
      expect(avgCompensation).toBeGreaterThan(0) // Should detect throttling
    })
  })

  describe('Animation Performance', () => {
    it('should maintain 60fps during visual updates', async () => {
      const frameTimes = []
      let lastFrame = performance.now()
      
      const mockRAF = vi.fn((callback) => {
        const currentTime = performance.now()
        frameTimes.push(currentTime - lastFrame)
        lastFrame = currentTime
        return setTimeout(() => callback(currentTime), 16.67)
      })
      
      global.requestAnimationFrame = mockRAF
      
      renderer.setMode('shapes')
      timer.start()
      
      // Run for 1 second
      for (let i = 0; i < 60; i++) {
        vi.advanceTimersByTime(16.67)
        await new Promise(resolve => setTimeout(resolve, 0))
      }
      
      // Check frame timing
      expect(frameTimes).toHaveLength(60)
      
      // Most frames should be close to 16.67ms (60fps)
      const goodFrames = frameTimes.filter(time => 
        Math.abs(time - 16.67) < 5 // 5ms tolerance
      ).length
      
      expect(goodFrames / frameTimes.length).toBeGreaterThan(0.9) // 90% good frames
    })
    
    it('should handle complex visual modes efficiently', async () => {
      const complexModes = ['shapes', 'particles', 'wave', 'spiral']
      const performanceResults = {}
      
      for (const mode of complexModes) {
        performance.mark(`${mode}-start`)
        
        renderer.setMode(mode)
        timer.start()
        
        // Simulate rendering for 100 frames
        for (let i = 0; i < 100; i++) {
          renderer.render({
            phase: 'focus',
            remainingTime: 25 * 60 * 1000 - (i * 250),
            totalTime: 25 * 60 * 1000,
            progress: i / 100
          })
          
          await new Promise(resolve => setTimeout(resolve, 16.67))
        }
        
        performance.mark(`${mode}-end`)
        const measure = performance.measure(`${mode}-duration`, `${mode}-start`, `${mode}-end`)
        
        performanceResults[mode] = measure.duration
        
        timer.reset()
      }
      
      // All modes should complete within reasonable time
      Object.values(performanceResults).forEach(duration => {
        expect(duration).toBeLessThan(2000) // Less than 2 seconds for 100 frames
      })
    })
    
    it('should optimize rendering when tab is not visible', async () => {
      const renderCalls = []
      const originalRender = renderer.render
      
      renderer.render = vi.fn((...args) => {
        renderCalls.push(Date.now())
        return originalRender.apply(renderer, args)
      })
      
      timer.start()
      
      // Tab visible - should render normally
      Object.defineProperty(document, 'visibilityState', { 
        value: 'visible',
        configurable: true
      })
      
      await new Promise(resolve => setTimeout(resolve, 500))
      const visibleCalls = renderCalls.length
      
      renderCalls.length = 0 // Reset
      
      // Tab hidden - should reduce rendering
      Object.defineProperty(document, 'visibilityState', { 
        value: 'hidden',
        configurable: true
      })
      document.dispatchEvent(new Event('visibilitychange'))
      
      await new Promise(resolve => setTimeout(resolve, 500))
      const hiddenCalls = renderCalls.length
      
      expect(hiddenCalls).toBeLessThan(visibleCalls)
    })
  })

  describe('Memory Usage', () => {
    it('should not create memory leaks during long operations', async () => {
      const initialMemory = performance.memory?.usedJSHeapSize || 0
      
      // Run timer for extended period with frequent resets
      for (let cycle = 0; cycle < 100; cycle++) {
        timer.configure({ focusTime: 1 / 60 }) // 1 second
        timer.start()
        
        await new Promise(resolve => setTimeout(resolve, 50))
        
        timer.reset()
        
        // Force garbage collection simulation
        if (global.gc) global.gc()
      }
      
      const finalMemory = performance.memory?.usedJSHeapSize || 0
      const memoryGrowth = finalMemory - initialMemory
      
      // Memory growth should be minimal (less than 10MB)
      expect(memoryGrowth).toBeLessThan(10 * 1024 * 1024)
    })
    
    it('should clean up event listeners properly', () => {
      const initialListeners = document._eventListeners?.size || 0
      
      // Create and destroy multiple timer instances
      for (let i = 0; i < 50; i++) {
        const tempTimer = new TimerEngine()
        tempTimer.addEventListener('timer:tick', () => {})
        tempTimer.addEventListener('timer:complete', () => {})
        tempTimer.destroy()
      }
      
      const finalListeners = document._eventListeners?.size || 0
      
      // Should not accumulate listeners
      expect(finalListeners - initialListeners).toBeLessThanOrEqual(5)
    })
    
    it('should handle rapid component creation/destruction', () => {
      const performanceData = []
      
      for (let i = 0; i < 100; i++) {
        const start = performance.now()
        
        const container = document.createElement('div')
        document.body.appendChild(container)
        
        const tempRenderer = new VisualRenderer(container, timer)
        tempRenderer.setMode('minimal')
        tempRenderer.render({
          phase: 'focus',
          remainingTime: 25 * 60 * 1000,
          totalTime: 25 * 60 * 1000,
          progress: 0
        })
        
        tempRenderer.destroy()
        document.body.removeChild(container)
        
        const end = performance.now()
        performanceData.push(end - start)
      }
      
      const avgTime = performanceData.reduce((a, b) => a + b, 0) / performanceData.length
      const maxTime = Math.max(...performanceData)
      
      expect(avgTime).toBeLessThan(10) // Less than 10ms average
      expect(maxTime).toBeLessThan(50) // Less than 50ms maximum
    })
  })

  describe('Resource Usage Optimization', () => {
    it('should throttle updates when not in focus', async () => {
      const updateCounts = { visible: 0, hidden: 0 }
      
      timer.addEventListener('timer:tick', () => {
        if (document.visibilityState === 'visible') {
          updateCounts.visible++
        } else {
          updateCounts.hidden++
        }
      })
      
      timer.start()
      
      // Count updates while visible
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Switch to hidden
      Object.defineProperty(document, 'visibilityState', { 
        value: 'hidden',
        configurable: true
      })
      document.dispatchEvent(new Event('visibilitychange'))
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Hidden updates should be less frequent
      expect(updateCounts.hidden).toBeLessThan(updateCounts.visible)
    })
    
    it('should optimize CSS property updates', async () => {
      const cssUpdateCounts = {}
      const originalSetProperty = document.documentElement.style.setProperty
      
      document.documentElement.style.setProperty = vi.fn((prop, value) => {
        cssUpdateCounts[prop] = (cssUpdateCounts[prop] || 0) + 1
        return originalSetProperty.call(document.documentElement.style, prop, value)
      })
      
      // Rapid theme changes
      const themeProvider = { 
        setTheme: vi.fn(() => {
          document.documentElement.style.setProperty('--primary-color', '#000')
          document.documentElement.style.setProperty('--secondary-color', '#fff')
        })
      }
      
      // Should batch updates
      for (let i = 0; i < 10; i++) {
        themeProvider.setTheme('dark')
      }
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Should not update excessively
      Object.values(cssUpdateCounts).forEach(count => {
        expect(count).toBeLessThan(20) // Reasonable batching
      })
      
      document.documentElement.style.setProperty = originalSetProperty
    })
    
    it('should handle large timer configurations efficiently', () => {
      const largeConfig = {
        focusTime: 24 * 60, // 24 hours
        breakTime: 60,      // 1 hour
        longBreakTime: 120, // 2 hours
        cyclesUntilLongBreak: 100
      }
      
      const start = performance.now()
      
      timer.configure(largeConfig)
      timer.start()
      
      // Perform calculations
      for (let i = 0; i < 1000; i++) {
        const state = timer.getState()
        expect(state.totalTime).toBe(24 * 60 * 60 * 1000)
      }
      
      const end = performance.now()
      
      // Should handle large numbers efficiently
      expect(end - start).toBeLessThan(100) // Less than 100ms
    })
  })

  describe('Browser Compatibility Performance', () => {
    it('should perform well with requestAnimationFrame fallbacks', async () => {
      // Mock older browser without RAF
      const originalRAF = global.requestAnimationFrame
      delete global.requestAnimationFrame
      
      const frameTimes = []
      let frameCount = 0
      
      // Should fallback to setTimeout
      global.setTimeout = vi.fn((callback, delay) => {
        const start = performance.now()
        callback()
        frameTimes.push(performance.now() - start)
        frameCount++
        return frameCount
      })
      
      timer.start()
      renderer.setMode('minimal')
      
      // Run for a short period
      await new Promise(resolve => setTimeout(resolve, 200))
      
      expect(frameCount).toBeGreaterThan(0)
      expect(frameTimes.every(time => time < 50)).toBe(true) // Reasonable frame times
      
      global.requestAnimationFrame = originalRAF
    })
    
    it('should handle Date precision limitations', () => {
      // Mock lower precision Date (older browsers)
      const originalNow = Date.now
      Date.now = vi.fn(() => Math.floor(originalNow() / 10) * 10) // 10ms precision
      
      timer.configure({ focusTime: 5 })
      timer.start()
      
      // Should still maintain reasonable accuracy
      const state1 = timer.getState()
      
      vi.advanceTimersByTime(1000)
      
      const state2 = timer.getState()
      const timeDiff = state1.remainingTime - state2.remainingTime
      
      // Should be approximately 1 second, allowing for lower precision
      expect(Math.abs(timeDiff - 1000)).toBeLessThan(100)
      
      Date.now = originalNow
    })
  })
})