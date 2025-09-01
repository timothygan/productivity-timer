/**
 * SettingsModal - Modal pattern for timer and app configuration
 * Handles form validation, persistence, and settings management
 */
class SettingsModal {
  constructor(timerEngine, themeProvider, visualRenderer) {
    this.timerEngine = timerEngine;
    this.themeProvider = themeProvider;
    this.visualRenderer = visualRenderer;
    
    this.modal = document.getElementById('settings-modal');
    this.overlay = this.modal.querySelector('.modal-overlay');
    this.closeBtn = document.getElementById('close-settings');
    this.saveBtn = document.getElementById('save-settings');
    this.cancelBtn = document.getElementById('cancel-settings');
    
    this.form = {
      focusTime: document.getElementById('focus-time'),
      shortBreakTime: document.getElementById('short-break-time'),
      longBreakTime: document.getElementById('long-break-time'),
      longBreakInterval: document.getElementById('long-break-interval'),
      themeSelect: document.getElementById('theme-select'),
      visualModeSelect: document.getElementById('visual-mode-select')
    };
    
    this.originalValues = {};
    this.isOpen = false;
    
    this.bindEvents();
    this.populateOptions();
    this.loadCurrentSettings();
  }

  bindEvents() {
    // Modal open/close events
    document.addEventListener('control:settings-open', () => {
      this.open();
    });

    this.closeBtn.addEventListener('click', () => {
      this.close();
    });

    this.overlay.addEventListener('click', () => {
      this.close();
    });

    this.cancelBtn.addEventListener('click', () => {
      this.close();
    });

    this.saveBtn.addEventListener('click', () => {
      this.save();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      if (this.isOpen) {
        if (event.code === 'Escape') {
          event.preventDefault();
          this.close();
        }
        if (event.code === 'Enter' && event.ctrlKey) {
          event.preventDefault();
          this.save();
        }
      }
    });

    // Form validation
    Object.values(this.form).forEach(input => {
      if (input.type === 'number') {
        input.addEventListener('input', (event) => {
          this.validateNumberInput(event.target);
        });

        input.addEventListener('blur', (event) => {
          this.formatNumberInput(event.target);
        });
      }
    });

    // Real-time preview for theme changes
    this.form.themeSelect.addEventListener('change', (event) => {
      if (this.isOpen) {
        this.themeProvider.setTheme(event.target.value);
      }
    });

    // Real-time preview for visual mode changes
    this.form.visualModeSelect.addEventListener('change', (event) => {
      if (this.isOpen) {
        this.visualRenderer.setMode(event.target.value);
      }
    });
  }

  populateOptions() {
    // Populate theme options
    const themes = this.themeProvider.getAvailableThemes();
    this.form.themeSelect.innerHTML = '';
    themes.forEach(theme => {
      const option = document.createElement('option');
      option.value = theme.key;
      option.textContent = theme.name;
      this.form.themeSelect.appendChild(option);
    });

    // Populate visual mode options
    const modes = this.visualRenderer.getAvailableModes();
    this.form.visualModeSelect.innerHTML = '';
    modes.forEach(mode => {
      const option = document.createElement('option');
      option.value = mode.key;
      option.textContent = mode.name;
      this.form.visualModeSelect.appendChild(option);
    });
  }

  loadCurrentSettings() {
    const timerConfig = this.timerEngine.getConfig();
    const currentTheme = this.themeProvider.getCurrentTheme();
    const currentMode = this.visualRenderer.getCurrentMode();

    // Load timer settings (convert ms to minutes)
    this.form.focusTime.value = Math.round(timerConfig.focusTime / 1000 / 60);
    this.form.shortBreakTime.value = Math.round(timerConfig.shortBreakTime / 1000 / 60);
    this.form.longBreakTime.value = Math.round(timerConfig.longBreakTime / 1000 / 60);
    this.form.longBreakInterval.value = timerConfig.longBreakInterval;

    // Load appearance settings
    this.form.themeSelect.value = currentTheme;
    this.form.visualModeSelect.value = currentMode;

    // Store original values for reset
    this.storeOriginalValues();
  }

