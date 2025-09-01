/**
 * KeyboardManager - Centralized keyboard shortcuts system
 * Handles keyboard events, hotkey registration, and help display
 */
class KeyboardManager {
  constructor(timerEngine, themeProvider, visualRenderer, settingsModal, fullscreenManager) {
    this.timerEngine = timerEngine;
    this.themeProvider = themeProvider;
    this.visualRenderer = visualRenderer;
    this.settingsModal = settingsModal;
    this.fullscreenManager = fullscreenManager;
    
    this.shortcuts = new Map();
    this.isHelpVisible = false;
    this.eventTarget = new EventTarget();
    
    this.registerDefaultShortcuts();
    this.bindEvents();
  }

  registerDefaultShortcuts() {
    // Timer controls
    this.register('Space', {
      action: 'timer:toggle',
      description: 'Start/Pause Timer',
      handler: () => {
        const state = this.timerEngine.getState();
        if (state.isRunning) {
          this.timerEngine.pause();
        } else {
          this.timerEngine.start();
        }
      }
    });

    this.register('KeyR', {
      action: 'timer:reset',
      description: 'Reset Timer',
      handler: () => {
        this.timerEngine.reset();
      }
    });

    // Settings and UI
    this.register('KeyS', {
      action: 'settings:open',
      description: 'Open Settings',
      handler: () => {
        if (!this.settingsModal.isModalOpen()) {
          document.dispatchEvent(new CustomEvent('control:settings-open'));
        }
      }
    });

    this.register('Escape', {
      action: 'modal:close',
      description: 'Close Modal/Help',
      handler: () => {
        if (this.settingsModal.isModalOpen()) {
          this.settingsModal.close();
        } else if (this.isHelpVisible) {
          this.hideHelp();
        }
      }
    });

    // Appearance controls
    this.register('KeyT', {
      action: 'theme:toggle',
      description: 'Toggle Theme',
      handler: () => {
        this.themeProvider.toggleTheme();
      }
    });

    this.register('KeyV', {
      action: 'visual:toggle',
      description: 'Toggle Visual Mode',
      handler: () => {
        this.visualRenderer.toggleMode();
      }
    });

    // Fullscreen
    this.register('KeyF', {
      action: 'fullscreen:toggle',
      description: 'Toggle Fullscreen',
      handler: () => {
        if (this.fullscreenManager.getIsSupported()) {
          this.fullscreenManager.toggle();
        }
      }
    });

    // Help system
    this.register('Slash', {
      action: 'help:toggle',
      description: 'Toggle Keyboard Help',
      handler: () => {
        this.toggleHelp();
      }
    });

    this.register('Shift+Slash', {
      action: 'help:show',
      description: 'Show Keyboard Help',
      handler: () => {
        this.showHelp();
      }
    });

    // Quick timer presets (with Ctrl modifier)
    this.register('Ctrl+Digit1', {
      action: 'preset:pomodoro',
      description: 'Classic Pomodoro (25/5/15)',
      handler: () => {
        this.applyTimerPreset('classic');
      }
    });

    this.register('Ctrl+Digit2', {
      action: 'preset:extended',
      description: 'Extended Focus (45/10/30)',
      handler: () => {
        this.applyTimerPreset('extended');
      }
    });

    this.register('Ctrl+Digit3', {
      action: 'preset:quick',
      description: 'Quick Sessions (15/3/10)',
      handler: () => {
        this.applyTimerPreset('quick');
      }
    });
  }

  bindEvents() {
    document.addEventListener('keydown', (event) => {
      this.handleKeyDown(event);
    });

    document.addEventListener('keyup', (event) => {
      this.handleKeyUp(event);
    });

    // Help toggle button
    const helpToggle = document.querySelector('.help-toggle');
    if (helpToggle) {
      helpToggle.addEventListener('click', () => {
        this.toggleHelp();
      });
    }
  }

  handleKeyDown(event) {
    // Skip if user is typing in an input
    if (this.isTypingInInput(event.target)) {
      return;
    }

    // Build key combination string
    const keyCombo = this.buildKeyCombo(event);
    const shortcut = this.shortcuts.get(keyCombo);

    if (shortcut) {
      event.preventDefault();
      event.stopPropagation();
      
      try {
        shortcut.handler(event);
        this.emit('shortcut:triggered', {
          combo: keyCombo,
          action: shortcut.action,
          description: shortcut.description
        });
      } catch (error) {
        console.error(`Error executing shortcut ${keyCombo}:`, error);
      }
    }
  }

  handleKeyUp(event) {
    // Handle any key-up specific logic here
  }

  buildKeyCombo(event) {
    const parts = [];
    
    if (event.ctrlKey) parts.push('Ctrl');
    if (event.altKey) parts.push('Alt');
    if (event.shiftKey) parts.push('Shift');
    if (event.metaKey) parts.push('Meta');
    
    // Add the main key
    parts.push(event.code);
    
    return parts.join('+');
  }

