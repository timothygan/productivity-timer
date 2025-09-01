# Contributing to Aesthetic Pomodoro Timer

Thank you for your interest in contributing to the Aesthetic Pomodoro Timer! This guide will help you get started with contributing code, documentation, themes, or bug reports.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Contributing Guidelines](#contributing-guidelines)
5. [Pull Request Process](#pull-request-process)
6. [Coding Standards](#coding-standards)
7. [Testing Guidelines](#testing-guidelines)
8. [Documentation Guidelines](#documentation-guidelines)
9. [Theme Contributions](#theme-contributions)
10. [Bug Reports](#bug-reports)
11. [Feature Requests](#feature-requests)
12. [Community](#community)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) before contributing.

### Our Values

- **Inclusive**: We welcome contributors from all backgrounds
- **Respectful**: Treat all community members with respect
- **Collaborative**: Work together to build something amazing
- **Learning-Focused**: Help others learn and grow
- **Quality-Oriented**: Strive for excellence in all contributions

## Getting Started

### Ways to Contribute

- **Code**: Fix bugs, add features, improve performance
- **Documentation**: Write guides, improve existing docs
- **Themes**: Create beautiful custom themes
- **Testing**: Write tests, report bugs
- **Design**: UI/UX improvements, visual assets
- **Translation**: Help make the app accessible globally

### First-Time Contributors

Look for issues labeled with:
- `good first issue` - Perfect for newcomers
- `help wanted` - Community assistance needed
- `documentation` - Documentation improvements
- `theme` - Theme-related contributions

## Development Setup

### Prerequisites

- **Node.js 18+** and npm
- **Git** for version control
- **Modern browser** (Chrome, Firefox, Safari, or Edge)
- **Code editor** (VS Code recommended)

### Setup Process

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/your-username/productivity-timer.git
   cd productivity-timer
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Verify Setup**
   - Open http://localhost:3000
   - Timer should load and function correctly
   - No console errors

5. **Create Development Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run preview      # Preview production build
npm run test         # Run all tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking
```

### Project Structure

```
productivity-timer/
├── src/
│   ├── js/                 # JavaScript modules
│   │   ├── app.js         # Application entry point
│   │   ├── components/    # UI components
│   │   ├── services/      # Business logic services
│   │   ├── utils/         # Utility functions
│   │   └── types/         # TypeScript definitions
│   ├── css/               # Stylesheets
│   │   ├── main.css       # Main styles
│   │   ├── themes/        # Theme definitions
│   │   └── components/    # Component styles
│   └── assets/            # Static assets
├── docs/                  # Documentation
├── tests/                 # Test files
├── dist/                  # Built files (generated)
└── public/                # Public assets
```

## Contributing Guidelines

### Before You Start

1. **Check existing issues** to avoid duplicate work
2. **Discuss major changes** by opening an issue first
3. **Read the architecture docs** to understand the codebase
4. **Follow coding standards** outlined in this guide

### Types of Contributions

#### Bug Fixes
- **Small fixes**: Can go directly to PR
- **Major fixes**: Open issue first for discussion
- **Include tests** that verify the fix
- **Update documentation** if behavior changes

#### New Features
- **Open issue first** to discuss approach
- **Follow architecture patterns** established in codebase
- **Include comprehensive tests**
- **Update documentation** and user guides
- **Consider accessibility** and performance impact

#### Performance Improvements  
- **Measure before and after** with benchmarks
- **Document performance gains** in PR description
- **Ensure no functionality regression**
- **Consider different browser environments**

#### Documentation
- **Keep docs up-to-date** with code changes
- **Write clear, concise explanations**
- **Include code examples** where helpful
- **Test all instructions** before submitting

## Pull Request Process

### 1. Preparation

**Before Opening PR**
- [ ] Code follows project standards
- [ ] All tests pass locally
- [ ] Documentation updated if needed
- [ ] No merge conflicts with main branch
- [ ] PR addresses a specific issue or feature

**Branch Naming Convention**
```bash
feature/add-notification-sounds    # New features
fix/timer-precision-bug           # Bug fixes
docs/update-api-documentation     # Documentation
theme/dark-mode-improvements      # Theme work
perf/optimize-canvas-rendering    # Performance
```

### 2. Opening the Pull Request

**PR Title Format**
```
Type: Brief description of changes

Examples:
feat: Add audio notification system
fix: Resolve timer precision issues in background tabs
docs: Update keyboard shortcuts documentation
theme: Add high-contrast accessibility theme
perf: Optimize visual renderer performance
```

**PR Description Template**
```markdown
## Description
Brief summary of what this PR accomplishes.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that causes existing functionality to change)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Theme/visual enhancement

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing done (if applicable)

## Screenshots (if applicable)
Before/after screenshots for visual changes.

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Code is properly commented
- [ ] Documentation updated
- [ ] No new lint warnings or errors
- [ ] Tests added/updated for new functionality

## Related Issues
Closes #123
References #456
```

### 3. Review Process

**What to Expect**
- Initial review within 48 hours
- Constructive feedback and suggestions
- Possible requests for changes
- Multiple review rounds if needed

**Review Criteria**
- Code quality and maintainability
- Adherence to project standards
- Test coverage and quality
- Documentation completeness
- Performance impact
- Accessibility considerations

### 4. Merging

**Requirements for Merge**
- [ ] At least one approved review
- [ ] All CI checks passing
- [ ] No merge conflicts
- [ ] Documentation updated
- [ ] Tests passing

**Merge Process**
1. Maintainer reviews and approves
2. Automated tests run
3. Branch merged using squash and merge
4. Feature branch deleted
5. Contributors credited in release notes

## Coding Standards

### JavaScript/TypeScript Standards

**Code Style**
- Use **ES6+ features** (async/await, destructuring, modules)
- **2 spaces** for indentation
- **Semicolons required** at statement ends
- **Single quotes** for strings
- **Trailing commas** in multiline objects/arrays

**Naming Conventions**
```javascript
// Variables and functions: camelCase
const timerState = {};
function startTimer() {}

// Constants: SCREAMING_SNAKE_CASE
const DEFAULT_FOCUS_TIME = 25 * 60 * 1000;

// Classes: PascalCase
class TimerEngine {}

// CSS classes: kebab-case
.timer-display {}

// Files: kebab-case
timer-engine.js
visual-renderer.js
```

**Function Guidelines**
```javascript
// Good: Pure functions when possible
function formatTime(milliseconds) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Good: Clear parameter names and JSDoc
/**
 * Updates timer state with elapsed time
 * @param {number} timestamp - Current timestamp from RAF
 * @param {TimerState} state - Current timer state
 * @returns {TimerState} Updated state object
 */
function updateTimerState(timestamp, state) {
  // Implementation
}

// Avoid: Long functions (max ~20 lines)
// Avoid: Deep nesting (max 3 levels)
// Avoid: Side effects in pure functions
```

**Error Handling**
```javascript
// Good: Explicit error handling
async function loadSettings() {
  try {
    const settings = await storage.get('settings');
    return validateSettings(settings);
  } catch (error) {
    console.error('Failed to load settings:', error);
    return getDefaultSettings();
  }
}

// Good: Meaningful error messages
function setTheme(themeName) {
  if (!availableThemes.includes(themeName)) {
    throw new Error(`Theme '${themeName}' not found. Available themes: ${availableThemes.join(', ')}`);
  }
}
```

### CSS Standards

**CSS Architecture**
- Use **CSS custom properties** for theming
- Follow **BEM methodology** for class names
- **Mobile-first** responsive design
- **Progressive enhancement** approach

**CSS Organization**
```css
/* Good: Logical property grouping */
.timer-display {
  /* Positioning */
  position: relative;
  top: 0;
  
  /* Box model */
  display: flex;
  width: 300px;
  height: 300px;
  margin: 0 auto;
  padding: 1rem;
  
  /* Typography */
  font-family: var(--font-primary);
  font-size: var(--font-size-xl);
  text-align: center;
  
  /* Visual */
  background-color: var(--background-color);
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  
  /* Animation */
  transition: all 0.3s ease;
}

/* Good: BEM naming */
.timer-display__time {}
.timer-display__progress {}
.timer-display--paused {}
```

**Responsive Design**
```css
/* Mobile-first approach */
.timer-container {
  width: 100%;
  padding: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .timer-container {
    width: 600px;
    padding: 2rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .timer-container {
    width: 800px;
    padding: 3rem;
  }
}
```

## Testing Guidelines

### Test Structure

**File Organization**
```
tests/
├── unit/                 # Unit tests
│   ├── timer-engine.test.js
│   ├── theme-provider.test.js
│   └── utils.test.js
├── integration/          # Integration tests
│   ├── timer-ui.test.js
│   └── settings.test.js
├── e2e/                 # End-to-end tests
│   ├── basic-usage.test.js
│   └── fullscreen.test.js
└── fixtures/            # Test data and mocks
    ├── timer-states.js
    └── theme-configs.js
```

**Test Naming Convention**
```javascript
// Format: describe what it should do
describe('TimerEngine', () => {
  describe('start()', () => {
    it('should start the timer and emit start event', () => {
      // Test implementation
    });
    
    it('should not start if already running', () => {
      // Test implementation
    });
  });
});
```

### Unit Testing

**Required Test Coverage**
- All public methods
- Edge cases and error conditions
- Event emissions
- State transitions

**Example Unit Test**
```javascript
import { TimerEngine } from '../src/js/services/timer-engine.js';

describe('TimerEngine', () => {
  let timer;
  
  beforeEach(() => {
    timer = new TimerEngine({
      focusTime: 1500000, // 25 minutes
      shortBreak: 300000   // 5 minutes
    });
  });
  
  afterEach(() => {
    timer.destroy();
  });
  
  describe('getState()', () => {
    it('should return current timer state', () => {
      const state = timer.getState();
      
      expect(state).toHaveProperty('phase', 'focus');
      expect(state).toHaveProperty('isRunning', false);
      expect(state).toHaveProperty('remainingTime', 1500000);
      expect(state.progress).toBeCloseTo(0);
    });
  });
  
  describe('start()', () => {
    it('should start timer and emit start event', (done) => {
      timer.addEventListener('start', (event) => {
        expect(event.detail.phase).toBe('focus');
        expect(timer.isRunning()).toBe(true);
        done();
      });
      
      timer.start();
    });
    
    it('should not start if already running', () => {
      timer.start();
      const startTime = timer.getState().startTime;
      
      timer.start(); // Second start call
      
      expect(timer.getState().startTime).toBe(startTime);
    });
  });
});
```

### Integration Testing

**Test Component Interactions**
```javascript
import { App } from '../src/js/app.js';

describe('App Integration', () => {
  let app;
  let container;
  
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    app = new App(container);
  });
  
  afterEach(() => {
    app.destroy();
    document.body.removeChild(container);
  });
  
  it('should update UI when timer ticks', async () => {
    await app.initialize();
    
    const timeDisplay = container.querySelector('.time-display');
    const initialText = timeDisplay.textContent;
    
    app.timer.start();
    
    // Wait for timer tick
    await new Promise(resolve => {
      app.timer.addEventListener('tick', resolve, { once: true });
    });
    
    expect(timeDisplay.textContent).not.toBe(initialText);
  });
});
```

### End-to-End Testing

**User Journey Testing**
```javascript
// Using Playwright or similar E2E framework
import { test, expect } from '@playwright/test';

test('user can complete a pomodoro cycle', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Start timer
  await page.click('[data-testid="start-button"]');
  
  // Verify timer is running
  await expect(page.locator('[data-testid="timer-status"]')).toHaveText('Running');
  
  // Skip to break phase
  await page.keyboard.press('s');
  
  // Verify phase change
  await expect(page.locator('[data-testid="current-phase"]')).toHaveText('Break');
  
  // Check that break timer started automatically
  const timeRemaining = await page.locator('[data-testid="time-remaining"]').textContent();
  expect(timeRemaining).not.toBe('5:00');
});
```

## Documentation Guidelines

### Documentation Types

**API Documentation**
- JSDoc comments for all public methods
- Type definitions for parameters and returns
- Usage examples
- Error conditions

**User Documentation**
- Step-by-step guides
- Screenshots for visual features
- Troubleshooting sections
- FAQ updates

**Developer Documentation**
- Architecture decisions
- Code organization
- Development workflows
- Deployment procedures

### Writing Style

**Technical Writing Guidelines**
- **Clear and concise**: Get to the point quickly
- **Active voice**: "Click the button" not "The button should be clicked"
- **Present tense**: "The timer starts" not "The timer will start"
- **Code examples**: Always provide working examples
- **Consistent terminology**: Use same terms throughout

**Documentation Format**
```markdown
# Clear, Descriptive Heading

Brief introduction paragraph explaining what this document covers.

## Section Heading

### Subsection with Code Example

Description of what the code does:

```javascript
// Well-commented code example
const timer = new TimerEngine({
  focusTime: 25 * 60 * 1000  // 25 minutes in milliseconds
});

timer.start(); // Start the focus session
```

**Important notes** are highlighted like this.

> **Tip**: Helpful tips are formatted as blockquotes.
```

### JSDoc Standards

```javascript
/**
 * Starts the timer for the current phase
 * 
 * @description Begins counting down from the current phase duration.
 * Emits 'start' event when successfully started. Will not start if
 * timer is already running.
 * 
 * @example
 * const timer = new TimerEngine();
 * timer.start(); // Starts 25-minute focus session
 * 
 * @fires TimerEngine#start
 * @throws {Error} When timer is in invalid state
 * @since 1.0.0
 */
start() {
  // Implementation
}

/**
 * Timer start event
 * @event TimerEngine#start
 * @type {object}
 * @property {string} phase - Current timer phase
 * @property {number} totalTime - Total time for this phase
 * @property {number} timestamp - When timer started
 */
```

## Theme Contributions

### Creating Themes

**Theme Structure**
```javascript
const myTheme = {
  name: 'My Beautiful Theme',
  version: '1.0.0',
  author: 'Your Name',
  description: 'A theme inspired by...',
  
  colors: {
    primary: '#3498db',      // Main accent color
    secondary: '#2ecc71',    // Secondary accent  
    background: '#ffffff',   // Main background
    surface: '#f8f9fa',     // Secondary surfaces
    text: '#2c3e50',        // Primary text
    textSecondary: '#7f8c8d', // Secondary text
    border: '#bdc3c7',      // Borders and dividers
    
    // Phase-specific colors (optional)
    focus: '#e74c3c',       // Focus phase
    shortBreak: '#f39c12',  // Short break
    longBreak: '#9b59b6'    // Long break
  },
  
  typography: {
    fontFamily: '"Inter", sans-serif',
    fontFamilyDisplay: '"Playfair Display", serif',
    fontFamilyMono: '"JetBrains Mono", monospace'
  },
  
  spacing: {
    unit: '1rem',           // Base spacing unit
    scale: 1.2              // Spacing scale ratio
  },
  
  borders: {
    width: '1px',
    radius: '8px',
    radiusLarge: '12px'
  },
  
  shadows: {
    small: '0 2px 4px rgba(0,0,0,0.1)',
    medium: '0 4px 8px rgba(0,0,0,0.15)',
    large: '0 8px 16px rgba(0,0,0,0.2)'
  },
  
  animations: {
    duration: '300ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
};
```

**Theme Guidelines**
- **Accessibility first**: Ensure proper contrast ratios
- **Consistent palette**: Use cohesive color relationships  
- **Test across modes**: Verify in all visual modes
- **Document inspiration**: Credit sources and inspirations
- **Provide variations**: Consider light/dark variants

**Theme Submission Process**
1. Create theme following structure above
2. Test in all visual modes and screen sizes
3. Verify accessibility with contrast checkers
4. Add theme to `src/css/themes/` directory
5. Register theme in `src/js/services/theme-provider.js`
6. Add preview image to `docs/themes/`
7. Update theme documentation
8. Submit pull request with screenshots

## Bug Reports

### Before Reporting Bugs

1. **Search existing issues** to avoid duplicates
2. **Try latest version** to see if bug is already fixed
3. **Test in different browsers** to isolate the issue
4. **Clear browser data** to rule out storage issues

### Bug Report Template

```markdown
**Bug Description**
A clear description of what the bug is.

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Enter '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**  
What actually happened.

**Screenshots**
If applicable, add screenshots to help explain.

**Environment**
- OS: [e.g. macOS 12.0]
- Browser: [e.g. Chrome 96]
- Timer Version: [e.g. 1.0.0]
- Screen Resolution: [e.g. 1920x1080]

**Additional Context**
- Console errors (if any)
- Network requests (if relevant)
- Extension conflicts (if suspected)
- Reproducibility: Always / Sometimes / Rare

**Severity**
- [ ] Critical (app unusable)
- [ ] High (major feature broken)
- [ ] Medium (feature partially works)
- [ ] Low (minor issue)
```

### Good Bug Report Example

```markdown
**Bug Description**
Timer continues running in background when browser tab becomes inactive, but UI shows timer as paused.

**Steps to Reproduce**
1. Start a 25-minute focus timer
2. Switch to different browser tab
3. Wait 30 seconds
4. Switch back to timer tab
5. Notice time has progressed but UI shows "paused" state

**Expected Behavior**
Timer should either:
- Continue running and show correct remaining time
- Actually pause when tab becomes inactive

**Actual Behavior**
Timer continues internally but UI becomes desynchronized.

**Environment**
- OS: macOS 12.0
- Browser: Chrome 96.0.4664.110
- Timer Version: 1.0.0

**Console Errors**
```
Warning: Page Visibility API detected tab inactive, but timer continues
```

**Additional Context**
This happens consistently in Chrome but not in Firefox. Seems related to tab throttling behavior.

**Severity**
- [x] High (major feature broken)
```

## Feature Requests

### Before Requesting Features

1. **Check roadmap** to see if feature is planned
2. **Search existing requests** for similar features
3. **Consider alternatives** that might achieve same goal
4. **Think about implementation** complexity and scope

### Feature Request Template

```markdown
**Feature Summary**
Brief description of the requested feature.

**Problem Statement**
What problem does this feature solve? What user need does it address?

**Proposed Solution**
Detailed description of how the feature should work.

**User Stories**
- As a [user type], I want [goal] so that [benefit]
- As a [user type], I want [goal] so that [benefit]

**Acceptance Criteria**
- [ ] Feature does X when Y
- [ ] Feature handles edge case Z
- [ ] Feature integrates with existing A and B

**Design Considerations**
- UI/UX mockups or descriptions
- Integration points with existing features
- Performance implications
- Accessibility requirements

**Alternatives Considered**
Other approaches that were considered and why this approach is preferred.

**Additional Context**
- Screenshots, mockups, or examples from other apps
- User research or feedback supporting the request
- Technical considerations or constraints

**Priority**
- [ ] Must have (core functionality)
- [ ] Should have (important for user experience)
- [ ] Could have (nice to have)
- [ ] Won't have (this release)
```

## Community

### Communication Channels

**GitHub Discussions**
- General questions and help
- Feature brainstorming
- Show and tell (themes, extensions)
- Community polls and decisions

**GitHub Issues**
- Bug reports
- Feature requests
- Documentation improvements
- Technical discussions

### Getting Help

**Development Questions**
1. Check documentation first
2. Search existing issues and discussions
3. Ask in GitHub Discussions
4. Tag relevant maintainers if urgent

**Review Process Questions**
- Reviews typically within 48 hours
- Be patient and respectful
- Address feedback constructively
- Ask for clarification if needed

### Recognition

**Contributors Wall**
All contributors are recognized in:
- README.md contributors section
- Release notes and changelog
- Special recognition for significant contributions

**Contribution Types Recognized**
- Code contributions (features, fixes)
- Documentation improvements
- Theme creations
- Bug reports and testing
- Community support and mentoring
- Design and UX contributions

### Maintainer Guidelines

**For Project Maintainers**

**Review Responsibilities**
- Respond to PRs within 48 hours
- Provide constructive, actionable feedback
- Test changes locally when needed
- Ensure code quality standards
- Maintain project vision and consistency

**Community Building**
- Welcome new contributors warmly
- Provide learning opportunities
- Recognize contributions publicly
- Foster inclusive environment
- Help resolve conflicts respectfully

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (1.1.0): New features, backward compatible
- **PATCH** (1.0.1): Bug fixes, backward compatible

### Release Checklist

**Pre-Release**
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version numbers bumped
- [ ] Security review completed
- [ ] Performance benchmarks run

**Release**
- [ ] Git tag created
- [ ] Release notes published
- [ ] NPM package published (if applicable)
- [ ] GitHub release created
- [ ] Documentation site updated

**Post-Release**
- [ ] Monitor for issues
- [ ] Community notifications sent
- [ ] Social media updates
- [ ] Contributor recognition

---

## Quick Reference

### Common Commands
```bash
# Development
npm run dev              # Start development server
npm test                 # Run tests
npm run lint            # Check code style

# Git workflow
git checkout -b feature/my-feature
git add .
git commit -m "feat: add my feature"
git push origin feature/my-feature

# Before submitting PR
npm run test            # Ensure tests pass
npm run lint            # Fix any linting issues
npm run build           # Verify build works
```

### Useful Links
- [Project Architecture](./ARCHITECTURE.md)
- [API Documentation](./API.md)
- [Theme Guide](./THEME_CUSTOMIZATION.md)
- [User Guide](./USER_GUIDE.md)
- [Keyboard Shortcuts](./KEYBOARD_SHORTCUTS.md)

---

**Thank you for contributing to the Aesthetic Pomodoro Timer!** 

Your contributions help make this tool better for productivity enthusiasts everywhere. Whether you're fixing a typo, adding a feature, or creating a beautiful new theme, every contribution matters.

**Happy coding! 🍅✨**