  storeOriginalValues() {
    this.originalValues = {
      focusTime: this.form.focusTime.value,
      shortBreakTime: this.form.shortBreakTime.value,
      longBreakTime: this.form.longBreakTime.value,
      longBreakInterval: this.form.longBreakInterval.value,
      theme: this.form.themeSelect.value,
      visualMode: this.form.visualModeSelect.value
    };
  }

  resetToOriginalValues() {
    this.form.focusTime.value = this.originalValues.focusTime;
    this.form.shortBreakTime.value = this.originalValues.shortBreakTime;
    this.form.longBreakTime.value = this.originalValues.longBreakTime;
    this.form.longBreakInterval.value = this.originalValues.longBreakInterval;
    this.form.themeSelect.value = this.originalValues.theme;
    this.form.visualModeSelect.value = this.originalValues.visualMode;

    // Revert changes
    this.themeProvider.setTheme(this.originalValues.theme);
    this.visualRenderer.setMode(this.originalValues.visualMode);
  }

  validateNumberInput(input) {
    const value = parseInt(input.value);
    const min = parseInt(input.min);
    const max = parseInt(input.max);

    // Remove validation classes
    input.classList.remove('valid', 'invalid');

    if (isNaN(value)) {
      input.classList.add('invalid');
      this.showValidationError(input, 'Please enter a valid number');
      return false;
    }

    if (value < min) {
      input.classList.add('invalid');
      this.showValidationError(input, `Minimum value is ${min}`);
      return false;
    }

    if (value > max) {
      input.classList.add('invalid');
      this.showValidationError(input, `Maximum value is ${max}`);
      return false;
    }

    input.classList.add('valid');
    this.clearValidationError(input);
    return true;
  }

  formatNumberInput(input) {
    const value = parseInt(input.value);
    const min = parseInt(input.min);
    const max = parseInt(input.max);

    if (!isNaN(value)) {
      // Clamp value to min/max
      const clampedValue = Math.max(min, Math.min(max, value));
      input.value = clampedValue;
      
      if (clampedValue !== value) {
        this.validateNumberInput(input);
      }
    }
  }

  showValidationError(input, message) {
    let errorElement = input.parentNode.querySelector('.validation-error');
    
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'validation-error';
      input.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }

  clearValidationError(input) {
    const errorElement = input.parentNode.querySelector('.validation-error');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  }

  validateAllInputs() {
    let isValid = true;
    
    Object.values(this.form).forEach(input => {
      if (input.type === 'number') {
        if (!this.validateNumberInput(input)) {
          isValid = false;
        }
      }
    });

    return isValid;
  }

  open() {
    this.loadCurrentSettings();
    this.modal.classList.remove('hidden');
    this.isOpen = true;

    // Focus first input for accessibility
    setTimeout(() => {
      this.form.focusTime.focus();
    }, 100);

    // Add body class to prevent scroll
    document.body.classList.add('modal-open');

    // Emit event
    document.dispatchEvent(new CustomEvent('settings:opened'));
  }

  close() {
    if (!this.isOpen) return;

    // Reset to original values if user cancelled
    this.resetToOriginalValues();

    this.modal.classList.add('hidden');
    this.isOpen = false;

    // Remove body class
    document.body.classList.remove('modal-open');

    // Clear validation errors
    Object.values(this.form).forEach(input => {
      this.clearValidationError(input);
      input.classList.remove('valid', 'invalid');
    });

    // Emit event
    document.dispatchEvent(new CustomEvent('settings:closed'));
  }

