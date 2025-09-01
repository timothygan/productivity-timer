/**
 * Unit Tests for ThemeProvider
 * Tests theme management, CSS custom properties, and persistence
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ThemeProvider } from '@/js/ui/ThemeProvider.js'

describe('ThemeProvider', () => {
  let themeProvider
  let mockStyleSheet
  
  beforeEach(() => {
    // Mock CSS custom properties
    mockStyleSheet = {
      setProperty: vi.fn(),
      getPropertyValue: vi.fn(),
      removeProperty: vi.fn()
    }
    
    Object.defineProperty(document.documentElement, 'style', {
      value: mockStyleSheet,
      writable: true
    })
    
    themeProvider = new ThemeProvider()
  })
  
  afterEach(() => {
    themeProvider.destroy()
    vi.restoreAllMocks()
  })

  describe('Theme Management', () => {
    it('should initialize with default theme', () => {
      expect(themeProvider.getCurrentTheme()).toBe('light')
      expect(themeProvider.getThemeConfig()).toMatchObject({
        name: 'light',
        colors: expect.any(Object),
        fonts: expect.any(Object)
      })
    })
    
    it('should load available themes', () => {
      const themes = themeProvider.getAvailableThemes()
      expect(themes).toContain('light')
      expect(themes).toContain('dark')
      expect(themes).toContain('purple')
      expect(themes).toContain('minimal')
    })
    
    it('should set theme and update CSS properties', () => {
      themeProvider.setTheme('dark')
      
      expect(mockStyleSheet.setProperty).toHaveBeenCalledWith(
        '--primary-color',
        expect.any(String)
      )
      expect(mockStyleSheet.setProperty).toHaveBeenCalledWith(
        '--background-color',
        expect.any(String)
      )
    })
    
    it('should persist theme to localStorage', () => {
      themeProvider.setTheme('purple')
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'pomodoro-theme',
        'purple'
      )
    })
    
    it('should restore theme from localStorage on init', () => {
      localStorage.getItem.mockReturnValue('dark')
      
      const newProvider = new ThemeProvider()
      expect(newProvider.getCurrentTheme()).toBe('dark')
    })
  })

  describe('Custom Theme Registration', () => {
    it('should register custom theme', () => {
      const customTheme = {
        name: 'sunset',
        colors: {
          primary: '#ff6b6b',
          secondary: '#feca57',
          background: '#ff9ff3',
          text: '#2d3436',
          accent: '#fd79a8'
        },
        fonts: {
          primary: '"Inter", sans-serif',
          secondary: '"JetBrains Mono", monospace'
        }
      }
      
      themeProvider.registerCustomTheme(customTheme)
      
      expect(themeProvider.getAvailableThemes()).toContain('sunset')
      expect(themeProvider.getThemeConfig('sunset')).toEqual(customTheme)
    })
    
    it('should validate custom theme structure', () => {
      const invalidTheme = {
        name: 'invalid',
        colors: { primary: '#ff0000' } // Missing required colors
      }
      
      expect(() => themeProvider.registerCustomTheme(invalidTheme))
        .toThrow('Invalid theme: missing required colors')
    })
    
    it('should emit theme-registered event', () => {
      const mockListener = vi.fn()
      themeProvider.addEventListener('theme-registered', mockListener)
      
      const customTheme = {
        name: 'ocean',
        colors: {
          primary: '#0984e3',
          secondary: '#74b9ff',
          background: '#ddd',
          text: '#2d3436',
          accent: '#00b894'
        }
      }
      
      themeProvider.registerCustomTheme(customTheme)
      
      expect(mockListener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'theme-registered',
          detail: { themeName: 'ocean' }
        })
      )
    })
  })

  describe('CSS Custom Properties', () => {
    it('should update all theme properties', () => {
      themeProvider.setTheme('dark')
      
      const expectedProperties = [
        '--primary-color',
        '--secondary-color',
        '--background-color',
        '--text-color',
        '--accent-color',
        '--font-primary',
        '--font-secondary'
      ]
      
      expectedProperties.forEach(prop => {
        expect(mockStyleSheet.setProperty).toHaveBeenCalledWith(
          prop,
          expect.any(String)
        )
      })
    })
    
    it('should handle transitions between themes', async () => {
      const mockTransitionEnd = vi.fn()
      document.addEventListener('transitionend', mockTransitionEnd)
      
      themeProvider.setTheme('purple')
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Should apply transition class
      expect(document.documentElement.classList.contains('theme-transition')).toBe(true)
    })
    
    it('should clean up transition classes', async () => {
      themeProvider.setTheme('minimal')
      
      // Simulate transition end
      document.documentElement.dispatchEvent(
        new TransitionEvent('transitionend', { propertyName: 'background-color' })
      )
      
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(document.documentElement.classList.contains('theme-transition')).toBe(false)
    })
  })

  describe('Theme Events', () => {
    it('should emit theme-changed event', () => {
      const mockListener = vi.fn()
      themeProvider.addEventListener('theme-changed', mockListener)
      
      themeProvider.setTheme('dark')
      
      expect(mockListener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'theme-changed',
          detail: {
            themeName: 'dark',
            config: expect.any(Object)
          }
        })
      )
    })
    
    it('should not emit event when setting same theme', () => {
      const mockListener = vi.fn()
      themeProvider.addEventListener('theme-changed', mockListener)
      
      themeProvider.setTheme('light') // Already light theme
      
      expect(mockListener).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid theme names gracefully', () => {
      expect(() => themeProvider.setTheme('nonexistent')).not.toThrow()
      expect(themeProvider.getCurrentTheme()).toBe('light') // Should remain unchanged
    })
    
    it('should handle localStorage failures', () => {
      localStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })
      
      expect(() => themeProvider.setTheme('dark')).not.toThrow()
      expect(themeProvider.getCurrentTheme()).toBe('dark')
    })
    
    it('should handle corrupted localStorage data', () => {
      localStorage.getItem.mockReturnValue('invalid-theme-name')
      
      const newProvider = new ThemeProvider()
      expect(newProvider.getCurrentTheme()).toBe('light') // Should fallback to default
    })
    
    it('should handle CSS property update failures', () => {
      mockStyleSheet.setProperty.mockImplementation(() => {
        throw new Error('CSS update failed')
      })
      
      expect(() => themeProvider.setTheme('dark')).not.toThrow()
    })
  })

  describe('Performance', () => {
    it('should batch CSS property updates', () => {
      const setPropertySpy = vi.spyOn(mockStyleSheet, 'setProperty')
      
      themeProvider.setTheme('purple')
      
      // Should update all properties in single batch
      expect(setPropertySpy).toHaveBeenCalledTimes(7) // 5 colors + 2 fonts
    })
    
    it('should debounce rapid theme changes', async () => {
      const mockListener = vi.fn()
      themeProvider.addEventListener('theme-changed', mockListener)
      
      // Rapid theme changes
      themeProvider.setTheme('dark')
      themeProvider.setTheme('purple')
      themeProvider.setTheme('minimal')
      
      await new Promise(resolve => setTimeout(resolve, 50))
      
      // Should only emit final theme change
      expect(mockListener).toHaveBeenCalledTimes(1)
      expect(mockListener).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { themeName: 'minimal' }
        })
      )
    })
    
    it('should clean up event listeners on destroy', () => {
      const mockListener = vi.fn()
      themeProvider.addEventListener('theme-changed', mockListener)
      
      themeProvider.destroy()
      themeProvider.setTheme('dark')
      
      expect(mockListener).not.toHaveBeenCalled()
    })
  })

  describe('Theme Validation', () => {
    it('should validate theme color format', () => {
      const invalidTheme = {
        name: 'invalid-colors',
        colors: {
          primary: 'not-a-color',
          secondary: '#invalid',
          background: 'rgba(300, 300, 300, 1)', // Invalid RGB values
          text: '#000',
          accent: '#fff'
        }
      }
      
      expect(() => themeProvider.registerCustomTheme(invalidTheme))
        .toThrow('Invalid color format')
    })
    
    it('should validate required theme properties', () => {
      const incompleteTheme = {
        name: 'incomplete',
        colors: {
          primary: '#000',
          secondary: '#111'
          // Missing background, text, accent
        }
      }
      
      expect(() => themeProvider.registerCustomTheme(incompleteTheme))
        .toThrow('Invalid theme: missing required colors')
    })
  })
})