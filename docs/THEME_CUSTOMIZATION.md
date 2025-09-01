# Theme Customization Guide

Create stunning custom themes for the Aesthetic Pomodoro Timer. This comprehensive guide covers everything from simple color tweaks to advanced theme development.

## Table of Contents

1. [Theme System Overview](#theme-system-overview)
2. [Quick Theme Customization](#quick-theme-customization)
3. [CSS Custom Properties](#css-custom-properties)
4. [Creating Custom Themes](#creating-custom-themes)
5. [Theme Architecture](#theme-architecture)
6. [Advanced Theming](#advanced-theming)
7. [Theme Sharing](#theme-sharing)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)
10. [Theme Gallery](#theme-gallery)

## Theme System Overview

The Aesthetic Pomodoro Timer uses a modern CSS Custom Properties (CSS Variables) system for theming, allowing dynamic theme switching and easy customization.

### How Themes Work

**CSS Custom Properties**
- All colors, fonts, and spacing defined as CSS variables
- Runtime switching without page reload
- Inheritance and cascading support
- Browser-native performance

**Theme Structure**
```css
:root {
  /* Color Palette */
  --primary-color: #ff6b6b;
  --secondary-color: #4ecdc4;
  --background-color: #ffffff;
  --text-color: #333333;
  --accent-color: #ffe066;
  
  /* Typography */
  --font-primary: 'Inter', sans-serif;
  --font-display: 'Playfair Display', serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Spacing and Layout */
  --spacing-unit: 1rem;
  --border-radius: 12px;
  --animation-duration: 300ms;
}
```

### Built-in Themes Reference

**Light Theme** (Default)
- Primary: Tomato red (#ff6347)
- Secondary: Ocean blue (#20b2aa) 
- Background: Pure white (#ffffff)
- Text: Dark gray (#2c3e50)

**Dark Theme**
- Primary: Soft red (#e74c3c)
- Secondary: Teal (#1abc9c)
- Background: Dark slate (#2c3e50)
- Text: Light gray (#ecf0f1)

**Ocean Theme**
- Primary: Deep blue (#3498db)
- Secondary: Aqua (#16a085)
- Background: Light blue (#eaf4f7)
- Text: Navy (#34495e)

**Forest Theme**
- Primary: Forest green (#27ae60)
- Secondary: Lime (#2ecc71)
- Background: Light mint (#e8f5e8)
- Text: Dark green (#1e5e3e)

**Sunset Theme**
- Primary: Orange (#f39c12)
- Secondary: Pink (#e91e63)
- Background: Light peach (#fdf2e8)
- Text: Brown (#795548)

**Purple Theme**
- Primary: Deep purple (#9b59b6)
- Secondary: Violet (#8e44ad)
- Background: Light lavender (#f8f4ff)
- Text: Dark purple (#512e5f)

## Quick Theme Customization

### Using the Settings Panel

1. **Open Settings**: Click gear icon or `Ctrl/Cmd + ,`
2. **Navigate to Themes**: Click "Themes" tab
3. **Choose Base Theme**: Select closest to your vision
4. **Customize Colors**: Click color swatches to modify
5. **Preview Changes**: See updates in real-time
6. **Save Custom Theme**: Give it a name and save

### Browser Developer Tools Method

**Quick Color Changes**
1. Open Developer Tools (`F12`)
2. Navigate to Elements tab
3. Find `:root` styles
4. Modify CSS custom properties
5. See changes immediately
6. Copy modified CSS for permanent use

**Example Quick Modification**
```css
/* Change primary color to green */
:root {
  --primary-color: #2ecc71;
}

/* Change background to dark */
:root {
  --background-color: #1a1a1a;
  --text-color: #ffffff;
}
```

## CSS Custom Properties

### Core Color Variables

**Primary Color System**
```css
:root {
  --primary-color: #ff6b6b;      /* Main accent color */
  --primary-light: #ff8787;      /* Lighter variant */
  --primary-dark: #e55555;       /* Darker variant */
  --primary-alpha: #ff6b6b20;    /* Transparent variant */
}
```

**Background System**
```css
:root {
  --background-color: #ffffff;    /* Main background */
  --background-secondary: #f8f9fa; /* Secondary areas */
  --background-tertiary: #e9ecef;  /* Tertiary areas */
  --background-overlay: #00000080; /* Modal overlays */
}
```

**Text Color System**
```css
:root {
  --text-color: #212529;         /* Primary text */
  --text-secondary: #6c757d;     /* Secondary text */
  --text-muted: #adb5bd;         /* Muted text */
  --text-inverse: #ffffff;       /* Inverse text */
}
```

### Typography Variables

**Font Families**
```css
:root {
  --font-primary: 'Inter', system-ui, sans-serif;
  --font-display: 'Playfair Display', Georgia, serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --font-ui: system-ui, -apple-system, sans-serif;
}
```

**Font Sizes**
```css
:root {
  --font-size-xs: 0.75rem;       /* 12px */
  --font-size-sm: 0.875rem;      /* 14px */
  --font-size-base: 1rem;        /* 16px */
  --font-size-lg: 1.125rem;      /* 18px */
  --font-size-xl: 1.25rem;       /* 20px */
  --font-size-2xl: 1.5rem;       /* 24px */
  --font-size-3xl: 1.875rem;     /* 30px */
  --font-size-4xl: 2.25rem;      /* 36px */
  --font-size-5xl: 3rem;         /* 48px */
  --font-size-timer: 4rem;       /* 64px - Main timer display */
}
```

### Layout and Spacing

**Spacing Scale**
```css
:root {
  --spacing-xs: 0.25rem;         /* 4px */
  --spacing-sm: 0.5rem;          /* 8px */
  --spacing-md: 1rem;            /* 16px */
  --spacing-lg: 1.5rem;          /* 24px */
  --spacing-xl: 2rem;            /* 32px */
  --spacing-2xl: 3rem;           /* 48px */
  --spacing-3xl: 4rem;           /* 64px */
}
```

**Border and Radius**
```css
:root {
  --border-width: 1px;
  --border-color: #dee2e6;
  --border-radius-sm: 4px;
  --border-radius: 8px;
  --border-radius-lg: 12px;
  --border-radius-xl: 16px;
  --border-radius-full: 9999px;
}
```

### Animation Variables

**Timing and Easing**
```css
:root {
  --animation-duration-fast: 150ms;
  --animation-duration: 300ms;
  --animation-duration-slow: 500ms;
  --animation-easing: cubic-bezier(0.4, 0, 0.2, 1);
  --animation-easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

## Creating Custom Themes

### Method 1: CSS File Creation

**Create Custom Theme File**
```css
/* themes/custom-neon.css */
:root[data-theme="neon"] {
  /* Neon Theme Colors */
  --primary-color: #ff1493;       /* Hot pink */
  --primary-light: #ff69b4;      /* Light pink */
  --primary-dark: #dc143c;       /* Crimson */
  
  --secondary-color: #00ffff;     /* Cyan */
  --secondary-light: #40e0d0;    /* Turquoise */
  --secondary-dark: #008b8b;     /* Dark cyan */
  
  --background-color: #0a0a0a;   /* Near black */
  --background-secondary: #1a1a1a; /* Dark gray */
  --background-tertiary: #2a2a2a;  /* Medium gray */
  
  --text-color: #ffffff;         /* White */
  --text-secondary: #cccccc;     /* Light gray */
  --text-muted: #888888;         /* Medium gray */
  
  --accent-color: #ffff00;       /* Bright yellow */
  
  /* Neon-specific properties */
  --neon-glow: 0 0 10px currentColor;
  --text-shadow: 0 0 5px currentColor;
}

/* Neon-specific styles */
[data-theme="neon"] .timer-display {
  text-shadow: var(--text-shadow);
  box-shadow: var(--neon-glow);
}

[data-theme="neon"] .progress-ring {
  filter: drop-shadow(0 0 8px var(--primary-color));
}
```

### Method 2: JavaScript Theme Registration

**Register Theme Programmatically**
```javascript
// Register custom theme
ThemeProvider.registerTheme('midnight-blue', {
  name: 'Midnight Blue',
  colors: {
    primary: '#191970',      // Midnight blue
    secondary: '#4682b4',    // Steel blue
    background: '#000080',   // Navy
    text: '#f0f8ff',        // Alice blue
    accent: '#87ceeb'        // Sky blue
  },
  fonts: {
    primary: 'Georgia, serif',
    display: 'Times New Roman, serif'
  },
  spacing: {
    unit: '1.2rem'  // Slightly larger spacing
  },
  animations: {
    duration: '400ms',
    easing: 'ease-in-out'
  }
});
```

### Method 3: Theme Builder Interface

**Using Built-in Theme Builder**
1. Open Settings → Themes → "Create New Theme"
2. Choose base theme to modify
3. Adjust colors using color picker
4. Modify typography settings
5. Preview in real-time
6. Save with custom name
7. Export CSS for sharing

## Theme Architecture

### Theme Loading System

**Theme Loading Priority**
1. User-selected theme from localStorage
2. System preference (light/dark)
3. Default light theme
4. Fallback styles

**Theme Structure**
```javascript
const ThemeConfig = {
  name: 'Theme Name',
  version: '1.0.0',
  author: 'Your Name',
  description: 'Theme description',
  
  colors: {
    primary: '#color',
    secondary: '#color',
    background: '#color',
    text: '#color',
    accent: '#color',
    
    // State colors
    focus: '#color',      // Focus phase
    break: '#color',      // Break phase
    longBreak: '#color',  // Long break phase
    
    // UI states
    success: '#color',
    warning: '#color',
    error: '#color',
    info: '#color'
  },
  
  typography: {
    primary: 'font-family',
    display: 'font-family',
    mono: 'font-family',
    sizes: {
      timer: 'clamp(2rem, 8vw, 6rem)',
      heading: '1.5rem',
      body: '1rem'
    }
  },
  
  layout: {
    spacing: '1rem',
    borderRadius: '8px',
    shadows: {
      small: '0 2px 4px rgba(0,0,0,0.1)',
      medium: '0 4px 8px rgba(0,0,0,0.2)',
      large: '0 8px 16px rgba(0,0,0,0.3)'
    }
  },
  
  animations: {
    duration: '300ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    progress: 'linear'
  }
};
```

### Phase-Specific Theming

**Different Colors for Timer Phases**
```css
:root[data-theme="productivity-pro"] {
  /* Focus Phase */
  --focus-primary: #e74c3c;      /* Energizing red */
  --focus-background: #fdf2f2;   /* Light red background */
  
  /* Break Phase */
  --break-primary: #27ae60;      /* Relaxing green */
  --break-background: #f2fdf2;   /* Light green background */
  
  /* Long Break Phase */
  --long-break-primary: #3498db;  /* Calming blue */
  --long-break-background: #f2f8fd; /* Light blue background */
}

/* Apply phase-specific colors */
.timer[data-phase="focus"] {
  --primary-color: var(--focus-primary);
  --background-color: var(--focus-background);
}

.timer[data-phase="break"] {
  --primary-color: var(--break-primary);
  --background-color: var(--break-background);
}

.timer[data-phase="long-break"] {
  --primary-color: var(--long-break-primary);
  --background-color: var(--long-break-background);
}
```

## Advanced Theming

### Dynamic Color Generation

**Generate Color Variations**
```css
:root {
  --primary-hue: 210;
  --primary-saturation: 50%;
  --primary-lightness: 50%;
  
  /* Generate variations */
  --primary-color: hsl(var(--primary-hue), var(--primary-saturation), var(--primary-lightness));
  --primary-light: hsl(var(--primary-hue), var(--primary-saturation), calc(var(--primary-lightness) + 10%));
  --primary-dark: hsl(var(--primary-hue), var(--primary-saturation), calc(var(--primary-lightness) - 10%));
}
```

### CSS Grid Theming

**Layout-aware Themes**
```css
:root[data-theme="grid-master"] {
  /* Grid-specific layouts */
  --grid-columns: repeat(auto-fit, minmax(300px, 1fr));
  --grid-gap: var(--spacing-lg);
  --grid-template-areas: 
    "header header header"
    "timer settings stats"
    "controls controls controls";
}

.app-layout[data-theme="grid-master"] {
  display: grid;
  grid-template-columns: var(--grid-columns);
  grid-gap: var(--grid-gap);
  grid-template-areas: var(--grid-template-areas);
}
```

### Animation Theming

**Custom Animation Profiles**
```css
:root[data-theme="smooth-operator"] {
  --animation-duration: 600ms;
  --animation-easing: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --progress-animation: smooth-progress 1s ease-in-out infinite;
}

@keyframes smooth-progress {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

[data-theme="smooth-operator"] .progress-ring {
  animation: var(--progress-animation);
}
```

### Responsive Theming

**Breakpoint-aware Themes**
```css
:root[data-theme="responsive-design"] {
  /* Mobile-first theming */
  --font-size-timer: clamp(2rem, 12vw, 4rem);
  --spacing-unit: clamp(0.5rem, 2vw, 1rem);
  --border-radius: clamp(4px, 1vw, 12px);
}

@media (min-width: 768px) {
  :root[data-theme="responsive-design"] {
    --layout-mode: desktop;
    --timer-size: 320px;
  }
}

@media (min-width: 1024px) {
  :root[data-theme="responsive-design"] {
    --layout-mode: wide;
    --timer-size: 400px;
  }
}
```

## Theme Sharing

### Export Theme Configuration

**CSS Export**
```css
/* Copy this CSS to share your theme */
:root[data-theme="my-awesome-theme"] {
  --primary-color: #your-color;
  --secondary-color: #your-color;
  /* ... all your custom properties */
}

/* Include any custom styles */
[data-theme="my-awesome-theme"] .special-element {
  /* custom styles */
}
```

**JSON Export**
```json
{
  "name": "My Awesome Theme",
  "version": "1.0.0",
  "author": "Your Name",
  "description": "A beautiful theme for productivity",
  "colors": {
    "primary": "#ff6b6b",
    "secondary": "#4ecdc4"
  },
  "typography": {
    "primary": "Inter, sans-serif"
  }
}
```

### Import Themes

**CSS Import Method**
1. Save theme CSS to `/themes/theme-name.css`
2. Add to HTML: `<link rel="stylesheet" href="themes/theme-name.css">`
3. Register theme: `ThemeProvider.registerTheme('theme-name', config)`

**JSON Import Method**
1. Open Settings → Themes → Import
2. Paste JSON configuration
3. Theme becomes available immediately

### Community Themes

**Popular Community Themes**

**Material Design**
```css
:root[data-theme="material"] {
  --primary-color: #1976d2;
  --secondary-color: #dc004e;
  --background-color: #fafafa;
  --font-primary: 'Roboto', sans-serif;
  --border-radius: 4px;
  --animation-duration: 250ms;
}
```

**Dracula**
```css
:root[data-theme="dracula"] {
  --primary-color: #ff79c6;
  --secondary-color: #8be9fd;
  --background-color: #282a36;
  --text-color: #f8f8f2;
  --font-primary: 'JetBrains Mono', monospace;
}
```

**Nord**
```css
:root[data-theme="nord"] {
  --primary-color: #88c0d0;
  --secondary-color: #81a1c1;
  --background-color: #2e3440;
  --text-color: #d8dee9;
  --font-primary: 'Inter', sans-serif;
}
```

## Troubleshooting

### Common Issues

**Colors Not Applying**
- Check CSS selector specificity
- Ensure custom property names are correct
- Verify theme is properly registered
- Check browser developer tools for conflicts

**Theme Not Switching**
- Clear browser cache
- Check localStorage for theme preference
- Verify theme registration code
- Test theme switching in developer tools

**Animation Issues**
- Check animation custom properties syntax
- Verify browser support for CSS features
- Test with reduced motion preferences
- Validate keyframe definitions

### Debug Mode

**Enable Theme Debug Mode**
```javascript
// Add to browser console
ThemeProvider.enableDebugMode();

// View current theme properties
ThemeProvider.getCurrentTheme();

// List all registered themes  
ThemeProvider.getAllThemes();

// Test theme switching
ThemeProvider.setTheme('theme-name');
```

## Best Practices

### Theme Design Principles

**Accessibility First**
- Maintain 4.5:1 contrast ratio for text
- Support system dark/light mode preferences
- Test with color blindness simulators
- Ensure keyboard navigation visibility

**Performance Considerations**
- Use CSS custom properties for runtime changes
- Avoid complex gradients in animations
- Minimize CSS file size
- Test performance on low-end devices

**User Experience**
- Provide meaningful theme names and descriptions
- Include preview images or demos
- Group related themes together
- Offer easy reset/undo options

### Color Theory Guidelines

**Color Harmony**
- Use complementary colors for contrast
- Apply 60-30-10 rule (60% primary, 30% secondary, 10% accent)
- Consider color psychology for productivity
- Test colors in different lighting conditions

**Accessibility Colors**
- Primary text: #212529 on light, #f8f9fa on dark
- Secondary text: #6c757d on light, #adb5bd on dark
- Error states: #dc3545 (accessible red)
- Success states: #198754 (accessible green)

### Theme Naming Conventions

**Descriptive Names**
- Use clear, descriptive names: "Ocean Breeze" not "Blue Theme"
- Include mood or use case: "Focus Dark", "Relaxing Light"
- Version themes: "Material Design 2.0"
- Credit inspiration: "Inspired by iOS"

## Theme Gallery

### Productivity Focused

**Deep Work**
- Colors: Deep navy, muted gold, soft white
- Typography: Serif fonts for elegance
- Mood: Serious, focused, minimalist

**Creative Flow**  
- Colors: Vibrant purples, energizing oranges
- Typography: Modern sans-serif
- Mood: Inspiring, dynamic, artistic

**Zen Garden**
- Colors: Natural greens, earth tones
- Typography: Balanced, readable fonts
- Mood: Calm, peaceful, grounding

### Seasonal Themes

**Spring Awakening**
- Colors: Fresh greens, cherry blossom pink
- Mood: Renewal, growth, optimism

**Summer Vibes**
- Colors: Sunny yellow, ocean blue, coral
- Mood: Energetic, warm, vibrant

**Autumn Focus**
- Colors: Burnt orange, golden yellow, deep red
- Mood: Cozy, productive, grounded

**Winter Clarity**
- Colors: Cool blues, crisp whites, silver
- Mood: Clear, sharp, focused

---

## Quick Start Checklist

- [ ] Choose base theme closest to your vision
- [ ] Identify primary and secondary colors
- [ ] Test color contrast for accessibility
- [ ] Customize typography if desired
- [ ] Add theme-specific animations
- [ ] Test across different visual modes
- [ ] Export and share your creation

**Happy theming! 🎨🍅**

*Remember: The best theme is one that helps you focus and feel motivated. Experiment until you find your perfect productivity companion.*