/**
 * Cross-Browser Compatibility Tests
 * Tests functionality across different browsers and devices
 */

import { test, expect } from '@playwright/test'

test.describe('Cross-Browser Compatibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test.describe('Basic Functionality', () => {
    test('should load and display timer interface', async ({ page }) => {
      // Check main elements are visible
      await expect(page.locator('#timer-display')).toBeVisible()
      await expect(page.locator('#start-btn')).toBeVisible()
      await expect(page.locator('#pause-btn')).toBeVisible()
      await expect(page.locator('#reset-btn')).toBeVisible()
      
      // Check initial timer state
      await expect(page.locator('#timer-display')).toContainText('25:00')
      await expect(page.locator('.phase-indicator')).toContainText('Focus')
    })
    
    test('should start and pause timer across browsers', async ({ page, browserName }) => {
      // Start timer
      await page.click('#start-btn')
      
      // Wait for timer to tick
      await page.waitForTimeout(1500)
      
      // Check timer is running
      const timeText = await page.locator('.time-display').textContent()
      expect(timeText).not.toBe('25:00') // Should have decreased
      
      // Pause timer
      await page.click('#pause-btn')
      
      // Verify pause state
      await expect(page.locator('#start-btn')).toBeEnabled()
      await expect(page.locator('#pause-btn')).toBeDisabled()
    })
    
    test('should handle keyboard shortcuts', async ({ page }) => {
      // Test spacebar to start/pause
      await page.keyboard.press('Space')
      await expect(page.locator('#start-btn')).toBeDisabled()
      
      await page.keyboard.press('Space')
      await expect(page.locator('#start-btn')).toBeEnabled()
      
      // Test Enter on focused button
      await page.locator('#reset-btn').focus()
      await page.keyboard.press('Enter')
      
      // Timer should be reset
      await expect(page.locator('#timer-display')).toContainText('25:00')
    })
  })

  test.describe('Theme System', () => {
    test('should switch themes correctly', async ({ page }) => {
      // Open settings
      await page.click('#settings-btn')
      await expect(page.locator('#settings-modal')).toBeVisible()
      
      // Change theme
      await page.selectOption('#theme-select', 'dark')
      
      // Verify theme change
      const bgColor = await page.locator('body').evaluate(el => 
        getComputedStyle(el).backgroundColor
      )
      
      expect(bgColor).not.toBe('rgb(255, 255, 255)') // Should not be white
    })
    
    test('should persist theme preference', async ({ page }) => {
      // Set dark theme
      await page.click('#settings-btn')
      await page.selectOption('#theme-select', 'dark')
      await page.click('#save-settings-btn')
      
      // Reload page
      await page.reload()
      await page.waitForLoadState('networkidle')
      
      // Theme should be persisted
      const bgColor = await page.locator('body').evaluate(el => 
        getComputedStyle(el).backgroundColor
      )
      
      expect(bgColor).not.toBe('rgb(255, 255, 255)') // Should still be dark
    })
  })

  test.describe('Fullscreen Functionality', () => {
    test('should handle fullscreen mode', async ({ page, browserName }) => {
      // Skip test for webkit on CI (Safari fullscreen limitations)
      test.skip(browserName === 'webkit' && process.env.CI, 'Safari fullscreen in CI')
      
      // Test fullscreen toggle
      await page.click('#fullscreen-btn')
      
      // Wait for fullscreen transition
      await page.waitForTimeout(1000)
      
      // Check if fullscreen (different browsers handle differently)
      const isFullscreen = await page.evaluate(() => {
        return document.fullscreenElement !== null ||
               document.webkitFullscreenElement !== null ||
               document.msFullscreenElement !== null
      })
      
      if (isFullscreen) {
        // Exit fullscreen
        await page.keyboard.press('Escape')
        await page.waitForTimeout(500)
      }
    })
  })

  test.describe('Audio Features', () => {
    test('should handle audio notifications', async ({ page }) => {
      // Configure short timer for quick test
      await page.click('#settings-btn')
      await page.fill('#focus-time', '1') // 1 second
      await page.click('#save-settings-btn')
      
      // Start timer
      await page.click('#start-btn')
      
      // Wait for completion (allow extra time for different browser speeds)
      await page.waitForTimeout(2000)
      
      // Should complete and move to break phase
      await expect(page.locator('.phase-indicator')).toContainText('Break', { timeout: 3000 })
    })
    
    test('should respect audio settings', async ({ page }) => {
      // Disable audio
      await page.click('#settings-btn')
      await page.uncheck('#audio-enabled')
      await page.click('#save-settings-btn')
      
      // Audio preference should be saved
      await page.reload()
      await page.click('#settings-btn')
      await expect(page.locator('#audio-enabled')).not.toBeChecked()
    })
  })

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }) // iPhone SE
      
      // All main elements should still be visible
      await expect(page.locator('#timer-display')).toBeVisible()
      await expect(page.locator('#control-panel')).toBeVisible()
      
      // Touch targets should be large enough
      const buttonHeight = await page.locator('#start-btn').evaluate(el => {
        const rect = el.getBoundingClientRect()
        return rect.height
      })
      
      expect(buttonHeight).toBeGreaterThan(44) // WCAG touch target minimum
    })
    
    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }) // iPad
      
      // Layout should adapt
      await expect(page.locator('#timer-display')).toBeVisible()
      
      // Timer should be larger on tablet
      const timerSize = await page.locator('#timer-display').evaluate(el => {
        const rect = el.getBoundingClientRect()
        return { width: rect.width, height: rect.height }
      })
      
      expect(timerSize.width).toBeGreaterThan(200) // Should be reasonably large
    })
    
    test('should work on large desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      
      // Content should not be stretched too wide
      const maxWidth = await page.locator('#app').evaluate(el => {
        const rect = el.getBoundingClientRect()
        return rect.width
      })
      
      expect(maxWidth).toBeLessThan(1400) // Should have reasonable max-width
    })
  })

  test.describe('Performance Across Browsers', () => {
    test('should maintain timer accuracy', async ({ page }) => {
      // Configure 3-second timer for testing
      await page.click('#settings-btn')
      await page.fill('#focus-time', '0.05') // 3 seconds (0.05 minutes)
      await page.click('#save-settings-btn')
      
      const startTime = Date.now()
      await page.click('#start-btn')
      
      // Wait for timer completion
      await page.waitForFunction(() => {
        const display = document.querySelector('.phase-indicator')
        return display && display.textContent.includes('Break')
      }, { timeout: 5000 })
      
      const endTime = Date.now()
      const actualDuration = endTime - startTime
      
      // Should be approximately 3 seconds (allowing for browser variations)
      expect(actualDuration).toBeGreaterThan(2500)
      expect(actualDuration).toBeLessThan(4000)
    })
    
    test('should handle rapid user interactions', async ({ page }) => {
      // Rapid button clicks
      for (let i = 0; i < 10; i++) {
        await page.click('#start-btn', { force: true })
        await page.click('#pause-btn', { force: true })
      }
      
      // Should not crash or become unresponsive
      await expect(page.locator('#timer-display')).toBeVisible()
      await expect(page.locator('#start-btn')).toBeEnabled()
    })
  })

  test.describe('Browser-Specific Features', () => {
    test('should handle Page Visibility API', async ({ page }) => {
      // Start timer
      await page.click('#start-btn')
      await page.waitForTimeout(500)
      
      const timeBeforeHide = await page.locator('.time-display').textContent()
      
      // Simulate tab becoming hidden
      await page.evaluate(() => {
        Object.defineProperty(document, 'visibilityState', { value: 'hidden' })
        document.dispatchEvent(new Event('visibilitychange'))
      })
      
      await page.waitForTimeout(1000)
      
      // Simulate tab becoming visible
      await page.evaluate(() => {
        Object.defineProperty(document, 'visibilityState', { value: 'visible' })
        document.dispatchEvent(new Event('visibilitychange'))
      })
      
      await page.waitForTimeout(500)
      
      const timeAfterShow = await page.locator('.time-display').textContent()
      
      // Time should have progressed even while hidden
      expect(timeAfterShow).not.toBe(timeBeforeHide)
    })
    
    test('should work without modern APIs', async ({ page }) => {
      // Disable modern APIs to test fallbacks
      await page.addInitScript(() => {
        delete window.requestAnimationFrame
        delete window.performance
        // Remove other modern APIs as needed for testing
      })
      
      await page.goto('/')
      
      // Should still work with fallbacks
      await expect(page.locator('#timer-display')).toBeVisible()
      await page.click('#start-btn')
      await page.waitForTimeout(1000)
      
      // Timer should still function
      const timeText = await page.locator('.time-display').textContent()
      expect(timeText).not.toBe('25:00')
    })
  })

  test.describe('Local Storage Across Browsers', () => {
    test('should persist settings across sessions', async ({ page }) => {
      // Set custom configuration
      await page.click('#settings-btn')
      await page.fill('#focus-time', '30')
      await page.fill('#break-time', '10')
      await page.selectOption('#theme-select', 'purple')
      await page.click('#save-settings-btn')
      
      // Close and reopen page
      await page.close()
      
      // Create new page in same context (preserves localStorage)
      const context = await page.context()
      const newPage = await context.newPage()
      await newPage.goto('/')
      
      // Settings should be restored
      await newPage.click('#settings-btn')
      await expect(newPage.locator('#focus-time')).toHaveValue('30')
      await expect(newPage.locator('#break-time')).toHaveValue('10')
      await expect(newPage.locator('#theme-select')).toHaveValue('purple')
    })
    
    test('should handle localStorage unavailable', async ({ page }) => {
      // Disable localStorage
      await page.addInitScript(() => {
        delete window.localStorage
      })
      
      await page.goto('/')
      
      // Should still work without localStorage
      await expect(page.locator('#timer-display')).toBeVisible()
      await page.click('#start-btn')
      
      // Settings should work but not persist
      await page.click('#settings-btn')
      await page.fill('#focus-time', '15')
      await page.click('#save-settings-btn')
      
      // Should not crash
      await expect(page.locator('#timer-display')).toBeVisible()
    })
  })

  test.describe('Error Handling', () => {
    test('should handle JavaScript errors gracefully', async ({ page }) => {
      // Monitor console errors
      const errors = []
      page.on('pageerror', error => errors.push(error))
      
      // Force some error conditions
      await page.evaluate(() => {
        // Simulate network failure for audio loading
        const audio = new Audio('nonexistent.mp3')
        audio.play().catch(() => {}) // Should not crash app
      })
      
      await page.waitForTimeout(1000)
      
      // App should still be functional
      await expect(page.locator('#timer-display')).toBeVisible()
      await page.click('#start-btn')
      
      // Should not have critical errors
      const criticalErrors = errors.filter(error => 
        error.message.includes('TypeError') || error.message.includes('ReferenceError')
      )
      expect(criticalErrors).toHaveLength(0)
    })
    
    test('should handle CSS loading failures', async ({ page }) => {
      // Block CSS loading
      await page.route('**/*.css', route => route.abort())
      
      await page.goto('/')
      
      // Core functionality should still work
      await expect(page.locator('#timer-display')).toBeVisible()
      await page.click('#start-btn')
      
      // Timer should function even without styles
      await page.waitForTimeout(1000)
      const timeText = await page.locator('.time-display').textContent()
      expect(timeText).not.toBe('25:00')
    })
  })
})