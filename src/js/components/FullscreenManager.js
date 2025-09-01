/**
 * FullscreenManager - Browser API wrapper for fullscreen functionality
 * Handles cross-browser compatibility and fullscreen state management
 */
class FullscreenManager {
  constructor() {
    this.isFullscreen = false;
    this.element = null;
    this.eventTarget = new EventTarget();
    
    // Check API support
    this.isSupported = this.checkSupport();
    
    if (this.isSupported) {
      this.bindEvents();
    }
  }

  checkSupport() {
    return !!(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    );
  }

  bindEvents() {
    // Listen for fullscreen state changes
    const events = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange'
    ];

    events.forEach(eventName => {
      document.addEventListener(eventName, () => {
        this.handleFullscreenChange();
      });
    });

    // Listen for fullscreen errors
    const errorEvents = [
      'fullscreenerror',
      'webkitfullscreenerror',
      'mozfullscreenerror',
      'MSFullscreenError'
    ];

    errorEvents.forEach(eventName => {
      document.addEventListener(eventName, (event) => {
        this.handleFullscreenError(event);
      });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      if (event.code === 'KeyF') {
        event.preventDefault();
        this.toggle();
      }
    });

    // UI button event
    const fullscreenBtn = document.getElementById('fullscreen-toggle');
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        this.toggle();
      });
    }
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

  handleFullscreenChange() {
    this.isFullscreen = !!this.getFullscreenElement();
    this.element = this.getFullscreenElement();
    
    // Update UI
    this.updateUI();
    
    // Emit event
    this.emit('fullscreen:changed', { 
      isFullscreen: this.isFullscreen,
      element: this.element
    });

    // Handle canvas resize if in fullscreen
    if (this.isFullscreen) {
      this.handleFullscreenEnter();
    } else {
      this.handleFullscreenExit();
    }
  }

  handleFullscreenError(event) {
    console.warn('Fullscreen error:', event);
    this.emit('fullscreen:error', { error: event });
  }

  handleFullscreenEnter() {
    // Add fullscreen class to body
    document.body.classList.add('is-fullscreen');
    
    // Trigger canvas resize
    window.dispatchEvent(new Event('resize'));
    
    // Hide cursor after inactivity in fullscreen
    this.setupCursorHiding();
  }

  handleFullscreenExit() {
    // Remove fullscreen class
    document.body.classList.remove('is-fullscreen');
    
    // Clear cursor hiding
    this.clearCursorHiding();
    
    // Trigger canvas resize
    window.dispatchEvent(new Event('resize'));
  }

  setupCursorHiding() {
    let cursorTimer;
    
    const hideCursor = () => {
      document.body.style.cursor = 'none';
    };
    
    const showCursor = () => {
      document.body.style.cursor = 'auto';
      clearTimeout(cursorTimer);
      cursorTimer = setTimeout(hideCursor, 3000);
    };

    // Show cursor on movement
    document.addEventListener('mousemove', showCursor);
    document.addEventListener('mousedown', showCursor);
    document.addEventListener('keydown', showCursor);
    
    // Initial timer
    cursorTimer = setTimeout(hideCursor, 3000);
    
    // Store cleanup function
    this.cursorCleanup = () => {
      document.removeEventListener('mousemove', showCursor);
      document.removeEventListener('mousedown', showCursor);
      document.removeEventListener('keydown', showCursor);
      clearTimeout(cursorTimer);
      document.body.style.cursor = 'auto';
    };
  }

  clearCursorHiding() {
    if (this.cursorCleanup) {
      this.cursorCleanup();
      this.cursorCleanup = null;
    }
  }

  updateUI() {
    const fullscreenBtn = document.getElementById('fullscreen-toggle');
    if (fullscreenBtn) {
      const icon = this.isFullscreen ? '🗗' : '⛶';
      const label = this.isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen';
      
      fullscreenBtn.textContent = icon;
      fullscreenBtn.setAttribute('aria-label', label);
      fullscreenBtn.title = label;
    }
  }

  // Cross-browser fullscreen methods
  getFullscreenElement() {
    return (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement ||
      null
    );
  }

  requestFullscreen(element = document.documentElement) {
    if (element.requestFullscreen) {
      return element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      return element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      return element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      return element.msRequestFullscreen();
    }
    
    return Promise.reject(new Error('Fullscreen not supported'));
  }

  exitFullscreen() {
    if (document.exitFullscreen) {
      return document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      return document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      return document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      return document.msExitFullscreen();
    }
    
    return Promise.reject(new Error('Exit fullscreen not supported'));
  }

  // Public methods
  async enter(element = document.documentElement) {
    if (!this.isSupported) {
      throw new Error('Fullscreen API not supported');
    }

    if (this.isFullscreen) {
      return; // Already in fullscreen
    }

    try {
      await this.requestFullscreen(element);
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
      throw error;
    }
  }

  async exit() {
    if (!this.isSupported) {
      throw new Error('Fullscreen API not supported');
    }

    if (!this.isFullscreen) {
      return; // Not in fullscreen
    }

    try {
      await this.exitFullscreen();
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
      throw error;
    }
  }

  async toggle(element = document.documentElement) {
    if (this.isFullscreen) {
      await this.exit();
    } else {
      await this.enter(element);
    }
  }

  // Getters
  getIsFullscreen() {
    return this.isFullscreen;
  }

  getIsSupported() {
    return this.isSupported;
  }

  getCurrentElement() {
    return this.element;
  }

  // Advanced features
  enterTimerFullscreen() {
    // Enter fullscreen optimized for timer display
    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) {
      return this.enter(timerDisplay);
    }
    return this.enter();
  }

  // Cleanup
  destroy() {
    if (this.isFullscreen) {
      this.exit();
    }
    
    this.clearCursorHiding();
    
    // Remove event listeners would need to be more specific in a real implementation
    // For now, just cleanup cursor
  }
}

export default FullscreenManager;