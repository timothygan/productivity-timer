/**
 * Visual Regression Tests
 * Tests for visual consistency across themes and states
 */

import { test, expect } from '@playwright/test'

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Wait for fonts to load
    await page.waitForFunction(() => document.fonts.ready)
  })

  test.describe('Theme Visual Tests', () => {
    const themes = ['light', 'dark', 'purple', 'minimal']
    
    for (const theme of themes) {
      test(`should render ${theme} theme correctly`, async ({ page }) => {
        // Set theme
        await page.click('#settings-btn')
        await page.selectOption('#theme-select', theme)
        await page.click('#save-settings-btn')
        
        // Wait for theme transition
        await page.waitForTimeout(500)
        
        // Take screenshot
        await expect(page).toHaveScreenshot(`theme-${theme}-initial.png`, {
          fullPage: true,
          animations: 'disabled'
        })
      })
      
      test(`should show ${theme} theme timer running state`, async ({ page }) => {
        // Set theme and start timer
        await page.click('#settings-btn')
        await page.selectOption('#theme-select', theme)
        await page.click('#save-settings-btn')
        
        await page.click('#start-btn')
        await page.waitForTimeout(1000) // Let timer run briefly
        
        // Take screenshot of running state
        await expect(page).toHaveScreenshot(`theme-${theme}-running.png`, {
          fullPage: true,
          animations: 'disabled'
        })
      })
      
      test(`should show ${theme} theme settings modal`, async ({ page }) => {
        // Set theme and open settings
        await page.click('#settings-btn')
        await page.selectOption('#theme-select', theme)
        
        // Take screenshot of settings modal
        await expect(page).toHaveScreenshot(`theme-${theme}-settings.png`, {
          fullPage: true,
          animations: 'disabled'
        })
      })
    }
  })

  test.describe('Visual Modes Tests', () => {
    const visualModes = ['circular', 'bar', 'shapes', 'minimal']
    
    for (const mode of visualModes) {
      test(`should render ${mode} visual mode correctly`, async ({ page }) => {
        // Set visual mode
        await page.click('#settings-btn')
        await page.selectOption('#visual-mode-select', mode)
        await page.click('#save-settings-btn')
        
        // Wait for mode change
        await page.waitForTimeout(500)
        
        // Take screenshot
        await expect(page).toHaveScreenshot(`visual-mode-${mode}-static.png`, {
          clip: { x: 0, y: 100, width: 800, height: 400 }, // Focus on timer area
          animations: 'disabled'
        })
      })
      
      test(`should show ${mode} mode progress animation`, async ({ page }) => {
        // Set visual mode
        await page.click('#settings-btn')
        await page.selectOption('#visual-mode-select', mode)
        await page.click('#save-settings-btn')
        
        // Start timer and let it run
        await page.click('#start-btn')
        await page.waitForTimeout(2000)
        
        // Take screenshot showing progress
        await expect(page).toHaveScreenshot(`visual-mode-${mode}-progress.png`, {
          clip: { x: 0, y: 100, width: 800, height: 400 },
          animations: 'disabled'
        })
      })
    }
  })

  test.describe('Responsive Design Tests', () => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1024, height: 768 },
      { name: 'large-desktop', width: 1920, height: 1080 }
    ]
    
    for (const viewport of viewports) {
      test(`should render correctly on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ 
          width: viewport.width, 
          height: viewport.height 
        })
        
        // Wait for layout adjustment
        await page.waitForTimeout(500)
        
        // Take screenshot
        await expect(page).toHaveScreenshot(`responsive-${viewport.name}.png`, {
          fullPage: true,
          animations: 'disabled'
        })
      })
      
      test(`should show settings modal on ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ 
          width: viewport.width, 
          height: viewport.height 
        })
        
        await page.click('#settings-btn')
        await page.waitForTimeout(300)
        
        // Take screenshot of modal
        await expect(page).toHaveScreenshot(`responsive-${viewport.name}-modal.png`, {
          fullPage: true,
          animations: 'disabled'
        })
      })
    }
  })

  test.describe('State-Based Visual Tests', () => {
    test('should show focus phase visually', async ({ page }) => {
      await page.waitForTimeout(500)
      
      await expect(page).toHaveScreenshot('state-focus-initial.png', {
        clip: { x: 0, y: 50, width: 800, height: 500 },
        animations: 'disabled'
      })
    })
    
    test('should show break phase visually', async ({ page }) => {
      // Configure very short timer to reach break quickly
      await page.click('#settings-btn')
      await page.fill('#focus-time', '0.01') // 0.6 seconds
      await page.click('#save-settings-btn')
      
      // Start and wait for break phase
      await page.click('#start-btn')
      await page.waitForFunction(() => {
        return document.querySelector('.phase-indicator')?.textContent?.includes('Break')
      }, { timeout: 2000 })
      
      await expect(page).toHaveScreenshot('state-break-phase.png', {
        clip: { x: 0, y: 50, width: 800, height: 500 },
        animations: 'disabled'
      })
    })
    
    test('should show long break phase visually', async ({ page }) => {
      // Set up for long break (after 4 cycles)
      await page.click('#settings-btn')
      await page.fill('#focus-time', '0.01')
      await page.fill('#break-time', '0.01')
      await page.fill('#cycles-until-long-break', '1') // Long break after 1 cycle
      await page.click('#save-settings-btn')
      
      // Complete focus and break to reach long break
      await page.click('#start-btn')
      
      // Wait for long break phase
      await page.waitForFunction(() => {
        return document.querySelector('.phase-indicator')?.textContent?.includes('Long Break')
      }, { timeout: 5000 })
      
      await expect(page).toHaveScreenshot('state-long-break-phase.png', {
        clip: { x: 0, y: 50, width: 800, height: 500 },
        animations: 'disabled'
      })
    })
    
    test('should show paused state visually', async ({ page }) => {
      await page.click('#start-btn')
      await page.waitForTimeout(1000)
      await page.click('#pause-btn')
      await page.waitForTimeout(300)
      
      await expect(page).toHaveScreenshot('state-paused.png', {
        clip: { x: 0, y: 50, width: 800, height: 500 },
        animations: 'disabled'
      })
    })
  })

  test.describe('Fullscreen Visual Tests', () => {
    test('should render fullscreen mode correctly', async ({ page, browserName }) => {
      // Skip for webkit in CI due to limitations
      test.skip(browserName === 'webkit' && process.env.CI)
      
      await page.click('#fullscreen-btn')
      await page.waitForTimeout(1000)
      
      // Check if successfully in fullscreen
      const isFullscreen = await page.evaluate(() => 
        document.fullscreenElement !== null
      )
      
      if (isFullscreen) {
        await expect(page).toHaveScreenshot('fullscreen-mode.png', {
          fullPage: true,
          animations: 'disabled'
        })
      }
    })
    
    test('should show fullscreen with different themes', async ({ page, browserName }) => {
      test.skip(browserName === 'webkit' && process.env.CI)
      
      // Set dark theme
      await page.click('#settings-btn')
      await page.selectOption('#theme-select', 'dark')
      await page.click('#save-settings-btn')
      
      await page.click('#fullscreen-btn')
      await page.waitForTimeout(1000)
      
      const isFullscreen = await page.evaluate(() => 
        document.fullscreenElement !== null
      )
      
      if (isFullscreen) {
        await expect(page).toHaveScreenshot('fullscreen-dark-theme.png', {
          fullPage: true,
          animations: 'disabled'
        })
      }
    })
  })

  test.describe('Animation and Transition Tests', () => {
    test('should show theme transition states', async ({ page }) => {
      // Start with light theme
      await page.click('#settings-btn')
      await page.selectOption('#theme-select', 'light')
      await page.click('#save-settings-btn')
      await page.waitForTimeout(300)
      
      // Capture before transition
      await expect(page).toHaveScreenshot('transition-before.png', {
        animations: 'disabled'
      })
      
      // Switch to dark theme
      await page.click('#settings-btn')
      await page.selectOption('#theme-select', 'dark')
      await page.click('#save-settings-btn')
      
      // Capture during/after transition
      await page.waitForTimeout(300)
      await expect(page).toHaveScreenshot('transition-after.png', {
        animations: 'disabled'
      })
    })
    
    test('should show modal open/close animations', async ({ page }) => {
      // Take screenshot with modal closed
      await expect(page).toHaveScreenshot('modal-closed.png', {
        animations: 'disabled'
      })
      
      // Open modal
      await page.click('#settings-btn')
      await page.waitForTimeout(300) // Wait for animation
      
      // Take screenshot with modal open
      await expect(page).toHaveScreenshot('modal-open.png', {
        animations: 'disabled'
      })
    })
  })

  test.describe('Error State Visual Tests', () => {
    test('should show form validation errors visually', async ({ page }) => {
      await page.click('#settings-btn')
      
      // Enter invalid values
      await page.fill('#focus-time', '0')
      await page.fill('#break-time', '-5')
      
      // Trigger validation
      await page.click('#save-settings-btn')
      await page.waitForTimeout(300)
      
      await expect(page).toHaveScreenshot('form-validation-errors.png', {
        clip: { x: 0, y: 0, width: 800, height: 600 },
        animations: 'disabled'
      })
    })
    
    test('should show network error state', async ({ page }) => {
      // Block all network requests to simulate offline
      await page.route('**/*', route => {
        if (route.request().url().includes('api')) {
          route.abort()
        } else {
          route.continue()
        }
      })
      
      // Try to save settings (which might make API call)
      await page.click('#settings-btn')
      await page.fill('#focus-time', '30')
      await page.click('#save-settings-btn')
      
      // Should show error state
      await page.waitForTimeout(500)
      
      await expect(page).toHaveScreenshot('network-error-state.png', {
        animations: 'disabled'
      })
    })
  })

  test.describe('Accessibility Visual Indicators', () => {
    test('should show focus indicators clearly', async ({ page }) => {
      // Focus each interactive element and capture
      const focusableElements = [
        '#start-btn',
        '#pause-btn',
        '#reset-btn',
        '#settings-btn',
        '#fullscreen-btn'
      ]
      
      for (const selector of focusableElements) {
        await page.focus(selector)
        await page.waitForTimeout(100)
        
        const elementName = selector.replace('#', '').replace('-', '_')
        await expect(page).toHaveScreenshot(`focus-indicator-${elementName}.png`, {
          clip: { x: 0, y: 200, width: 800, height: 200 },
          animations: 'disabled'
        })
      }
    })
    
    test('should show high contrast mode support', async ({ page }) => {
      // Simulate high contrast mode with CSS
      await page.addStyleTag({
        content: `
          @media (prefers-contrast: high) {
            * {
              border: 2px solid #000 !important;
              background: #fff !important;
              color: #000 !important;
            }
          }
          
          /* Force high contrast for testing */
          body * {
            border: 1px solid #000 !important;
            background: #fff !important;
            color: #000 !important;
          }
        `
      })
      
      await page.waitForTimeout(500)
      
      await expect(page).toHaveScreenshot('high-contrast-mode.png', {
        fullPage: true,
        animations: 'disabled'
      })
    })
  })

  test.describe('Color Scheme Tests', () => {
    test('should respect prefers-color-scheme: dark', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' })
      await page.reload()
      await page.waitForLoadState('networkidle')
      
      await expect(page).toHaveScreenshot('prefers-color-scheme-dark.png', {
        fullPage: true,
        animations: 'disabled'
      })
    })
    
    test('should respect prefers-color-scheme: light', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'light' })
      await page.reload()
      await page.waitForLoadState('networkidle')
      
      await expect(page).toHaveScreenshot('prefers-color-scheme-light.png', {
        fullPage: true,
        animations: 'disabled'
      })
    })
  })
})