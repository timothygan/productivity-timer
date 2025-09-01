/**
 * Main Application Entry Point
 * Orchestrates all components and initializes the aesthetic pomodoro timer
 */

// Import all components
import TimerEngine from './components/TimerEngine.js';
import ThemeProvider from './components/ThemeProvider.js';
import VisualRenderer from './components/VisualRenderer.js';
import ControlPanel from './components/ControlPanel.js';
import SettingsModal from './components/SettingsModal.js';
import FullscreenManager from './components/FullscreenManager.js';
import KeyboardManager from './components/KeyboardManager.js';

/**
 * Application class - Main orchestrator
 */
class App {
  constructor() {
    this.components = {};
    this.isInitialized = false;
    
    this.init();
  }

  async init() {
    try {
      // Initialize components in dependency order
      await this.initializeComponents();
      
      // Set up component interactions
      this.setupComponentInteractions();
      
      // Set up global event handlers
      this.setupGlobalHandlers();
      
      // Initial UI update
      this.updateInitialUI();
      
      this.isInitialized = true;
      console.log('🎯 Aesthetic Pomodoro Timer initialized successfully');
      
      // Emit app ready event
      document.dispatchEvent(new CustomEvent('app:ready', {
        detail: { app: this }
      }));
      
    } catch (error) {
      console.error('Failed to initialize application:', error);
      this.showErrorMessage('Failed to initialize application. Please refresh the page.');
    }
  }

  async initializeComponents() {
    // 1. Core timer engine (no dependencies)
    this.components.timerEngine = new TimerEngine();
    
    // 2. Theme provider (no dependencies)
    this.components.themeProvider = new ThemeProvider();
    
    // 3. Visual renderer (depends on canvas element, timer engine, and theme provider)
    const canvasElement = document.getElementById('timer-canvas');
    if (!canvasElement) {
      throw new Error('Timer canvas element not found');
    }
    this.components.visualRenderer = new VisualRenderer(
      canvasElement,
      this.components.timerEngine,
      this.components.themeProvider
    );
    
    // 4. Control panel (depends on timer engine)
    this.components.controlPanel = new ControlPanel(this.components.timerEngine);
    
    // 5. Settings modal (depends on timer engine, theme provider, visual renderer)
    this.components.settingsModal = new SettingsModal(
      this.components.timerEngine,
      this.components.themeProvider,
      this.components.visualRenderer
    );
    
    // 6. Fullscreen manager (no dependencies)
    this.components.fullscreenManager = new FullscreenManager();
    
    // 7. Keyboard manager (depends on all other components)
    this.components.keyboardManager = new KeyboardManager(
      this.components.timerEngine,
      this.components.themeProvider,
      this.components.visualRenderer,
      this.components.settingsModal,
      this.components.fullscreenManager
    );
  }

  setupComponentInteractions() {
    const { timerEngine, themeProvider, visualRenderer, controlPanel, settingsModal } = this.components;

    // Timer completion celebrations
    timerEngine.on('timer:complete', (event) => {
      this.handleTimerCompletion(event.detail);
    });

    // Theme change handling
    themeProvider.on('theme:changed', (event) => {
      this.handleThemeChange(event.detail);
    });

    // Settings changes
    document.addEventListener('settings:saved', (event) => {
      this.handleSettingsSaved(event.detail);
    });

    // Quick action buttons
    this.setupQuickActions();
  }

