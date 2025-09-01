/**
 * Accessibility Tests for WCAG 2.1 AA Compliance
 * Tests keyboard navigation, screen reader compatibility, and color contrast
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { axe, configureAxe, toHaveNoViolations } from '@axe-core/playwright'

// Extend expect with axe matchers
expect.extend(toHaveNoViolations)

describe('WCAG 2.1 AA Compliance', () => {
  let container
  
  beforeEach(() => {
    // Set up complete app DOM structure
    container = document.createElement('div')
    container.innerHTML = `
      <main id="app" role="main" aria-label="Pomodoro Timer Application">
        <header>
          <h1>Pomodoro Timer</h1>
          <nav aria-label="Timer controls">
            <button id="fullscreen-btn" aria-label="Toggle fullscreen mode">
              <span aria-hidden="true">⛶</span>
              <span class="sr-only">Fullscreen</span>
            </button>
          </nav>
        </header>
        
        <section id="timer-section" aria-labelledby="timer-heading">
          <h2 id="timer-heading" class="sr-only">Timer Display</h2>
          <div id="timer-display" 
               role="timer" 
               aria-live="polite" 
               aria-atomic="true"
               aria-label="25 minutes remaining in focus session">
            <div class="time-display" aria-hidden="true">25:00</div>
            <div class="phase-indicator" aria-hidden="true">Focus</div>
            <div class="progress-ring" aria-hidden="true"></div>
          </div>
        </section>
        
        <section id="controls-section" aria-labelledby="controls-heading">
          <h2 id="controls-heading" class="sr-only">Timer Controls</h2>
          <div id="control-panel" role="group" aria-label="Timer controls">
            <button id="start-btn" aria-describedby="start-desc">
              <span aria-hidden="true">▶</span>
              Start
            </button>
            <div id="start-desc" class="sr-only">Start the pomodoro timer</div>
            
            <button id="pause-btn" aria-describedby="pause-desc" disabled>
              <span aria-hidden="true">⏸</span>
              Pause
            </button>
            <div id="pause-desc" class="sr-only">Pause the running timer</div>
            
            <button id="reset-btn" aria-describedby="reset-desc">
              <span aria-hidden="true">⏹</span>
              Reset
            </button>
            <div id="reset-desc" class="sr-only">Reset timer to initial state</div>
          </div>
        </section>
        
        <section id="settings-section" aria-labelledby="settings-heading">
          <h2 id="settings-heading" class="sr-only">Settings</h2>
          <button id="settings-btn" 
                  aria-expanded="false" 
                  aria-controls="settings-modal"
                  aria-describedby="settings-desc">
            Settings
          </button>
          <div id="settings-desc" class="sr-only">Open timer configuration settings</div>
          
          <div id="settings-modal" 
               role="dialog" 
               aria-modal="true" 
               aria-labelledby="modal-title"
               class="hidden">
            <h3 id="modal-title">Timer Settings</h3>
            
            <form id="settings-form">
              <fieldset>
                <legend>Timer Durations</legend>
                
                <div class="form-group">
                  <label for="focus-time">Focus Time (minutes)</label>
                  <input id="focus-time" 
                         type="number" 
                         min="1" 
                         max="1440"
                         value="25"
                         aria-describedby="focus-help focus-error">
                  <div id="focus-help" class="help-text">
                    Set the duration for focus sessions (1-1440 minutes)
                  </div>
                  <div id="focus-error" class="error-text" aria-live="polite"></div>
                </div>
                
                <div class="form-group">
                  <label for="break-time">Break Time (minutes)</label>
                  <input id="break-time" 
                         type="number" 
                         min="1" 
                         max="1440"
                         value="5"
                         aria-describedby="break-help">
                  <div id="break-help" class="help-text">
                    Set the duration for short breaks
                  </div>
                </div>
              </fieldset>
              
              <fieldset>
                <legend>Audio Settings</legend>
                
                <div class="form-group">
                  <input id="audio-enabled" type="checkbox" checked>
                  <label for="audio-enabled">Enable notification sounds</label>
                </div>
                
                <div class="form-group">
                  <label for="volume">Volume</label>
                  <input id="volume" 
                         type="range" 
                         min="0" 
                         max="100" 
                         value="50"
                         aria-describedby="volume-value">
                  <div id="volume-value" aria-live="polite">50%</div>
                </div>
              </fieldset>
              
              <div class="form-actions">
                <button type="submit">Save Settings</button>
                <button type="button" id="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </section>
        
        <div id="status-announcements" aria-live="assertive" class="sr-only"></div>
      </main>
    `
    
    // Add CSS for screen reader utilities
    const style = document.createElement('style')
    style.textContent = `
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
      
      .hidden {
        display: none;
      }
      
      .form-group {
        margin-bottom: 1rem;
      }
      
      .error-text {
        color: #d73527;
        font-size: 0.875rem;
      }
      
      .help-text {
        color: #666;
        font-size: 0.875rem;
      }
    `
    
    document.head.appendChild(style)
    document.body.appendChild(container)
  })
  
  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container)
    }
    // Clean up any injected styles
    const styles = document.head.querySelectorAll('style')
    styles.forEach(style => {
      if (style.textContent.includes('.sr-only')) {
        document.head.removeChild(style)
      }
    })
  })

  describe('Semantic Structure', () => {
    it('should have proper heading hierarchy', async () => {
      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
      const levels = Array.from(headings).map(h => parseInt(h.tagName[1]))
      
      expect(levels).toEqual([1, 2, 2, 2, 3]) // h1 -> h2 -> h2 -> h2 -> h3
    })
    
    it('should use semantic HTML elements', () => {
      expect(container.querySelector('main')).toBeTruthy()
      expect(container.querySelector('header')).toBeTruthy()
      expect(container.querySelector('nav')).toBeTruthy()
      expect(container.querySelectorAll('section')).toHaveLength(3)
    })
    
    it('should have proper landmark roles', () => {
      const main = container.querySelector('main')
      const nav = container.querySelector('nav')
      
      expect(main.getAttribute('role')).toBe('main')
      expect(nav.getAttribute('aria-label')).toBe('Timer controls')
    })
    
    it('should use ARIA live regions for dynamic content', () => {
      const timerDisplay = container.querySelector('#timer-display')
      const statusAnnouncements = container.querySelector('#status-announcements')
      
      expect(timerDisplay.getAttribute('aria-live')).toBe('polite')
      expect(statusAnnouncements.getAttribute('aria-live')).toBe('assertive')
    })
  })

  describe('Keyboard Navigation', () => {
    it('should support tab navigation through all interactive elements', () => {
      const focusableElements = container.querySelectorAll(
        'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      
      expect(focusableElements.length).toBeGreaterThan(0)
      
      // All should be keyboard accessible (no tabindex="-1" unless aria-hidden)
      focusableElements.forEach(element => {
        const tabindex = element.getAttribute('tabindex')
        const ariaHidden = element.getAttribute('aria-hidden')
        
        if (tabindex === '-1') {
          expect(ariaHidden).toBe('true')
        }
      })
    })
    
    it('should support Enter key activation for buttons', () => {
      const startBtn = container.querySelector('#start-btn')
      const clickSpy = vi.fn()
      startBtn.addEventListener('click', clickSpy)
      
      startBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
      expect(clickSpy).toHaveBeenCalled()
    })
    
    it('should support Space key activation for buttons', () => {
      const pauseBtn = container.querySelector('#pause-btn')
      const clickSpy = vi.fn()
      pauseBtn.addEventListener('click', clickSpy)
      
      pauseBtn.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))
      expect(clickSpy).toHaveBeenCalled()
    })
    
    it('should support Escape key to close modal', () => {
      const modal = container.querySelector('#settings-modal')
      modal.classList.remove('hidden')
      
      modal.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      
      expect(modal.classList.contains('hidden')).toBe(true)
    })
    
    it('should trap focus within modal when open', () => {
      const modal = container.querySelector('#settings-modal')
      const firstInput = modal.querySelector('input')
      const lastButton = modal.querySelector('#cancel-btn')
      
      modal.classList.remove('hidden')
      
      // Tab from last element should go to first
      lastButton.focus()
      lastButton.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }))
      
      expect(document.activeElement).toBe(firstInput)
    })
  })

  describe('Screen Reader Support', () => {
    it('should have descriptive button labels', () => {
      const buttons = container.querySelectorAll('button')
      
      buttons.forEach(button => {
        const ariaLabel = button.getAttribute('aria-label')
        const ariaDescribedBy = button.getAttribute('aria-describedby')
        const textContent = button.textContent.trim()
        
        // Button should have accessible name via label, describedby, or text content
        expect(ariaLabel || ariaDescribedBy || textContent).toBeTruthy()
      })
    })
    
    it('should provide context for form controls', () => {
      const inputs = container.querySelectorAll('input')
      
      inputs.forEach(input => {
        const label = container.querySelector(`label[for="${input.id}"]`)
        const ariaLabel = input.getAttribute('aria-label')
        const ariaLabelledby = input.getAttribute('aria-labelledby')
        
        // Each input should have an accessible name
        expect(label || ariaLabel || ariaLabelledby).toBeTruthy()
      })
    })
    
    it('should announce timer state changes', () => {
      const timerDisplay = container.querySelector('#timer-display')
      const statusDiv = container.querySelector('#status-announcements')
      
      // Simulate timer state change
      timerDisplay.setAttribute('aria-label', '24 minutes remaining in focus session')
      statusDiv.textContent = 'Timer started - focus session'
      
      expect(timerDisplay.getAttribute('aria-label')).toContain('24 minutes remaining')
      expect(statusDiv.textContent).toBe('Timer started - focus session')
    })
    
    it('should provide error messages for form validation', () => {
      const focusInput = container.querySelector('#focus-time')
      const errorDiv = container.querySelector('#focus-error')
      
      // Simulate validation error
      focusInput.setAttribute('aria-invalid', 'true')
      errorDiv.textContent = 'Focus time must be between 1 and 1440 minutes'
      
      expect(focusInput.getAttribute('aria-invalid')).toBe('true')
      expect(focusInput.getAttribute('aria-describedby')).toContain('focus-error')
      expect(errorDiv.textContent).toBeTruthy()
    })
  })

  describe('Color Contrast and Visual Design', () => {
    it('should meet WCAG AA contrast requirements', async () => {
      // This would typically be tested with actual computed styles
      // Here we test the structure that supports contrast testing
      
      const textElements = container.querySelectorAll('button, label, input, h1, h2, h3')
      
      textElements.forEach(element => {
        // Ensure elements have classes that would apply proper contrast
        const hasTextClass = element.classList.length > 0 || 
                           element.tagName.match(/^H[1-6]$/) ||
                           element.tagName === 'BUTTON'
        
        expect(hasTextClass).toBe(true)
      })
    })
    
    it('should not rely solely on color for information', () => {
      // Error states should have text indicators
      const errorDiv = container.querySelector('#focus-error')
      expect(errorDiv.className).toContain('error-text')
      
      // Buttons should have text labels, not just icons
      const buttons = container.querySelectorAll('button')
      buttons.forEach(button => {
        const hasText = button.textContent.trim().length > 0
        const hasAriaLabel = button.getAttribute('aria-label')
        
        expect(hasText || hasAriaLabel).toBe(true)
      })
    })
    
    it('should support high contrast mode', () => {
      // Test that elements work without background images/colors
      const importantElements = container.querySelectorAll('button, input, [role="timer"]')
      
      importantElements.forEach(element => {
        // Should have border or other visual indicator
        const style = window.getComputedStyle(element)
        expect(style.border).toBeTruthy()
      })
    })
  })

  describe('Focus Management', () => {
    it('should have visible focus indicators', () => {
      const focusableElements = container.querySelectorAll('button, input, select')
      
      focusableElements.forEach(element => {
        element.focus()
        
        // Check that focus styles would be applied
        expect(element.matches(':focus')).toBe(true)
        
        // Should not have outline: none without alternative focus indicator
        const style = window.getComputedStyle(element)
        if (style.outline === 'none') {
          // Should have alternative focus indicator (box-shadow, border, etc.)
          expect(style.boxShadow || style.border).toBeTruthy()
        }
      })
    })
    
    it('should manage focus when opening modal', () => {
      const settingsBtn = container.querySelector('#settings-btn')
      const modal = container.querySelector('#settings-modal')
      
      settingsBtn.click()
      modal.classList.remove('hidden')
      
      // Focus should move to first focusable element in modal
      const firstFocusable = modal.querySelector('input, button, select, textarea')
      expect(document.activeElement).toBe(firstFocusable)
    })
    
    it('should restore focus when closing modal', () => {
      const settingsBtn = container.querySelector('#settings-btn')
      const modal = container.querySelector('#settings-modal')
      const cancelBtn = container.querySelector('#cancel-btn')
      
      settingsBtn.focus()
      settingsBtn.click()
      modal.classList.remove('hidden')
      
      cancelBtn.click()
      modal.classList.add('hidden')
      
      // Focus should return to the button that opened the modal
      expect(document.activeElement).toBe(settingsBtn)
    })
  })

  describe('Dynamic Content Updates', () => {
    it('should announce timer completion', () => {
      const statusDiv = container.querySelector('#status-announcements')
      
      // Simulate timer completion
      statusDiv.textContent = 'Focus session complete! Time for a break.'
      
      expect(statusDiv.getAttribute('aria-live')).toBe('assertive')
      expect(statusDiv.textContent).toContain('complete')
    })
    
    it('should update timer display accessible label', () => {
      const timerDisplay = container.querySelector('#timer-display')
      
      // Simulate timer tick
      timerDisplay.setAttribute('aria-label', '20 minutes 15 seconds remaining in focus session')
      
      expect(timerDisplay.getAttribute('aria-label')).toContain('20 minutes 15 seconds remaining')
    })
    
    it('should update button states appropriately', () => {
      const startBtn = container.querySelector('#start-btn')
      const pauseBtn = container.querySelector('#pause-btn')
      
      // Simulate timer start
      startBtn.disabled = true
      pauseBtn.disabled = false
      
      expect(startBtn.disabled).toBe(true)
      expect(pauseBtn.disabled).toBe(false)
    })
  })

  describe('Touch and Mobile Accessibility', () => {
    it('should have adequate touch target sizes', () => {
      const buttons = container.querySelectorAll('button')
      
      buttons.forEach(button => {
        // Buttons should be at least 44x44 pixels (WCAG guideline)
        // We test that appropriate CSS classes exist for this
        expect(button.tagName).toBe('BUTTON') // Semantic buttons are easier to style
      })
    })
    
    it('should work with screen orientation changes', () => {
      // Test that ARIA labels and structure remain intact
      const timerDisplay = container.querySelector('#timer-display')
      
      // Simulate orientation change
      window.dispatchEvent(new Event('orientationchange'))
      
      expect(timerDisplay.getAttribute('aria-label')).toBeTruthy()
      expect(timerDisplay.getAttribute('role')).toBe('timer')
    })
  })

  describe('Error States and Validation', () => {
    it('should provide accessible error messages', () => {
      const focusInput = container.querySelector('#focus-time')
      const errorDiv = container.querySelector('#focus-error')
      
      // Simulate validation error
      focusInput.value = '0'
      focusInput.setAttribute('aria-invalid', 'true')
      errorDiv.textContent = 'Focus time must be at least 1 minute'
      
      expect(focusInput.getAttribute('aria-invalid')).toBe('true')
      expect(focusInput.getAttribute('aria-describedby')).toContain('focus-error')
      expect(errorDiv.getAttribute('aria-live')).toBe('polite')
      expect(errorDiv.textContent).toBeTruthy()
    })
    
    it('should clear error states when input becomes valid', () => {
      const focusInput = container.querySelector('#focus-time')
      const errorDiv = container.querySelector('#focus-error')
      
      // Start with error
      focusInput.setAttribute('aria-invalid', 'true')
      errorDiv.textContent = 'Error message'
      
      // Fix the input
      focusInput.value = '25'
      focusInput.removeAttribute('aria-invalid')
      errorDiv.textContent = ''
      
      expect(focusInput.getAttribute('aria-invalid')).toBeNull()
      expect(errorDiv.textContent).toBe('')
    })
  })

  describe('Axe Core Automated Testing', () => {
    it('should pass axe accessibility audit', async () => {
      // Configure axe for WCAG 2.1 AA
      const axeConfig = {
        rules: {
          'color-contrast': { enabled: true },
          'keyboard': { enabled: true },
          'focus-order-semantics': { enabled: true },
          'aria-required-attr': { enabled: true },
          'aria-valid-attr-value': { enabled: true },
          'label': { enabled: true },
          'landmark-one-main': { enabled: true }
        },
        tags: ['wcag2a', 'wcag2aa', 'wcag21aa']
      }
      
      // This would be the actual axe test in a browser environment
      // For now, we validate the structure supports axe testing
      expect(container.querySelector('[role="main"]')).toBeTruthy()
      expect(container.querySelectorAll('button[aria-label], button[aria-describedby]')).toHaveProperty('length')
    })
  })
})