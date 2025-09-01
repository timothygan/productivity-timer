# Troubleshooting Guide

Comprehensive troubleshooting guide for the Aesthetic Pomodoro Timer. Find solutions to common issues and get your timer working perfectly.

## Table of Contents

1. [Quick Diagnostics](#quick-diagnostics)
2. [Timer Issues](#timer-issues)
3. [Audio Problems](#audio-problems)
4. [Visual & Display Issues](#visual--display-issues)
5. [Settings & Storage Issues](#settings--storage-issues)
6. [Performance Problems](#performance-problems)
7. [Browser-Specific Issues](#browser-specific-issues)
8. [Accessibility Issues](#accessibility-issues)
9. [Advanced Diagnostics](#advanced-diagnostics)
10. [Getting Further Help](#getting-further-help)

## Quick Diagnostics

### Is the Problem Common?

**Before diving deep, try these quick fixes:**

1. **Hard Refresh**: `Ctrl/Cmd + Shift + R`
2. **Clear Browser Cache**: Settings → Privacy → Clear Data
3. **Restart Browser**: Close completely and reopen
4. **Different Browser**: Test in another browser
5. **Incognito Mode**: Try without extensions

### System Check

**Verify your setup meets requirements:**
- ✅ Modern browser (Chrome 88+, Firefox 85+, Safari 14+, Edge 88+)
- ✅ JavaScript enabled
- ✅ Local Storage available (not private browsing)
- ✅ Stable internet connection (for initial load)
- ✅ No ad blockers interfering

## Timer Issues

### Timer Not Starting

**Symptoms**: Play button doesn't respond, timer remains at starting time
**Causes**: JavaScript errors, browser restrictions, corrupted state

**Solutions**:
1. **Check Console Errors**
   - Press `F12` → Console tab
   - Look for red error messages
   - Common error: "Cannot read property of undefined"

2. **Reset Timer State**
   ```javascript
   // In browser console
   localStorage.removeItem('pomodoro-timer-state');
   location.reload();
   ```

3. **Clear All Settings**
   - Settings → Advanced → Reset to Defaults
   - Or manually: `localStorage.clear()`

4. **Check Browser Permissions**
   - Some browsers block autoplay/timers in certain contexts
   - Ensure site is not blocked or restricted

### Timer Stops Randomly

**Symptoms**: Timer starts but stops after few seconds/minutes
**Causes**: Tab backgrounding, system sleep, browser throttling

**Solutions**:
1. **Enable Background Timing**
   - Settings → Timer → Background Timing: ON
   - Uses Web Workers for precision timing

2. **Keep Tab Active**
   - Pin the timer tab
   - Use in fullscreen mode
   - Avoid switching to other tabs during sessions

3. **Check Power Settings**
   - Prevent computer from sleeping
   - Disable aggressive power saving modes

### Timer Inaccurate/Skipping Time

**Symptoms**: Timer jumps forward/backward, loses seconds
**Causes**: System clock changes, high CPU usage, browser throttling

**Solutions**:
1. **Verify System Clock**
   - Ensure system time is accurate
   - Sync with internet time if needed

2. **Reduce System Load**
   - Close unnecessary applications
   - Free up RAM and CPU resources
   - Close other browser tabs

3. **Use High Precision Mode**
   ```javascript
   // In browser console
   TimerEngine.setPrecisionMode('high');
   ```

4. **Check Timing Method**
   - Settings → Advanced → Timing Method
   - Try different options: RAF, Worker, Hybrid

### Phase Transitions Not Working

**Symptoms**: Timer reaches zero but doesn't switch to break/focus
**Causes**: Event system issues, corrupted phase logic

**Solutions**:
1. **Manually Trigger Transition**
   - Press `S` key to skip to next phase
   - Check if auto-transitions are enabled

2. **Reset Phase Logic**
   ```javascript
   // In browser console
   TimerEngine.resetPhases();
   ```

3. **Check Auto-Start Settings**
   - Settings → Timer → Auto-start breaks/focus
   - Enable if you want automatic transitions

## Audio Problems

### No Sound on Timer Complete

**Symptoms**: Timer completes but no notification sound plays
**Causes**: Autoplay restrictions, audio permissions, volume settings

**Solutions**:
1. **Enable Autoplay**
   - Chrome: Site Settings → Sound → Allow
   - Firefox: Address bar → Shield icon → Allow autoplay
   - Safari: Develop → Disable Autoplay Restrictions

2. **Check Volume Levels**
   - System volume not muted
   - Browser tab not muted
   - Timer audio volume in Settings

3. **Manual Audio Test**
   - Settings → Audio → Test Sound
   - If test works, autoplay is the issue

4. **User Interaction Required**
   ```javascript
   // Click play button first to enable audio context
   document.querySelector('.play-button').click();
   ```

### Audio Distorted or Crackling

**Symptoms**: Notification sounds are distorted, choppy, or unclear
**Causes**: Audio buffer issues, codec problems, system audio driver issues

**Solutions**:
1. **Try Different Audio Format**
   - Settings → Audio → Sound Type
   - Test different notification sounds

2. **Clear Audio Cache**
   ```javascript
   // In browser console
   AudioManager.clearCache();
   location.reload();
   ```

3. **Check System Audio**
   - Test audio in other applications
   - Update audio drivers if needed
   - Try different output device

### Audio Delay

**Symptoms**: Sound plays several seconds after timer completes
**Causes**: Audio buffer latency, system performance issues

**Solutions**:
1. **Reduce Audio Latency**
   - Settings → Audio → Low Latency Mode: ON
   - Preloads audio for immediate playback

2. **Use Web Audio API**
   - Settings → Advanced → Audio Engine: Web Audio
   - More precise timing than HTML5 audio

## Visual & Display Issues

### Visual Mode Not Changing

**Symptoms**: Pressing 1-4 keys or changing in settings has no effect
**Causes**: Rendering engine errors, Canvas API issues

**Solutions**:
1. **Check Canvas Support**
   ```javascript
   // In browser console
   const canvas = document.createElement('canvas');
   console.log('Canvas supported:', !!canvas.getContext);
   ```

2. **Force Renderer Reset**
   ```javascript
   // In browser console
   VisualRenderer.reset();
   VisualRenderer.setMode('progress');
   ```

3. **Try DOM Fallback**
   - Settings → Visual → Fallback Mode: DOM
   - Uses HTML/CSS instead of Canvas

### Animations Choppy or Slow

**Symptoms**: Jerky animations, low frame rate, visual lag
**Causes**: GPU acceleration disabled, system performance, complex visuals

**Solutions**:
1. **Enable Hardware Acceleration**
   - Chrome: Settings → Advanced → System → Use hardware acceleration
   - Firefox: about:config → layers.acceleration.force-enabled

2. **Reduce Animation Complexity**
   - Switch to Minimal visual mode
   - Settings → Visual → Animation Speed: Slow or Off
   - Disable particle effects

3. **Check GPU Performance**
   - Chrome: chrome://gpu/
   - Look for "Graphics Feature Status"
   - Ensure WebGL is available

### Fullscreen Issues

**Symptoms**: Fullscreen button doesn't work, exits immediately
**Causes**: Browser security restrictions, conflicting extensions

**Solutions**:
1. **User Gesture Required**
   - Must click fullscreen button directly
   - Cannot be triggered programmatically without user action

2. **Check Browser Permissions**
   - Allow fullscreen permissions for the site
   - Disable conflicting extensions temporarily

3. **Try Alternative Method**
   ```javascript
   // Manual fullscreen request
   document.documentElement.requestFullscreen();
   ```

### Theme Not Applying

**Symptoms**: Theme selection changes but colors/appearance stays same
**Causes**: CSS custom property support, theme loading errors

**Solutions**:
1. **Check CSS Variables Support**
   ```javascript
   // In browser console
   console.log('CSS variables supported:', 
     window.CSS && CSS.supports('color', 'var(--test)'));
   ```

2. **Force Theme Reload**
   ```javascript
   // In browser console
   ThemeProvider.reloadTheme();
   ```

3. **Use Fallback Theming**
   - Settings → Advanced → Theme Engine: Classic CSS
   - Uses class-based theming instead of CSS variables

## Settings & Storage Issues

### Settings Not Saving

**Symptoms**: Changes in settings panel don't persist after reload
**Causes**: Local Storage disabled, private browsing, storage quota exceeded

**Solutions**:
1. **Check Local Storage**
   ```javascript
   // In browser console
   try {
     localStorage.setItem('test', 'test');
     localStorage.removeItem('test');
     console.log('Local Storage: Available');
   } catch (e) {
     console.log('Local Storage: Blocked', e.message);
   }
   ```

2. **Clear Storage Space**
   - Browser Settings → Privacy → Clear browsing data
   - Select "Cookies and site data" and "Cached files"

3. **Exit Private Browsing**
   - Settings may not persist in incognito/private mode
   - Use regular browser window

4. **Check Storage Quota**
   ```javascript
   // Check available storage
   navigator.storage.estimate().then(estimate => {
     console.log('Storage used:', estimate.usage);
     console.log('Storage quota:', estimate.quota);
   });
   ```

### Settings Reset Automatically

**Symptoms**: Customized settings revert to defaults randomly
**Causes**: Browser clearing data, extension interference, corrupted storage

**Solutions**:
1. **Export Settings Backup**
   - Settings → Advanced → Export Settings
   - Save JSON file as backup

2. **Disable Automatic Cleanup**
   - Browser Settings → Privacy → Automatic cleanup: OFF
   - Whitelist the timer site

3. **Check Extension Conflicts**
   - Disable privacy/security extensions temporarily
   - Common culprits: ad blockers, privacy tools

### Import/Export Not Working

**Symptoms**: Can't export settings or import fails with error
**Causes**: JSON format errors, browser file restrictions

**Solutions**:
1. **Validate JSON Format**
   ```javascript
   // Test JSON validity
   try {
     JSON.parse(settingsString);
     console.log('Valid JSON');
   } catch (e) {
     console.log('Invalid JSON:', e.message);
   }
   ```

2. **Check File Permissions**
   - Browser must allow file downloads/uploads
   - Try different file location

3. **Manual Settings Transfer**
   ```javascript
   // Export manually
   const settings = JSON.stringify(localStorage);
   console.log(settings); // Copy this
   
   // Import manually
   const importedSettings = '...'; // Paste here
   Object.entries(JSON.parse(importedSettings))
     .forEach(([key, value]) => localStorage.setItem(key, value));
   ```

## Performance Problems

### High CPU Usage

**Symptoms**: Fan spinning, system slow, browser tab using excessive CPU
**Causes**: Animation loops, timer precision, background processes

**Solutions**:
1. **Reduce Animation Load**
   - Switch to Minimal visual mode
   - Settings → Visual → Animation Speed: Off
   - Disable particle effects and complex visuals

2. **Lower Timer Precision**
   - Settings → Advanced → Update Frequency: 1000ms
   - Reduces CPU usage but may affect accuracy

3. **Use Efficient Rendering**
   - Settings → Visual → Renderer: DOM (instead of Canvas)
   - Less GPU intensive but fewer visual options

### High Memory Usage

**Symptoms**: Browser using excessive RAM, system becoming sluggish
**Causes**: Memory leaks, large animation buffers, accumulated data

**Solutions**:
1. **Restart Timer Regularly**
   - Close and reopen timer tab daily
   - Prevents memory accumulation

2. **Clear Session Data**
   ```javascript
   // In browser console
   SessionStorage.clear();
   location.reload();
   ```

3. **Monitor Memory Usage**
   ```javascript
   // Check memory usage
   if (performance.memory) {
     console.log('Used:', performance.memory.usedJSHeapSize);
     console.log('Total:', performance.memory.totalJSHeapSize);
     console.log('Limit:', performance.memory.jsHeapSizeLimit);
   }
   ```

### Slow Page Load

**Symptoms**: Timer takes long time to initialize, white screen
**Causes**: Network issues, resource loading problems, script errors

**Solutions**:
1. **Check Network Connection**
   - F12 → Network tab → Reload
   - Look for failed resource loads (red entries)

2. **Disable Extensions**
   - Ad blockers may interfere with resource loading
   - Try incognito mode to test

3. **Clear Browser Cache**
   - Hard refresh: `Ctrl+Shift+R`
   - Clear all cached files

## Browser-Specific Issues

### Chrome Issues

**Common Problems**:
- Autoplay blocked by default
- Aggressive tab throttling
- Memory management

**Solutions**:
```javascript
// Enable autoplay for site
// chrome://settings/content/sound → Allow (add site)

// Reduce throttling
// Settings → Advanced → System → Continue running apps
```

### Firefox Issues

**Common Problems**:
- CSS custom property support varies
- Different fullscreen behavior
- Audio context restrictions

**Solutions**:
```javascript
// Enable CSS support
// about:config → layout.css.properties-and-values.enabled → true

// Audio context
// about:config → media.autoplay.default → 0 (allow)
```

### Safari Issues

**Common Problems**:
- Webkit-specific CSS issues
- Stricter autoplay policies
- Different timing behavior

**Solutions**:
```css
/* Safari-specific fixes */
@supports (-webkit-appearance: none) {
  .timer-display {
    -webkit-transform: translateZ(0);
  }
}
```

### Edge Issues

**Common Problems**:
- Legacy Edge compatibility
- Different JavaScript engine behavior

**Solutions**:
- Ensure using Chromium-based Edge (version 79+)
- Legacy Edge (18 and below) not supported

## Accessibility Issues

### Screen Reader Problems

**Symptoms**: Screen reader doesn't announce timer changes
**Causes**: Missing ARIA labels, dynamic content not announced

**Solutions**:
1. **Enable Screen Reader Mode**
   - Settings → Accessibility → Screen Reader: ON
   - Adds additional ARIA announcements

2. **Check ARIA Labels**
   ```javascript
   // Verify ARIA attributes
   console.log(document.querySelector('.timer-display')
     .getAttribute('aria-label'));
   ```

3. **Manual Announcements**
   - Use `Ctrl+Shift+A` for status announcement
   - Settings → Accessibility → Audio Descriptions: ON

### Keyboard Navigation Issues

**Symptoms**: Can't navigate with Tab key, shortcuts don't work
**Causes**: Focus management issues, conflicting shortcuts

**Solutions**:
1. **Reset Focus**
   ```javascript
   // Restore focus to timer
   document.querySelector('.timer-container').focus();
   ```

2. **Check Tab Order**
   - Verify all interactive elements are focusable
   - Look for `tabindex` conflicts

3. **Enable Focus Indicators**
   - Settings → Accessibility → Focus Indicators: Visible
   - Shows clear focus outline

### High Contrast Issues

**Symptoms**: Poor visibility with high contrast settings
**Causes**: Theme colors don't meet accessibility standards

**Solutions**:
1. **Use High Contrast Theme**
   - Settings → Themes → High Contrast
   - Meets WCAG AAA standards

2. **Enable System Integration**
   - Settings → Accessibility → Respect System Preferences: ON
   - Follows OS accessibility settings

## Advanced Diagnostics

### Enable Debug Mode

```javascript
// In browser console
window.DEBUG = true;
localStorage.setItem('debug-mode', 'true');
location.reload();
```

**Debug mode provides**:
- Detailed console logging
- Performance metrics
- Component state inspection
- Event tracking

### Performance Profiling

```javascript
// Profile timer performance
performance.mark('timer-start');
TimerEngine.start();
setTimeout(() => {
  performance.mark('timer-end');
  performance.measure('timer-performance', 'timer-start', 'timer-end');
  console.log(performance.getEntriesByType('measure'));
}, 5000);
```

### Memory Leak Detection

```javascript
// Monitor memory usage over time
const memoryCheck = setInterval(() => {
  if (performance.memory) {
    console.log('Memory:', {
      used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
    });
  }
}, 10000);

// Stop monitoring after 5 minutes
setTimeout(() => clearInterval(memoryCheck), 300000);
```

### Component State Inspection

```javascript
// Check component states
console.log('Timer State:', TimerEngine.getState());
console.log('Theme State:', ThemeProvider.getCurrentTheme());
console.log('Renderer State:', VisualRenderer.getState());
console.log('Settings State:', SettingsManager.getAllSettings());
```

## Getting Further Help

### Before Asking for Help

**Gather this information**:
1. **Browser & Version**: Chrome 96, Firefox 95, etc.
2. **Operating System**: Windows 10, macOS 12, Ubuntu 20.04
3. **Timer Version**: Found in Settings → About
4. **Console Errors**: F12 → Console → Copy error messages
5. **Steps to Reproduce**: Exact sequence that causes issue
6. **Expected vs Actual**: What should happen vs what happens

### Where to Get Help

**GitHub Issues**
- Bug reports: https://github.com/yourusername/productivity-timer/issues
- Include all diagnostic information above
- Search existing issues first

**Community Discussions**
- General questions: GitHub Discussions
- Usage tips and tricks
- Feature suggestions

**Stack Overflow**
- Tag: `pomodoro-timer`
- Technical programming questions
- Integration help

### Emergency Workarounds

**Complete Reset**
```javascript
// Nuclear option - clears everything
localStorage.clear();
sessionStorage.clear();
window.location.href = window.location.href.split('?')[0];
```

**Offline Backup**
```javascript
// Save current state before reset
const backup = {
  localStorage: {...localStorage},
  settings: SettingsManager.getAllSettings(),
  session: SessionManager.getCurrentSession()
};
console.log('Backup:', JSON.stringify(backup));
```

---

**Still having issues?** Don't hesitate to [open an issue](https://github.com/yourusername/productivity-timer/issues) with detailed information. The more details you provide, the faster we can help resolve the problem.

**Remember**: Most issues can be resolved with a simple browser refresh or clearing cache. When in doubt, start with the quick diagnostics at the top of this guide! 🍅🔧