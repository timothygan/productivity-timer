/**
 * ThemeProvider - Context provider pattern for theme management
 * Uses CSS custom properties for theming with persistence
 */
class ThemeProvider {
  constructor() {
    this.currentTheme = 'default';
    this.themes = this.initializeThemes();
    this.eventTarget = new EventTarget();
    
    this.loadTheme();
    this.bindEvents();
  }

  initializeThemes() {
    return {
      default: {
        name: 'Default',
        colors: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          accent: '#06b6d4',
          background: '#ffffff',
          surface: '#f8fafc',
          text: '#1e293b',
          textSecondary: '#64748b',
          border: '#e2e8f0',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          focus: '#6366f1',
          break: '#10b981'
        },
        fonts: {
          primary: '"Inter", system-ui, -apple-system, sans-serif',
          secondary: '"JetBrains Mono", "Courier New", monospace',
          sizes: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem'
          }
        },
        spacing: {
          unit: '0.25rem',
          xs: '0.5rem',
          sm: '0.75rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem',
          '2xl': '3rem',
          '3xl': '4rem'
        },
        animations: {
          duration: '0.2s',
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          durationSlow: '0.3s',
          easingSmooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
        },
        shadows: {
          sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
        }
      },
      
      dark: {
        name: 'Dark',
        colors: {
          primary: '#8b5cf6',
          secondary: '#a855f7',
          accent: '#06b6d4',
          background: '#0f0f23',
          surface: '#1e1e3f',
          text: '#e2e8f0',
          textSecondary: '#94a3b8',
          border: '#334155',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          focus: '#8b5cf6',
          break: '#10b981'
        },
        fonts: {
          primary: '"Inter", system-ui, -apple-system, sans-serif',
          secondary: '"JetBrains Mono", "Courier New", monospace',
          sizes: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem'
          }
        },
        spacing: {
          unit: '0.25rem',
          xs: '0.5rem',
          sm: '0.75rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem',
          '2xl': '3rem',
          '3xl': '4rem'
        },
        animations: {
          duration: '0.2s',
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          durationSlow: '0.3s',
          easingSmooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
        },
        shadows: {
          sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
          md: '0 4px 6px -1px rgb(0 0 0 / 0.4)',
          lg: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
          xl: '0 20px 25px -5px rgb(0 0 0 / 0.6)'
        }
      },
      
      purple: {
        name: 'Purple',
        colors: {
          primary: '#7c3aed',
          secondary: '#8b5cf6',
          accent: '#d946ef',
          background: '#faf7ff',
          surface: '#f3f0ff',
          text: '#4c1d95',
          textSecondary: '#7c3aed',
          border: '#ddd6fe',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          focus: '#7c3aed',
          break: '#d946ef'
        },
        fonts: {
          primary: '"Inter", system-ui, -apple-system, sans-serif',
          secondary: '"JetBrains Mono", "Courier New", monospace',
          sizes: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem'
          }
        },
        spacing: {
          unit: '0.25rem',
          xs: '0.5rem',
          sm: '0.75rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem',
          '2xl': '3rem',
          '3xl': '4rem'
        },
        animations: {
          duration: '0.2s',
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          durationSlow: '0.3s',
          easingSmooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
        },
        shadows: {
          sm: '0 1px 2px 0 rgb(124 58 237 / 0.1)',
          md: '0 4px 6px -1px rgb(124 58 237 / 0.2)',
          lg: '0 10px 15px -3px rgb(124 58 237 / 0.3)',
          xl: '0 20px 25px -5px rgb(124 58 237 / 0.4)'
        }
      },
      
      green: {
        name: 'Green',
        colors: {
          primary: '#059669',
          secondary: '#10b981',
          accent: '#34d399',
          background: '#f0fdf4',
          surface: '#ecfdf5',
          text: '#064e3b',
          textSecondary: '#059669',
          border: '#bbf7d0',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          focus: '#059669',
          break: '#34d399'
        },
        fonts: {
          primary: '"Inter", system-ui, -apple-system, sans-serif',
          secondary: '"JetBrains Mono", "Courier New", monospace',
          sizes: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem'
          }
        },
        spacing: {
          unit: '0.25rem',
          xs: '0.5rem',
          sm: '0.75rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem',
          '2xl': '3rem',
          '3xl': '4rem'
        },
        animations: {
          duration: '0.2s',
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          durationSlow: '0.3s',
          easingSmooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
        },
        shadows: {
          sm: '0 1px 2px 0 rgb(5 150 105 / 0.1)',
          md: '0 4px 6px -1px rgb(5 150 105 / 0.2)',
          lg: '0 10px 15px -3px rgb(5 150 105 / 0.3)',
          xl: '0 20px 25px -5px rgb(5 150 105 / 0.4)'
        }
      },
      
      blue: {
        name: 'Blue',
        colors: {
          primary: '#2563eb',
          secondary: '#3b82f6',
          accent: '#06b6d4',
          background: '#eff6ff',
          surface: '#f0f9ff',
          text: '#1e3a8a',
          textSecondary: '#2563eb',
          border: '#bfdbfe',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          focus: '#2563eb',
          break: '#06b6d4'
        },
        fonts: {
          primary: '"Inter", system-ui, -apple-system, sans-serif',
          secondary: '"JetBrains Mono", "Courier New", monospace',
          sizes: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem',
            '4xl': '2.25rem',
            '5xl': '3rem'
          }
        },
        spacing: {
          unit: '0.25rem',
          xs: '0.5rem',
          sm: '0.75rem',
          md: '1rem',
          lg: '1.5rem',
          xl: '2rem',
          '2xl': '3rem',
          '3xl': '4rem'
        },
        animations: {
          duration: '0.2s',
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          durationSlow: '0.3s',
          easingSmooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
        },
        shadows: {
          sm: '0 1px 2px 0 rgb(37 99 235 / 0.1)',
          md: '0 4px 6px -1px rgb(37 99 235 / 0.2)',
          lg: '0 10px 15px -3px rgb(37 99 235 / 0.3)',
          xl: '0 20px 25px -5px rgb(37 99 235 / 0.4)'
        }
      }
    };
  }

  // Event management
  on(event, callback) {
    this.eventTarget.addEventListener(event, callback);
  }

  off(event, callback) {
    this.eventTarget.removeEventListener(event, callback);
  }

  emit(event, data = {}) {
    this.eventTarget.dispatchEvent(new CustomEvent(event, { detail: data }));
  }

  bindEvents() {
    // Listen for theme toggle events
    document.addEventListener('keydown', (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      if (event.code === 'KeyT') {
        event.preventDefault();
        this.toggleTheme();
      }
    });

    // Listen for theme changes from UI
    document.addEventListener('theme:change-request', (event) => {
      this.setTheme(event.detail.theme);
    });
  }

  // Theme management
  setTheme(themeName) {
    if (!this.themes[themeName]) {
      console.warn(`Theme "${themeName}" not found`);
      return;
    }

    const oldTheme = this.currentTheme;
    this.currentTheme = themeName;
    
    this.applyTheme(this.themes[themeName]);
    this.saveTheme();
    
    this.emit('theme:changed', { 
      oldTheme, 
      newTheme: themeName,
      themeConfig: this.themes[themeName]
    });
  }

  toggleTheme() {
    const themeNames = Object.keys(this.themes);
    const currentIndex = themeNames.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themeNames.length;
    const nextTheme = themeNames[nextIndex];
    
    this.setTheme(nextTheme);
  }

  applyTheme(theme) {
    const root = document.documentElement;
    
    // Apply colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply fonts
    Object.entries(theme.fonts).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--font-${key}`, value);
      } else if (key === 'sizes') {
        Object.entries(value).forEach(([sizeKey, sizeValue]) => {
          root.style.setProperty(`--font-size-${sizeKey}`, sizeValue);
        });
      }
    });

    // Apply spacing
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    // Apply animations
    Object.entries(theme.animations).forEach(([key, value]) => {
      root.style.setProperty(`--animation-${key}`, value);
    });

    // Apply shadows
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });

    // Update theme class on body
    document.body.className = `theme-${this.currentTheme}`;
    
    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(theme.colors.primary);
  }

  updateMetaThemeColor(color) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', color);
  }

  // Custom theme registration
  registerTheme(name, config) {
    if (this.themes[name]) {
      console.warn(`Theme "${name}" already exists and will be overwritten`);
    }

    // Merge with default theme structure to ensure all properties exist
    const defaultTheme = this.themes.default;
    const mergedConfig = {
      name: config.name || name,
      colors: { ...defaultTheme.colors, ...config.colors },
      fonts: { 
        ...defaultTheme.fonts, 
        ...config.fonts,
        sizes: { ...defaultTheme.fonts.sizes, ...config.fonts?.sizes }
      },
      spacing: { ...defaultTheme.spacing, ...config.spacing },
      animations: { ...defaultTheme.animations, ...config.animations },
      shadows: { ...defaultTheme.shadows, ...config.shadows }
    };

    this.themes[name] = mergedConfig;
    this.emit('theme:registered', { name, config: mergedConfig });
  }

  // Getters
  getCurrentTheme() {
    return this.currentTheme;
  }

  getThemeConfig(themeName = null) {
    const theme = themeName || this.currentTheme;
    return this.themes[theme] ? { ...this.themes[theme] } : null;
  }

  getAvailableThemes() {
    return Object.keys(this.themes).map(key => ({
      key,
      name: this.themes[key].name,
      colors: { ...this.themes[key].colors }
    }));
  }

  // Persistence
  saveTheme() {
    try {
      localStorage.setItem('themeProvider:currentTheme', this.currentTheme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }

  loadTheme() {
    try {
      const saved = localStorage.getItem('themeProvider:currentTheme');
      if (saved && this.themes[saved]) {
        this.currentTheme = saved;
      }
      
      // Apply initial theme
      this.applyTheme(this.themes[this.currentTheme]);
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
      this.applyTheme(this.themes.default);
    }
  }

  // System theme detection
  detectSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'default';
  }

  bindSystemThemeChanges() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addListener((e) => {
        if (this.currentTheme === 'system') {
          const systemTheme = e.matches ? 'dark' : 'default';
          this.applyTheme(this.themes[systemTheme]);
        }
      });
    }
  }

  // Utility methods
  generateColorVariations(baseColor) {
    // Simple color variation generator (could be enhanced with a proper color library)
    const variations = {};
    const hsl = this.hexToHsl(baseColor);
    
    variations.light = this.hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 20, 100));
    variations.dark = this.hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 20, 0));
    variations.muted = this.hslToHex(hsl.h, Math.max(hsl.s - 30, 0), hsl.l);
    
    return variations;
  }

  hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = (c) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  // Cleanup
  destroy() {
    // Remove event listeners if any
    this.eventTarget.removeEventListener();
  }
}

export default ThemeProvider;