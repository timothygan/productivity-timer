/**
 * TimerEngine - Singleton pattern for precise timing
 * Handles all timing logic with 1ms precision using hybrid timing system
 * Supports range from 1 second to 24 hours with risk mitigation for browser backgrounding
 */
class TimerEngine {
  constructor() {
    if (TimerEngine.instance) {
      return TimerEngine.instance;
    }

    // Timer state
    this.state = {
      phase: 'focus', // 'focus' | 'shortBreak' | 'longBreak'
      remainingTime: 25 * 60 * 1000, // milliseconds
      totalTime: 25 * 60 * 1000,
      isRunning: false,
      currentCycle: 0,
      sessionCount: 0
    };

    // Configuration
    this.config = {
      focusTime: 25 * 60 * 1000, // 25 minutes in ms
      shortBreakTime: 5 * 60 * 1000, // 5 minutes in ms  
      longBreakTime: 15 * 60 * 1000, // 15 minutes in ms
      longBreakInterval: 4 // Long break after every 4 cycles
    };

    // Timing precision system (hybrid approach)
    this.startTimestamp = null;
    this.pausedDuration = 0;
    this.rafId = null;
    this.intervalId = null;
    this.lastTickTime = null;

    // Event system
    this.eventTarget = new EventTarget();

    // Page Visibility API for background tab handling
    this.isTabVisible = !document.hidden;
    this.bindVisibilityEvents();

    // Load persisted state
    this.loadState();

    TimerEngine.instance = this;
    return this;
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

  // Configuration methods
  configure(newConfig) {
    const validatedConfig = this.validateConfig(newConfig);
    this.config = { ...this.config, ...validatedConfig };
    
    // Update current phase time if not running
    if (!this.state.isRunning) {
      this.resetToPhase(this.state.phase);
    }
    
    this.saveState();
    this.emit('timer:configured', { config: this.config });
  }

  validateConfig(config) {
    const validated = {};
    
    if (config.focusTime !== undefined) {
      validated.focusTime = Math.max(1000, Math.min(24 * 60 * 60 * 1000, config.focusTime));
    }
    if (config.shortBreakTime !== undefined) {
      validated.shortBreakTime = Math.max(1000, Math.min(24 * 60 * 60 * 1000, config.shortBreakTime));
    }
    if (config.longBreakTime !== undefined) {
      validated.longBreakTime = Math.max(1000, Math.min(24 * 60 * 60 * 1000, config.longBreakTime));
    }
    if (config.longBreakInterval !== undefined) {
      validated.longBreakInterval = Math.max(1, Math.min(10, config.longBreakInterval));
    }
    
    return validated;
  }

  // Core timer methods
  start() {
    if (this.state.isRunning) return;

    this.state.isRunning = true;
    this.startTimestamp = performance.now();
    this.lastTickTime = this.startTimestamp;
    
    this.startPrecisionTimer();
    this.saveState();
    
    this.emit('timer:start', { 
      phase: this.state.phase, 
      totalTime: this.state.totalTime,
      remainingTime: this.state.remainingTime
    });
  }

  pause() {
    if (!this.state.isRunning) return;

    this.state.isRunning = false;
    this.stopPrecisionTimer();
    this.saveState();
    
    this.emit('timer:pause', { 
      phase: this.state.phase, 
      remainingTime: this.state.remainingTime 
    });
  }

  reset() {
    this.pause();
    this.resetToPhase('focus');
    this.state.currentCycle = 0;
    this.state.sessionCount = 0;
    this.saveState();
    
    this.emit('timer:reset', { 
      phase: this.state.phase, 
      totalTime: this.state.totalTime 
    });
  }

  // Precision timing system (hybrid requestAnimationFrame + setInterval)
  startPrecisionTimer() {
    // Primary timer using requestAnimationFrame for high precision
    const tick = (currentTime) => {
      if (!this.state.isRunning) return;

      const deltaTime = currentTime - this.lastTickTime;
      this.lastTickTime = currentTime;

      // Update remaining time
      this.state.remainingTime = Math.max(0, this.state.remainingTime - deltaTime);

      // Check for completion
      if (this.state.remainingTime <= 0) {
        this.handlePhaseComplete();
        return;
      }

      // Emit tick event (throttled to avoid excessive events)
      if (Math.floor(currentTime / 100) !== Math.floor((currentTime - deltaTime) / 100)) {
        this.emit('timer:tick', { 
          remainingTime: this.state.remainingTime, 
          phase: this.state.phase,
          progress: 1 - (this.state.remainingTime / this.state.totalTime)
        });
      }

      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);

    // Backup timer using setInterval for reliability in backgrounded tabs
    this.intervalId = setInterval(() => {
      if (!this.state.isRunning) return;

      // Verify accuracy against elapsed time
      const actualElapsed = performance.now() - this.startTimestamp;
      const expectedRemaining = this.state.totalTime - actualElapsed;
      
      // Correct drift if significant (>100ms)
      if (Math.abs(this.state.remainingTime - expectedRemaining) > 100) {
        this.state.remainingTime = Math.max(0, expectedRemaining);
      }
    }, 1000);
  }

  stopPrecisionTimer() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  handlePhaseComplete() {
    const completedPhase = this.state.phase;
    
    this.state.isRunning = false;
    this.stopPrecisionTimer();

    // Determine next phase
    if (completedPhase === 'focus') {
      this.state.currentCycle++;
      this.state.sessionCount++;
      
      // Long break or short break?
      if (this.state.currentCycle % this.config.longBreakInterval === 0) {
        this.state.phase = 'longBreak';
      } else {
        this.state.phase = 'shortBreak';
      }
    } else {
      // Break completed, back to focus
      this.state.phase = 'focus';
    }

    this.resetToPhase(this.state.phase);
    this.saveState();

    this.emit('timer:complete', { 
      completedPhase, 
      newPhase: this.state.phase,
      currentCycle: this.state.currentCycle,
      sessionCount: this.state.sessionCount
    });

    this.emit('timer:phase-change', { 
      fromPhase: completedPhase, 
      toPhase: this.state.phase, 
      cycleCount: this.state.currentCycle 
    });
  }

  resetToPhase(phase) {
    this.state.phase = phase;
    
    switch (phase) {
      case 'focus':
        this.state.remainingTime = this.config.focusTime;
        this.state.totalTime = this.config.focusTime;
        break;
      case 'shortBreak':
        this.state.remainingTime = this.config.shortBreakTime;
        this.state.totalTime = this.config.shortBreakTime;
        break;
      case 'longBreak':
        this.state.remainingTime = this.config.longBreakTime;
        this.state.totalTime = this.config.longBreakTime;
        break;
    }
  }

  // Page Visibility API handling for background tabs
  bindVisibilityEvents() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Tab is now hidden
        this.isTabVisible = false;
        this.pausedDuration = performance.now();
      } else {
        // Tab is now visible
        this.isTabVisible = true;
        
        if (this.state.isRunning && this.pausedDuration) {
          // Correct for time elapsed while tab was hidden
          const hiddenDuration = performance.now() - this.pausedDuration;
          this.startTimestamp += hiddenDuration;
        }
      }
    });
  }

  // State persistence
  saveState() {
    try {
      localStorage.setItem('timerEngine:state', JSON.stringify({
        state: this.state,
        config: this.config,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Failed to save timer state:', error);
    }
  }

  loadState() {
    try {
      const saved = localStorage.getItem('timerEngine:state');
      if (!saved) return;

      const { state, config, timestamp } = JSON.parse(saved);
      
      // Don't restore running state after browser restart
      state.isRunning = false;
      
      this.state = { ...this.state, ...state };
      this.config = { ...this.config, ...config };
    } catch (error) {
      console.warn('Failed to load timer state:', error);
    }
  }

  // Getters
  getState() {
    return { ...this.state };
  }

  getConfig() {
    return { ...this.config };
  }

  getPhaseLabel() {
    const labels = {
      focus: 'Focus Time',
      shortBreak: 'Short Break',
      longBreak: 'Long Break'
    };
    return labels[this.state.phase] || 'Timer';
  }

  // Utility methods
  formatTime(milliseconds) {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Cleanup
  destroy() {
    this.pause();
    this.stopPrecisionTimer();
    document.removeEventListener('visibilitychange', this.bindVisibilityEvents);
    TimerEngine.instance = null;
  }
}

// Singleton instance holder
TimerEngine.instance = null;

export default TimerEngine;