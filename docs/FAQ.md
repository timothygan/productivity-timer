# Frequently Asked Questions

Quick answers to common questions about the Aesthetic Pomodoro Timer.

## General Usage

**Q: How does the Pomodoro Technique work?**
A: The Pomodoro Technique involves 25-minute focused work sessions followed by 5-minute breaks. After 4 sessions, take a longer 15-20 minute break. This timer automates the process and provides beautiful visual feedback.

**Q: Can I customize the timer durations?**
A: Yes! Open Settings (gear icon) and adjust Focus Time, Short Break, and Long Break durations. You can set anywhere from 1 second to 24 hours for maximum flexibility.

**Q: Does the timer work when I switch browser tabs?**
A: Yes, the timer continues running in the background using the Page Visibility API and Web Workers for precise timing even when the tab isn't active.

## Visual Modes

**Q: What are the different visual modes?**
A: There are four modes:
- **Progress**: Classic circular progress indicator
- **Shapes**: Dynamic geometric animations  
- **Minimal**: Clean, distraction-free display
- **Creative**: Artistic effects and particles

**Q: How do I switch visual modes?**
A: Use keyboard numbers 1-4, or open Settings and select Visual Mode. Changes apply immediately.

## Themes

**Q: How many themes are available?**
A: Six built-in themes: Light, Dark, Ocean, Forest, Sunset, and Purple. You can also create custom themes.

**Q: Can I create my own theme?**
A: Absolutely! See the [Theme Customization Guide](./THEME_CUSTOMIZATION.md) for detailed instructions on creating and sharing custom themes.

**Q: Why don't my theme changes save?**
A: Ensure Local Storage is enabled in your browser. Private/incognito mode may prevent saving preferences.

## Keyboard Shortcuts

**Q: What's the fastest way to control the timer?**
A: Essential shortcuts:
- `Space`: Start/Pause
- `R`: Reset
- `S`: Skip phase
- `F11`: Fullscreen

See the complete [Keyboard Shortcuts Guide](./KEYBOARD_SHORTCUTS.md).

## Audio & Notifications

**Q: Why aren't audio notifications playing?**
A: Modern browsers require user interaction before playing audio. Click the play button once to enable audio, then notifications will work automatically.

**Q: Can I use custom notification sounds?**
A: Currently, you can choose from built-in sounds (Bell, Chime, Beep, Nature). Custom sound upload is planned for a future release.

## Technical Issues

**Q: The timer isn't accurate / skips time**
A: This usually happens when:
- Browser tab is throttled (use background timing setting)
- System is under heavy load
- Browser extensions interfere with timing
Try enabling "Background Timing" in Settings.

**Q: Fullscreen mode isn't working**
A: Fullscreen requires user interaction due to browser security. Click the fullscreen button directly rather than using keyboard shortcuts initially.

**Q: Settings aren't saving**
A: Check if:
- Local Storage is enabled
- You're not in private/incognito mode
- Browser data hasn't been cleared
- Ad blockers aren't interfering

## Performance

**Q: The timer is using too much CPU/memory**
A: Try:
- Switch to Minimal visual mode
- Disable animations in Settings
- Close other browser tabs
- Restart browser if running for extended periods

**Q: Animations are choppy or slow**
A: Reduce animation speed in Settings or switch to a simpler visual mode. Older devices may perform better with Minimal mode.

## Browser Compatibility

**Q: Which browsers are supported?**
A: Modern versions of Chrome (88+), Firefox (85+), Safari (14+), and Edge (88+). Internet Explorer is not supported.

**Q: Some features don't work in my browser**
A: Older browsers may lack certain features:
- CSS custom properties (theming)
- Fullscreen API
- Page Visibility API
- Web Audio API
Check the browser compatibility section in our documentation.

## Data & Privacy

**Q: What data does the timer collect?**
A: None! The timer runs entirely in your browser, stores settings locally only, and never sends data to external servers.

**Q: Can I export my session data?**
A: Yes, use Ctrl/Cmd+E or Settings → Export Data to download your session history as CSV.

**Q: Will my data sync across devices?**
A: Currently, data is stored locally per browser. Cross-device sync is planned for a future release.

## Productivity Tips

**Q: What's the best way to use the timer?**
A: 
1. Choose a single task before starting
2. Eliminate distractions (notifications, phone)
3. Use fullscreen mode for deep focus
4. Don't skip breaks - they're essential
5. Track your completion rate to improve

**Q: Should I pause the timer for interruptions?**
A: Minor interruptions (< 30 seconds): Continue timer
Major interruptions (> 2 minutes): Reset and start fresh
The key is maintaining the rhythm of focused work periods.

**Q: How many pomodoros should I aim for daily?**
A: Start with 4-6 sessions and adjust based on your energy and task complexity. Quality matters more than quantity.

## Troubleshooting

**Q: The app won't load**
A: Try:
1. Hard refresh (Ctrl/Cmd+Shift+R)
2. Clear browser cache
3. Disable browser extensions temporarily
4. Check browser console for errors

**Q: Visual effects aren't working**
A: Your browser may not support required features:
- Try a different visual mode
- Update to latest browser version
- Check if hardware acceleration is enabled

**Q: Keyboard shortcuts don't work**
A: Ensure:
- Timer has focus (click on it first)
- No conflicting browser/system shortcuts
- Shortcuts are enabled in Settings
- Not in a text input field

## Getting Help

**Q: Where can I get more help?**
A: 
- Check our [User Guide](./USER_GUIDE.md) for detailed instructions
- Browse [GitHub Issues](https://github.com/yourusername/productivity-timer/issues) for known problems
- Open a new issue for bug reports or feature requests

**Q: How can I contribute?**
A: See our [Contributing Guide](./CONTRIBUTING.md) for ways to help:
- Report bugs and suggest features
- Create custom themes
- Improve documentation
- Submit code improvements

**Q: Is there a mobile app?**
A: Currently web-only, but the timer works well on mobile browsers. Native mobile apps are being considered for future development.

---

**Still have questions?** Open an issue on GitHub or start a discussion in our community forums. We're here to help make your productivity journey successful! 🍅