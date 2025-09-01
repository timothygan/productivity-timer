/**
 * ControlPanel - Handles user interactions with timer controls
 * Event delegation pattern with accessibility support
 */
class ControlPanel {
  constructor(timerEngine) {
    this.timerEngine = timerEngine;
    this.elements = this.bindElements();
    this.state = {
      isRunning: false
    };
    
    this.bindEvents();
    this.bindTimerEvents();
    this.updateUI();
  }

  bindElements() {
    return {
      startPauseBtn: document.getElementById('start-pause-btn'),
      resetBtn: document.getElementById('reset-btn'),
      settingsBtn: document.getElementById('settings-btn'),
      timerText: document.getElementById('timer-text'),
      timeValue: document.querySelector('.time-value'),
      phaseLabel: document.querySelector('.phase-label')
    };
  }

  bindEvents() {
    // Start/Pause button
    this.elements.startPauseBtn.addEventListener('click', () => {
      this.handleStartPause();
    });

    // Reset button
    this.elements.resetBtn.addEventListener('click', () => {
      this.handleReset();
    });

    // Settings button
    this.elements.settingsBtn.addEventListener('click', () => {
      this.handleSettings();
    });

    // Keyboard shortcuts
    this.bindKeyboardShortcuts();
  }

  bindKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Don't trigger shortcuts when typing in inputs
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          this.handleStartPause();
          break;
        case 'KeyR':
          event.preventDefault();
          this.handleReset();
          break;
        case 'KeyS':
          event.preventDefault();
          this.handleSettings();
          break;
      }
    });
  }

  bindTimerEvents() {
    this.timerEngine.on('timer:start', () => {
      this.state.isRunning = true;
      this.updateUI();
    });

    this.timerEngine.on('timer:pause', () => {
      this.state.isRunning = false;
      this.updateUI();
    });

    this.timerEngine.on('timer:reset', () => {
      this.state.isRunning = false;
      this.updateUI();
    });

    this.timerEngine.on('timer:tick', (event) => {
      this.updateTimeDisplay(event.detail);
    });

    this.timerEngine.on('timer:complete', (event) => {
      this.state.isRunning = false;
      this.handleTimerComplete(event.detail);
    });

    this.timerEngine.on('timer:phase-change', (event) => {
      this.updatePhaseLabel(event.detail);
    });
  }

  // Event handlers
  handleStartPause() {
    if (this.state.isRunning) {
      this.timerEngine.pause();
    } else {
      this.timerEngine.start();
    }
  }

  handleReset() {
    this.timerEngine.reset();
  }

  handleSettings() {
    // Emit custom event for settings modal
    document.dispatchEvent(new CustomEvent('control:settings-open'));
  }

  handleTimerComplete(data) {
    this.updateUI();
    
    // Show completion notification
    this.showCompletionNotification(data);
    
    // Emit completion event for other components
    document.dispatchEvent(new CustomEvent('control:timer-complete', { 
      detail: data 
    }));
  }

  // UI Updates
  updateUI() {
    const timerState = this.timerEngine.getState();
    
    // Update start/pause button
    this.updateStartPauseButton();
    
    // Update time display
    this.updateTimeDisplay({ 
      remainingTime: timerState.remainingTime,
      phase: timerState.phase 
    });
    
    // Update phase label
    this.updatePhaseLabel({ 
      toPhase: timerState.phase 
    });
    
    // Update button states
    this.updateButtonStates();
  }

  updateStartPauseButton() {
    const btnText = this.elements.startPauseBtn.querySelector('.btn-text');
    const isRunning = this.state.isRunning;
    
    btnText.textContent = isRunning ? 'Pause' : 'Start';
    this.elements.startPauseBtn.setAttribute('aria-label', 
      isRunning ? 'Pause timer' : 'Start timer'
    );
    
    // Update button styling
    this.elements.startPauseBtn.classList.toggle('running', isRunning);
  }

  updateTimeDisplay(data) {
    const formattedTime = this.timerEngine.formatTime(data.remainingTime);
    this.elements.timeValue.textContent = formattedTime;
    
    // Update document title for tab visibility
    document.title = `${formattedTime} - ${this.timerEngine.getPhaseLabel()}`;
  }

  updatePhaseLabel(data) {
    const phaseLabels = {
      focus: 'Focus Time',
      shortBreak: 'Short Break',
      longBreak: 'Long Break'
    };
    
    const label = phaseLabels[data.toPhase] || 'Timer';
    this.elements.phaseLabel.textContent = label;
    
    // Add phase-specific styling
    this.elements.timerText.className = `timer-text phase-${data.toPhase}`;
  }

  updateButtonStates() {
    // Disable/enable buttons based on state
    const timerState = this.timerEngine.getState();
    
    // Reset button is always enabled
    this.elements.resetBtn.disabled = false;
    
    // Settings button disabled during timer run to prevent conflicts
    this.elements.settingsBtn.disabled = this.state.isRunning;
  }

  showCompletionNotification(data) {
    // Create temporary notification
    const notification = document.createElement('div');
    notification.className = 'completion-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <h3>${this.getCompletionMessage(data)}</h3>
        <p>Starting ${this.getNextPhaseMessage(data.newPhase)}</p>
      </div>
    `;
    
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
    }, 3000);
  }

  getCompletionMessage(data) {
    switch (data.completedPhase) {
      case 'focus':
        return '🎯 Focus Session Complete!';
      case 'shortBreak':
        return '☕ Break Time Over!';
      case 'longBreak':
        return '🌟 Long Break Complete!';
      default:
        return '✅ Session Complete!';
    }
  }

  getNextPhaseMessage(phase) {
    switch (phase) {
      case 'focus':
        return 'your next focus session';
      case 'shortBreak':
        return 'a short break';
      case 'longBreak':
        return 'a well-deserved long break';
      default:
        return 'the next session';
    }
  }

  // Accessibility helpers
  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  // Public methods for external control
  getCurrentState() {
    return {
      isRunning: this.state.isRunning,
      timerState: this.timerEngine.getState()
    };
  }

  // Cleanup
  destroy() {
    // Remove event listeners
    this.elements.startPauseBtn.removeEventListener('click', this.handleStartPause);
    this.elements.resetBtn.removeEventListener('click', this.handleReset);
    this.elements.settingsBtn.removeEventListener('click', this.handleSettings);
    
    // Remove timer event listeners
    this.timerEngine.off('timer:start', this.updateUI);
    this.timerEngine.off('timer:pause', this.updateUI);
    this.timerEngine.off('timer:reset', this.updateUI);
    this.timerEngine.off('timer:tick', this.updateTimeDisplay);
    this.timerEngine.off('timer:complete', this.handleTimerComplete);
    this.timerEngine.off('timer:phase-change', this.updatePhaseLabel);
  }
}

export default ControlPanel;