  save() {
    if (!this.validateAllInputs()) {
      this.showSaveError('Please fix validation errors before saving');
      return;
    }

    try {
      // Save timer configuration (convert minutes to ms)
      const timerConfig = {
        focusTime: parseInt(this.form.focusTime.value) * 60 * 1000,
        shortBreakTime: parseInt(this.form.shortBreakTime.value) * 60 * 1000,
        longBreakTime: parseInt(this.form.longBreakTime.value) * 60 * 1000,
        longBreakInterval: parseInt(this.form.longBreakInterval.value)
      };

      this.timerEngine.configure(timerConfig);

      // Save appearance settings
      this.themeProvider.setTheme(this.form.themeSelect.value);
      this.visualRenderer.setMode(this.form.visualModeSelect.value);

      // Update original values to new saved state
      this.storeOriginalValues();

      // Show success message
      this.showSaveSuccess();

      // Close modal after short delay
      setTimeout(() => {
        this.close();
      }, 1500);

      // Emit event
      document.dispatchEvent(new CustomEvent('settings:saved', {
        detail: {
          timerConfig,
          theme: this.form.themeSelect.value,
          visualMode: this.form.visualModeSelect.value
        }
      }));

    } catch (error) {
      this.showSaveError('Failed to save settings: ' + error.message);
    }
  }

  showSaveSuccess() {
    this.showMessage('Settings saved successfully!', 'success');
  }

  showSaveError(message) {
    this.showMessage(message, 'error');
  }

  showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = this.modal.querySelectorAll('.save-message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const messageEl = document.createElement('div');
    messageEl.className = `save-message save-message--${type}`;
    messageEl.textContent = message;

    // Insert before modal footer
    const modalFooter = this.modal.querySelector('.modal-footer');
    modalFooter.parentNode.insertBefore(messageEl, modalFooter);

    // Auto-remove after delay
    setTimeout(() => {
      if (messageEl.parentNode) {
        messageEl.remove();
      }
    }, 5000);
  }

  // Public methods
  isModalOpen() {
    return this.isOpen;
  }

  getFormValues() {
    return {
      focusTime: parseInt(this.form.focusTime.value),
      shortBreakTime: parseInt(this.form.shortBreakTime.value),
      longBreakTime: parseInt(this.form.longBreakTime.value),
      longBreakInterval: parseInt(this.form.longBreakInterval.value),
      theme: this.form.themeSelect.value,
      visualMode: this.form.visualModeSelect.value
    };
  }

  // Advanced configuration helpers
  getTimeRange() {
    return {
      min: 1, // 1 minute
      max: 1440, // 24 hours
      step: 1
    };
  }

  getPresetConfigurations() {
    return {
      classic: {
        name: 'Classic Pomodoro',
        focusTime: 25,
        shortBreakTime: 5,
        longBreakTime: 15,
        longBreakInterval: 4
      },
      extended: {
        name: 'Extended Focus',
        focusTime: 45,
        shortBreakTime: 10,
        longBreakTime: 30,
        longBreakInterval: 3
      },
      quick: {
        name: 'Quick Sessions',
        focusTime: 15,
        shortBreakTime: 3,
        longBreakTime: 10,
        longBreakInterval: 6
      }
    };
  }

  applyPreset(presetName) {
    const presets = this.getPresetConfigurations();
    const preset = presets[presetName];
    
    if (!preset) {
      console.warn(`Preset "${presetName}" not found`);
      return;
    }

    this.form.focusTime.value = preset.focusTime;
    this.form.shortBreakTime.value = preset.shortBreakTime;
    this.form.longBreakTime.value = preset.longBreakTime;
    this.form.longBreakInterval.value = preset.longBreakInterval;

    // Validate inputs after applying preset
    Object.values(this.form).forEach(input => {
      if (input.type === 'number') {
        this.validateNumberInput(input);
      }
    });
  }

  // Cleanup
  destroy() {
    // Remove event listeners
    this.closeBtn.removeEventListener('click', this.close);
    this.overlay.removeEventListener('click', this.close);
    this.cancelBtn.removeEventListener('click', this.close);
    this.saveBtn.removeEventListener('click', this.save);

    // Remove body class if modal was open
    if (this.isOpen) {
      document.body.classList.remove('modal-open');
    }
  }
}

export default SettingsModal;