  setupQuickActions() {
    // Theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.components.themeProvider.toggleTheme();
      });
    }

    // Visual mode toggle button
    const visualToggle = document.getElementById('visual-mode-toggle');
    if (visualToggle) {
      visualToggle.addEventListener('click', () => {
        this.components.visualRenderer.toggleMode();
      });
    }

    // Fullscreen toggle button
    const fullscreenToggle = document.getElementById('fullscreen-toggle');
    if (fullscreenToggle) {
      fullscreenToggle.addEventListener('click', () => {
        if (this.components.fullscreenManager.getIsSupported()) {
          this.components.fullscreenManager.toggle();
        } else {
          this.showNotification('Fullscreen not supported in this browser', 'warning');
        }
      });
    }
  }

  setupGlobalHandlers() {
    // Handle visibility changes (tab switching)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.handleTabHidden();
      } else {
        this.handleTabVisible();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      this.handleWindowResize();
    });

    // Handle errors
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });
  }

  handleTimerCompletion(data) {
    // Play completion sound if available
    this.playCompletionSound(data.completedPhase);
    
    // Show celebration animation
    this.showCelebration(data);
    
    // Send browser notification if permitted
    this.sendBrowserNotification(data);
  }

  handleThemeChange(data) {
    // Animate theme transition
    document.body.style.transition = 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)';
    
    // Update meta theme color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', data.themeConfig.colors.primary);
    }
    
    // Log theme change
    console.log(`🎨 Theme changed to: ${data.newTheme}`);
  }

  handleSettingsSaved(data) {
    console.log('⚙️ Settings saved:', data);
    this.showNotification('Settings saved successfully!', 'success');
  }

  handleTabHidden() {
    // Timer engine already handles background timing
    console.log('👁️ Tab hidden - timer continues in background');
  }

  handleTabVisible() {
    // Update UI to current state
    this.updateInitialUI();
    console.log('👁️ Tab visible - UI updated');
  }

  handleWindowResize() {
    // Visual renderer handles its own resize
    // Just trigger a re-render to ensure everything is properly sized
    setTimeout(() => {
      this.components.visualRenderer?.render();
    }, 100);
  }

  updateInitialUI() {
    // Update timer display
    const timerState = this.components.timerEngine.getState();
    const timeValue = document.querySelector('.time-value');
    const phaseLabel = document.querySelector('.phase-label');
    
    if (timeValue) {
      timeValue.textContent = this.components.timerEngine.formatTime(timerState.remainingTime);
    }
    
    if (phaseLabel) {
      phaseLabel.textContent = this.components.timerEngine.getPhaseLabel();
    }
    
    // Update document title
    document.title = `${this.components.timerEngine.formatTime(timerState.remainingTime)} - ${this.components.timerEngine.getPhaseLabel()}`;
  }

  // Audio and notifications
  playCompletionSound(phase) {
    // Simple audio feedback using Web Audio API
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Different tones for different phases
      const frequencies = {
        focus: [523.25, 659.25, 783.99], // C, E, G (major chord)
        shortBreak: [392.00, 493.88, 587.33], // G, B, D
        longBreak: [261.63, 329.63, 392.00] // C, E, G (lower octave)
      };
      
      const freq = frequencies[phase] || frequencies.focus;
      
      freq.forEach((frequency, index) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
        }, index * 200);
      });
    } catch (error) {
      console.warn('Could not play completion sound:', error);
    }
  }

  showCelebration(data) {
    // Create celebratory visual effect
    const celebration = document.createElement('div');
    celebration.className = 'celebration-effect';
    celebration.innerHTML = '🎉';
    celebration.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 4rem;
      z-index: 1002;
      pointer-events: none;
      animation: celebrationPop 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    
    document.body.appendChild(celebration);
    
    setTimeout(() => {
      if (celebration.parentNode) {
        document.body.removeChild(celebration);
      }
    }, 1000);
  }

  async sendBrowserNotification(data) {
    if ('Notification' in window) {
      // Request permission if not already granted
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }
      
      if (Notification.permission === 'granted') {
        const messages = {
          focus: '🎯 Focus session complete! Time for a break.',
          shortBreak: '☕ Break over! Ready to focus again?',
          longBreak: '🌟 Long break complete! Time to get back to work.'
        };
        
        new Notification('Pomodoro Timer', {
          body: messages[data.completedPhase] || 'Timer session complete!',
          icon: '/favicon.ico',
          tag: 'pomodoro-notification',
          requireInteraction: true
        });
      }
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `app-notification app-notification--${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-surface);
      color: var(--color-text);
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: var(--shadow-lg);
      z-index: 1001;
      transform: translateX(100%);
      transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
      max-width: 300px;
    `;
    
    if (type === 'success') {
      notification.style.background = 'var(--color-success)';
      notification.style.color = 'white';
    } else if (type === 'warning') {
      notification.style.background = 'var(--color-warning)';
      notification.style.color = 'white';
    } else if (type === 'error') {
      notification.style.background = 'var(--color-error)';
      notification.style.color = 'white';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
    });
    
    // Auto remove
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'app-error';
    errorDiv.innerHTML = `
      <h2>Application Error</h2>
      <p>${message}</p>
      <button onclick="location.reload()">Reload Page</button>
    `;
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--color-error);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      text-align: center;
      z-index: 1003;
      max-width: 400px;
    `;
    
    document.body.appendChild(errorDiv);
  }

  // Public API methods
  getComponent(name) {
    return this.components[name];
  }

  getAllComponents() {
    return { ...this.components };
  }

  getTimerState() {
    return this.components.timerEngine?.getState();
  }

  getCurrentTheme() {
    return this.components.themeProvider?.getCurrentTheme();
  }

  getCurrentVisualMode() {
    return this.components.visualRenderer?.getCurrentMode();
  }

  // Cleanup
  destroy() {
    // Destroy all components
    Object.values(this.components).forEach(component => {
      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }
    });
    
    // Clear components
    this.components = {};
    this.isInitialized = false;
    
    console.log('🧹 Application destroyed');
  }
}

// Add celebration animation CSS
const celebrationStyle = document.createElement('style');
celebrationStyle.textContent = `
  @keyframes celebrationPop {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 0;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.2);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0;
    }
  }
`;
document.head.appendChild(celebrationStyle);

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.pomodoroApp = new App();
  });
} else {
  window.pomodoroApp = new App();
}

// Export for potential external use
export default App;