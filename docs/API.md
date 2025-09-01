# Component API Reference

Complete API documentation for the Aesthetic Pomodoro Timer components. This reference is essential for developers extending functionality, creating integrations, or contributing to the project.

## Table of Contents

1. [Timer Engine API](#timer-engine-api)
2. [Theme Provider API](#theme-provider-api)
3. [Visual Renderer API](#visual-renderer-api)
4. [Control Panel API](#control-panel-api)
5. [Settings Modal API](#settings-modal-api)
6. [Fullscreen Manager API](#fullscreen-manager-api)
7. [Keyboard Manager API](#keyboard-manager-api)
8. [Event System API](#event-system-api)
9. [Storage API](#storage-api)
10. [Utility Functions](#utility-functions)

## Timer Engine API

The core timer component managing all timing logic with high precision.

### TimerEngine Class

**Constructor**
```javascript
const timer = new TimerEngine(config);
```

**Configuration Object**
```javascript
const config = {
  focusTime: 25 * 60 * 1000,      // 25 minutes in milliseconds
  shortBreak: 5 * 60 * 1000,      // 5 minutes in milliseconds  
  longBreak: 15 * 60 * 1000,      // 15 minutes in milliseconds
  sessionsUntilLongBreak: 4,      // Number of focus sessions before long break
  precision: 1000,                // Update frequency in milliseconds
  backgroundTiming: true,          // Continue timing when tab inactive
  autoStartBreaks: true,          // Automatically start break timers
  autoStartFocus: false           // Automatically start next focus session
};
```

### Core Methods

**configure(config: TimerConfig): void**
```javascript
// Update timer configuration
timer.configure({
  focusTime: 30 * 60 * 1000,     // 30 minutes
  shortBreak: 10 * 60 * 1000     // 10 minutes
});
```

**start(): void**
```javascript
// Start or resume current timer
timer.start();
```

**pause(): void**
```javascript
// Pause current timer (can be resumed)
timer.pause();
```

**reset(): void**
```javascript
// Reset current phase to beginning
timer.reset();
```

**skip(): void**
```javascript
// Skip to next phase immediately
timer.skip();
```

**fullReset(): void**
```javascript
// Reset entire session (phases and cycle count)
timer.fullReset();
```

### State Methods

**getState(): TimerState**
```javascript
const state = timer.getState();
/*
Returns:
{
  phase: 'focus' | 'short-break' | 'long-break',
  isRunning: boolean,
  remainingTime: number,        // milliseconds
  totalTime: number,            // milliseconds
  currentCycle: number,         // current focus cycle
  completedSessions: number,    // total completed focus sessions
  progress: number              // 0.0 to 1.0
}
*/
```

**getPhase(): string**
```javascript
const currentPhase = timer.getPhase(); // 'focus', 'short-break', 'long-break'
```

**isRunning(): boolean**
```javascript
const running = timer.isRunning();
```

**getRemainingTime(): number**
```javascript
const remaining = timer.getRemainingTime(); // milliseconds
```

**getProgress(): number**
```javascript
const progress = timer.getProgress(); // 0.0 to 1.0
```

### Event Listeners

**addEventListener(event: string, callback: function): void**
```javascript
// Listen for timer events
timer.addEventListener('tick', (state) => {
  console.log(`Time remaining: ${state.remainingTime}ms`);
});

timer.addEventListener('phase-change', (event) => {
  console.log(`Changed from ${event.fromPhase} to ${event.toPhase}`);
});

timer.addEventListener('complete', (event) => {
  console.log(`Completed ${event.phase} phase`);
});
```

**removeEventListener(event: string, callback: function): void**
```javascript
timer.removeEventListener('tick', tickHandler);
```

### Timer Events

| Event | Payload | Description |
|-------|---------|-------------|
| `tick` | `TimerState` | Fired every second during active timer |
| `start` | `{phase, totalTime}` | Timer started or resumed |
| `pause` | `{phase, remainingTime}` | Timer paused |
| `reset` | `{phase}` | Timer reset to beginning of phase |
| `skip` | `{fromPhase, toPhase}` | Phase skipped manually |
| `phase-change` | `{fromPhase, toPhase, cycle}` | Automatic phase transition |
| `complete` | `{phase, completedCount}` | Phase completed naturally |
| `session-complete` | `{sessionsCompleted}` | Focus session completed |
| `cycle-complete` | `{cyclesCompleted}` | Full Pomodoro cycle completed |

## Theme Provider API

Manages theme switching, customization, and CSS custom properties.

### ThemeProvider Class

**Static Methods**

**setTheme(themeName: string): void**
```javascript
// Switch to a theme
ThemeProvider.setTheme('dark');
```

**getTheme(): string**
```javascript
// Get current theme name
const currentTheme = ThemeProvider.getTheme();
```

**getAvailableThemes(): string[]**
```javascript
// List all available themes
const themes = ThemeProvider.getAvailableThemes();
// Returns: ['light', 'dark', 'ocean', 'forest', 'sunset', 'purple']
```

**registerTheme(name: string, config: ThemeConfig): void**
```javascript
// Register a custom theme
ThemeProvider.registerTheme('my-theme', {
  name: 'My Custom Theme',
  colors: {
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
    background: '#ffffff',
    text: '#333333',
    accent: '#ffe066'
  },
  fonts: {
    primary: 'Inter, sans-serif',
    display: 'Playfair Display, serif',
    mono: 'JetBrains Mono, monospace'
  },
  spacing: {
    unit: '1rem',
    scale: 1.2
  },
  animations: {
    duration: '300ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
});
```

**getThemeConfig(themeName: string): ThemeConfig**
```javascript
// Get theme configuration object
const config = ThemeProvider.getThemeConfig('dark');
```

**previewTheme(themeName: string): void**
```javascript
// Temporarily apply theme (doesn't save preference)
ThemeProvider.previewTheme('ocean');
```

**applyCustomProperties(properties: object): void**
```javascript
// Apply custom CSS properties directly
ThemeProvider.applyCustomProperties({
  '--primary-color': '#ff0000',
  '--background-color': '#ffffff'
});
```

### Theme Events

**addEventListener(event: string, callback: function): void**
```javascript
ThemeProvider.addEventListener('theme-changed', (event) => {
  console.log(`Theme changed to: ${event.themeName}`);
});
```

| Event | Payload | Description |
|-------|---------|-------------|
| `theme-changed` | `{themeName, config, previousTheme}` | Theme switched |
| `theme-registered` | `{themeName, config}` | New theme registered |
| `custom-properties-applied` | `{properties}` | CSS properties updated |

## Visual Renderer API

Handles visual display modes, animations, and progress rendering.

### VisualRenderer Class

**Constructor**
```javascript
const renderer = new VisualRenderer(container, config);
```

**Configuration**
```javascript
const config = {
  mode: 'progress',              // 'progress', 'shapes', 'minimal', 'creative'
  animationSpeed: 'normal',      // 'slow', 'normal', 'fast', 'off'
  showProgress: true,            // Show progress indicator
  showTime: true,                // Show remaining time
  showPhase: true                // Show current phase name
};
```

### Core Methods

**setMode(mode: string): void**
```javascript
// Change visual rendering mode
renderer.setMode('shapes');
```

**render(timerState: TimerState): void**
```javascript
// Render current timer state
renderer.render(timer.getState());
```

**startAnimation(): void**
```javascript
// Start visual animations
renderer.startAnimation();
```

**stopAnimation(): void**
```javascript
// Stop visual animations
renderer.stopAnimation();
```

**resize(): void**
```javascript
// Handle container resize
renderer.resize();
```

### Visual Mode Methods

**getAvailableModes(): string[]**
```javascript
const modes = renderer.getAvailableModes();
// Returns: ['progress', 'shapes', 'minimal', 'creative']
```

**getModeConfig(mode: string): ModeConfig**
```javascript
const config = renderer.getModeConfig('shapes');
```

**registerMode(name: string, config: ModeConfig): void**
```javascript
// Register custom visual mode
renderer.registerMode('custom-mode', {
  name: 'Custom Mode',
  description: 'My custom visualization',
  render: (state, container) => {
    // Custom rendering logic
  },
  animate: (progress, container) => {
    // Custom animation logic  
  },
  cleanup: (container) => {
    // Cleanup when mode changes
  }
});
```

### Visual Events

| Event | Payload | Description |
|-------|---------|-------------|
| `mode-changed` | `{mode, previousMode}` | Visual mode switched |
| `render-complete` | `{mode, state}` | Frame rendered |
| `animation-start` | `{mode}` | Animation sequence started |
| `animation-complete` | `{mode}` | Animation sequence completed |

## Control Panel API

Manages user interface controls and interactions.

### ControlPanel Class

**Constructor**
```javascript
const controls = new ControlPanel(container, timerEngine);
```

### Methods

**updateState(timerState: TimerState): void**
```javascript
// Update UI to reflect timer state
controls.updateState(timer.getState());
```

**setEnabled(enabled: boolean): void**
```javascript
// Enable/disable all controls
controls.setEnabled(false);
```

**setButtonState(button: string, state: object): void**
```javascript
// Set individual button state
controls.setButtonState('play', { 
  disabled: false, 
  text: 'Start',
  icon: 'play'
});
```

**bindCustomAction(selector: string, action: function): void**
```javascript
// Bind custom actions to UI elements
controls.bindCustomAction('.custom-button', () => {
  console.log('Custom action triggered');
});
```

### Button Events

| Event | Payload | Description |
|-------|---------|-------------|
| `play-clicked` | `{}` | Play/pause button clicked |
| `reset-clicked` | `{}` | Reset button clicked |
| `skip-clicked` | `{}` | Skip button clicked |
| `settings-clicked` | `{}` | Settings button clicked |
| `fullscreen-clicked` | `{}` | Fullscreen button clicked |

## Settings Modal API

Manages configuration interface and user preferences.

### SettingsModal Class

**Constructor**
```javascript
const settings = new SettingsModal(config);
```

### Methods

**open(tab?: string): void**
```javascript
// Open settings modal, optionally to specific tab
settings.open('themes');
```

**close(): void**
```javascript
settings.close();
```

**getSettings(): SettingsObject**
```javascript
const currentSettings = settings.getSettings();
```

**updateSettings(newSettings: SettingsObject): void**
```javascript
settings.updateSettings({
  focusTime: 30,
  theme: 'dark',
  audioEnabled: true
});
```

**resetToDefaults(): void**
```javascript
// Reset all settings to default values
settings.resetToDefaults();
```

**exportSettings(): string**
```javascript
// Export settings as JSON string
const settingsJson = settings.exportSettings();
```

**importSettings(settingsJson: string): void**
```javascript
// Import settings from JSON string
settings.importSettings(settingsJson);
```

### Settings Events

| Event | Payload | Description |
|-------|---------|-------------|
| `settings-changed` | `{category, settings, previousSettings}` | Settings updated |
| `settings-saved` | `{settings}` | Settings saved to storage |
| `settings-reset` | `{}` | Settings reset to defaults |
| `modal-opened` | `{tab}` | Settings modal opened |
| `modal-closed` | `{}` | Settings modal closed |

## Fullscreen Manager API

Handles fullscreen functionality and screen management.

### FullscreenManager Class

**Static Methods**

**enter(): Promise<void>**
```javascript
// Enter fullscreen mode
try {
  await FullscreenManager.enter();
  console.log('Entered fullscreen');
} catch (error) {
  console.log('Fullscreen not supported or denied');
}
```

**exit(): Promise<void>**
```javascript
// Exit fullscreen mode
await FullscreenManager.exit();
```

**toggle(): Promise<void>**
```javascript
// Toggle fullscreen state
await FullscreenManager.toggle();
```

**isFullscreen(): boolean**
```javascript
// Check current fullscreen state
const inFullscreen = FullscreenManager.isFullscreen();
```

**isSupported(): boolean**
```javascript
// Check if fullscreen is supported
const supported = FullscreenManager.isSupported();
```

### Fullscreen Events

| Event | Payload | Description |
|-------|---------|-------------|
| `fullscreen-enter` | `{}` | Entered fullscreen mode |
| `fullscreen-exit` | `{}` | Exited fullscreen mode |
| `fullscreen-error` | `{error}` | Fullscreen operation failed |

## Keyboard Manager API

Manages keyboard shortcuts and accessibility.

### KeyboardManager Class

**Constructor**
```javascript
const keyboard = new KeyboardManager();
```

### Methods

**registerShortcut(key: string, callback: function, options?: object): void**
```javascript
// Register keyboard shortcut
keyboard.registerShortcut('Space', () => {
  timer.isRunning() ? timer.pause() : timer.start();
}, {
  preventDefault: true,
  description: 'Start/pause timer'
});

// With modifiers
keyboard.registerShortcut('Ctrl+,', () => {
  settings.open();
}, {
  description: 'Open settings'
});
```

**unregisterShortcut(key: string): void**
```javascript
keyboard.unregisterShortcut('Space');
```

**getShortcuts(): ShortcutMap**
```javascript
const shortcuts = keyboard.getShortcuts();
```

**setEnabled(enabled: boolean): void**
```javascript
// Enable/disable all shortcuts
keyboard.setEnabled(false);
```

**showHelp(): void**
```javascript
// Display shortcut help overlay
keyboard.showHelp();
```

### Keyboard Events

| Event | Payload | Description |
|-------|---------|-------------|
| `shortcut-triggered` | `{key, action, description}` | Shortcut activated |
| `shortcuts-enabled` | `{}` | Shortcuts enabled |
| `shortcuts-disabled` | `{}` | Shortcuts disabled |

## Event System API

Central event system for component communication.

### EventBus Class

**Static Methods**

**emit(event: string, payload?: object): void**
```javascript
// Emit global event
EventBus.emit('custom-event', { data: 'value' });
```

**on(event: string, callback: function): void**
```javascript
// Listen for global events
EventBus.on('timer:tick', (state) => {
  console.log('Timer tick:', state);
});
```

**off(event: string, callback: function): void**
```javascript
// Remove event listener
EventBus.off('timer:tick', tickHandler);
```

**once(event: string, callback: function): void**
```javascript
// Listen for event once
EventBus.once('timer:complete', (event) => {
  console.log('Timer completed:', event);
});
```

### Global Events

| Event | Payload | Description |
|-------|---------|-------------|
| `app:ready` | `{}` | Application initialized |
| `app:error` | `{error, component}` | Application error occurred |
| `storage:changed` | `{key, value, previousValue}` | Storage updated |
| `visibility:changed` | `{visible}` | Tab visibility changed |

## Storage API

Manages persistent storage and user preferences.

### Storage Class

**Static Methods**

**get(key: string, defaultValue?: any): any**
```javascript
// Get stored value
const theme = Storage.get('theme', 'light');
const settings = Storage.get('settings', {});
```

**set(key: string, value: any): void**
```javascript
// Store value
Storage.set('theme', 'dark');
Storage.set('settings', settingsObject);
```

**remove(key: string): void**
```javascript
// Remove stored value
Storage.remove('temporary-data');
```

**clear(): void**
```javascript
// Clear all storage
Storage.clear();
```

**exists(key: string): boolean**
```javascript
// Check if key exists
const hasTheme = Storage.exists('theme');
```

**getKeys(): string[]**
```javascript
// Get all stored keys
const keys = Storage.getKeys();
```

### Storage Events

| Event | Payload | Description |
|-------|---------|-------------|
| `storage:set` | `{key, value, previousValue}` | Value stored |
| `storage:removed` | `{key, previousValue}` | Value removed |
| `storage:cleared` | `{}` | Storage cleared |

## Utility Functions

Common utility functions available throughout the application.

### Time Utilities

**formatTime(milliseconds: number, format?: string): string**
```javascript
// Format time for display
const display = formatTime(90000); // "1:30"
const verbose = formatTime(90000, 'verbose'); // "1 minute 30 seconds"
const precise = formatTime(90000, 'precise'); // "01:30"
```

**parseTime(timeString: string): number**
```javascript
// Parse time string to milliseconds
const ms = parseTime('25:00'); // 1500000
const msFromMinutes = parseTime('25m'); // 1500000
```

**getTimeRemaining(endTime: number): number**
```javascript
// Calculate time remaining until timestamp
const remaining = getTimeRemaining(Date.now() + 1500000); // milliseconds
```

### Color Utilities

**hexToRgb(hex: string): {r: number, g: number, b: number}**
```javascript
const rgb = hexToRgb('#ff6b6b'); // {r: 255, g: 107, b: 107}
```

**rgbToHex(r: number, g: number, b: number): string**
```javascript
const hex = rgbToHex(255, 107, 107); // "#ff6b6b"
```

**getContrastColor(bgColor: string): string**
```javascript
const textColor = getContrastColor('#000000'); // "#ffffff"
```

**lightenColor(color: string, amount: number): string**
```javascript
const lighter = lightenColor('#ff6b6b', 0.2); // 20% lighter
```

### DOM Utilities

**createElement(tag: string, attributes?: object, children?: Node[]): Element**
```javascript
const button = createElement('button', {
  className: 'btn btn-primary',
  'data-action': 'play'
}, [
  document.createTextNode('Play')
]);
```

**addEventDelegate(container: Element, selector: string, event: string, handler: function): void**
```javascript
// Event delegation
addEventDelegate(document.body, '.timer-button', 'click', (event) => {
  console.log('Timer button clicked:', event.target);
});
```

**animate(element: Element, keyframes: Keyframe[], options?: KeyframeAnimationOptions): Animation**
```javascript
// Web Animations API wrapper
const animation = animate(element, [
  { opacity: 0, transform: 'scale(0.8)' },
  { opacity: 1, transform: 'scale(1)' }
], {
  duration: 300,
  easing: 'ease-out'
});
```

### Validation Utilities

**validateTimerConfig(config: object): {valid: boolean, errors: string[]}**
```javascript
const result = validateTimerConfig({
  focusTime: 25 * 60 * 1000,
  shortBreak: 5 * 60 * 1000
});
// Returns: {valid: true, errors: []}
```

**validateThemeConfig(config: object): {valid: boolean, errors: string[]}**
```javascript
const result = validateThemeConfig(themeConfig);
```

### Performance Utilities

**debounce(func: function, wait: number): function**
```javascript
const debouncedResize = debounce(() => {
  renderer.resize();
}, 300);

window.addEventListener('resize', debouncedResize);
```

**throttle(func: function, limit: number): function**
```javascript
const throttledScroll = throttle(() => {
  updateScrollPosition();
}, 100);
```

**requestIdleCallback(callback: function): number**
```javascript
// Schedule work during idle time
const id = requestIdleCallback(() => {
  performNonCriticalWork();
});
```

---

## TypeScript Definitions

For TypeScript users, comprehensive type definitions are available:

```typescript
// Import types
import { 
  TimerState, 
  TimerConfig, 
  ThemeConfig, 
  VisualMode,
  SettingsObject 
} from './types';

// Use with proper typing
const timer: TimerEngine = new TimerEngine(config);
const state: TimerState = timer.getState();
```

## API Error Handling

All API methods that can fail return promises or throw descriptive errors:

```javascript
try {
  await FullscreenManager.enter();
} catch (error) {
  if (error.code === 'NOT_SUPPORTED') {
    showMessage('Fullscreen not supported in this browser');
  } else if (error.code === 'PERMISSION_DENIED') {
    showMessage('Fullscreen permission denied');
  }
}
```

## API Examples

**Complete Timer Integration**
```javascript
// Initialize timer with custom config
const timer = new TimerEngine({
  focusTime: 30 * 60 * 1000, // 30 minutes
  shortBreak: 10 * 60 * 1000  // 10 minutes
});

// Set up event listeners
timer.addEventListener('tick', (state) => {
  document.querySelector('.time-display').textContent = 
    formatTime(state.remainingTime);
});

timer.addEventListener('phase-change', (event) => {
  ThemeProvider.setTheme(event.toPhase === 'focus' ? 'dark' : 'light');
});

// Start timer
timer.start();
```

**Custom Theme Creation**
```javascript
// Register and apply custom theme
ThemeProvider.registerTheme('productivity', {
  colors: {
    primary: '#2c3e50',
    secondary: '#3498db', 
    background: '#ecf0f1',
    text: '#2c3e50'
  },
  fonts: {
    primary: 'Source Sans Pro, sans-serif'
  }
});

ThemeProvider.setTheme('productivity');
```

---

**API Version**: 1.0.0  
**Last Updated**: 2025-09-01

*This API is designed for stability and extensibility. All methods maintain backward compatibility within major versions.*