  isTypingInInput(target) {
    const inputTypes = ['INPUT', 'TEXTAREA', 'SELECT'];
    return inputTypes.includes(target.tagName) || 
           target.contentEditable === 'true' ||
           target.closest('[contenteditable="true"]');
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

  // Shortcut registration
  register(keyCombo, config) {
    if (this.shortcuts.has(keyCombo)) {
      console.warn(`Shortcut ${keyCombo} is being overwritten`);
    }

    this.shortcuts.set(keyCombo, {
      action: config.action,
      description: config.description,
      handler: config.handler,
      category: config.category || 'general'
    });
  }

  unregister(keyCombo) {
    return this.shortcuts.delete(keyCombo);
  }

  // Help system
  showHelp() {
    const helpElement = document.getElementById('shortcuts-help');
    if (helpElement) {
      helpElement.classList.remove('hidden');
      this.isHelpVisible = true;
      this.populateHelpContent();
      
      // Add click outside to close
      setTimeout(() => {
        document.addEventListener('click', this.handleHelpClickOutside);
      }, 100);
    }
  }

  hideHelp() {
    const helpElement = document.getElementById('shortcuts-help');
    if (helpElement) {
      helpElement.classList.add('hidden');
      this.isHelpVisible = false;
      
      document.removeEventListener('click', this.handleHelpClickOutside);
    }
  }

  toggleHelp() {
    if (this.isHelpVisible) {
      this.hideHelp();
    } else {
      this.showHelp();
    }
  }

  handleHelpClickOutside = (event) => {
    const helpContent = document.querySelector('.shortcuts-content');
    if (helpContent && !helpContent.contains(event.target)) {
      this.hideHelp();
    }
  }

  populateHelpContent() {
    const helpContent = document.querySelector('.shortcuts-content');
    if (!helpContent) return;

    // Clear existing content except title
    const title = helpContent.querySelector('h3');
    helpContent.innerHTML = '';
    if (title) helpContent.appendChild(title);

    // Group shortcuts by category
    const categories = this.groupShortcutsByCategory();
    
    Object.entries(categories).forEach(([category, shortcuts]) => {
      if (shortcuts.length === 0) return;

      // Add category header
      if (category !== 'general') {
        const categoryHeader = document.createElement('h4');
        categoryHeader.textContent = this.formatCategoryName(category);
        categoryHeader.className = 'shortcuts-category';
        helpContent.appendChild(categoryHeader);
      }

      // Add shortcuts
      shortcuts.forEach(({ keyCombo, config }) => {
        const shortcutItem = document.createElement('div');
        shortcutItem.className = 'shortcut-item';
        
        const keySpan = document.createElement('span');
        keySpan.className = 'key';
        keySpan.textContent = this.formatKeyCombo(keyCombo);
        
        const actionSpan = document.createElement('span');
        actionSpan.className = 'action';
        actionSpan.textContent = config.description;
        
        shortcutItem.appendChild(keySpan);
        shortcutItem.appendChild(actionSpan);
        helpContent.appendChild(shortcutItem);
      });
    });
  }

  groupShortcutsByCategory() {
    const categories = {};
    
    this.shortcuts.forEach((config, keyCombo) => {
      const category = config.category || 'general';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push({ keyCombo, config });
    });
    
    return categories;
  }

  formatCategoryName(category) {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  formatKeyCombo(keyCombo) {
    return keyCombo
      .replace('Ctrl+', '⌃ ')
      .replace('Alt+', '⌥ ')
      .replace('Shift+', '⇧ ')
      .replace('Meta+', '⌘ ')
      .replace('Key', '')
      .replace('Digit', '')
      .replace('Space', '⎵')
      .replace('Escape', 'Esc')
      .replace('Slash', '?');
  }

  // Timer preset helpers
  applyTimerPreset(presetName) {
    const presets = {
      classic: { focusTime: 25 * 60 * 1000, shortBreakTime: 5 * 60 * 1000, longBreakTime: 15 * 60 * 1000, longBreakInterval: 4 },
      extended: { focusTime: 45 * 60 * 1000, shortBreakTime: 10 * 60 * 1000, longBreakTime: 30 * 60 * 1000, longBreakInterval: 3 },
      quick: { focusTime: 15 * 60 * 1000, shortBreakTime: 3 * 60 * 1000, longBreakTime: 10 * 60 * 1000, longBreakInterval: 6 }
    };

    const preset = presets[presetName];
    if (preset) {
      this.timerEngine.configure(preset);
      this.showPresetNotification(presetName);
    }
  }

  showPresetNotification(presetName) {
    const notification = document.createElement('div');
    notification.className = 'preset-notification';
    notification.textContent = `Applied ${presetName} preset`;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
      notification.classList.add('visible');
    });
    
    // Remove after delay
    setTimeout(() => {
      notification.classList.remove('visible');
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 2000);
  }

  // Public methods
  getRegisteredShortcuts() {
    return Array.from(this.shortcuts.entries()).map(([keyCombo, config]) => ({
      keyCombo,
      ...config
    }));
  }

  getShortcut(keyCombo) {
    return this.shortcuts.get(keyCombo);
  }

  hasShortcut(keyCombo) {
    return this.shortcuts.has(keyCombo);
  }

  // Advanced features
  createShortcutFromString(shortcutString) {
    // Parse strings like "Ctrl+S" or "Space"
    const parts = shortcutString.split('+');
    const mainKey = parts[parts.length - 1];
    const modifiers = parts.slice(0, -1);
    
    return {
      modifiers,
      key: mainKey,
      combo: shortcutString
    };
  }

  // Accessibility
  announceShortcut(keyCombo, description) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `Shortcut triggered: ${description}`;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  // Cleanup
  destroy() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    document.removeEventListener('click', this.handleHelpClickOutside);
    
    if (this.isHelpVisible) {
      this.hideHelp();
    }
    
    this.shortcuts.clear();
  }
}

export default KeyboardManager;