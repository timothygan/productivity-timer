/**
 * VisualRenderer - Strategy pattern for different visual display modes
 * Handles aesthetic displays and animations with Canvas API
 */
class VisualRenderer {
  constructor(canvasElement, timerEngine, themeProvider) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.timerEngine = timerEngine;
    this.themeProvider = themeProvider;
    
    this.currentMode = 'circular';
    this.animationId = null;
    this.isAnimating = false;
    
    // Visual modes registry
    this.modes = {};
    this.registerDefaultModes();
    
    // Animation state
    this.animationState = {
      progress: 0,
      phase: 'focus',
      isRunning: false,
      lastUpdate: 0
    };
    
    this.setupCanvas();
    this.bindEvents();
    this.startAnimationLoop();
  }

  registerDefaultModes() {
    this.modes.circular = new CircularMode(this);
    this.modes.shapes = new ShapesMode(this);
    this.modes.minimal = new MinimalMode(this);
    this.modes.bars = new BarsMode(this);
  }

  setupCanvas() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    const container = this.canvas.parentElement;
    const rect = container.getBoundingClientRect();
    
    // Set canvas size to match container
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    
    this.ctx.scale(dpr, dpr);
    
    // Store logical dimensions
    this.width = rect.width;
    this.height = rect.height;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.radius = Math.min(this.width, this.height) / 2 - 20;
  }

  bindEvents() {
    this.timerEngine.on('timer:tick', (event) => {
      this.updateAnimationState(event.detail);
    });

    this.timerEngine.on('timer:start', (event) => {
      this.animationState.isRunning = true;
    });

    this.timerEngine.on('timer:pause', (event) => {
      this.animationState.isRunning = false;
    });

    this.timerEngine.on('timer:reset', (event) => {
      this.animationState.isRunning = false;
      this.animationState.progress = 0;
    });

    this.timerEngine.on('timer:phase-change', (event) => {
      this.animationState.phase = event.detail.toPhase;
    });

    this.themeProvider.on('theme:changed', () => {
      this.render(); // Re-render with new theme colors
    });

    // Listen for visual mode changes
    document.addEventListener('visual:mode-change', (event) => {
      this.setMode(event.detail.mode);
    });

    // Keyboard shortcut for visual mode toggle
    document.addEventListener('keydown', (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      if (event.code === 'KeyV') {
        event.preventDefault();
        this.toggleMode();
      }
    });
  }

  updateAnimationState(data) {
    this.animationState.progress = data.progress || 0;
    this.animationState.phase = data.phase;
    this.animationState.remainingTime = data.remainingTime;
  }

  setMode(modeName) {
    if (!this.modes[modeName]) {
      console.warn(`Visual mode "${modeName}" not found`);
      return;
    }

    this.currentMode = modeName;
    this.render();
    
    document.dispatchEvent(new CustomEvent('visual:mode-changed', {
      detail: { mode: modeName }
    }));
  }

  toggleMode() {
    const modeNames = Object.keys(this.modes);
    const currentIndex = modeNames.indexOf(this.currentMode);
    const nextIndex = (currentIndex + 1) % modeNames.length;
    this.setMode(modeNames[nextIndex]);
  }

  startAnimationLoop() {
    const animate = (timestamp) => {
      this.animationState.lastUpdate = timestamp;
      this.render();
      this.animationId = requestAnimationFrame(animate);
    };
    
    this.animationId = requestAnimationFrame(animate);
  }

  render() {
    this.clear();
    
    if (this.modes[this.currentMode]) {
      this.modes[this.currentMode].render(this.animationState);
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  // Utility methods for modes
  getThemeColor(colorName) {
    const theme = this.themeProvider.getThemeConfig();
    return theme?.colors?.[colorName] || '#6366f1';
  }

  getPhaseColor() {
    const colors = {
      focus: this.getThemeColor('focus'),
      shortBreak: this.getThemeColor('break'),
      longBreak: this.getThemeColor('break')
    };
    return colors[this.animationState.phase] || this.getThemeColor('primary');
  }

  // Public methods
  getCurrentMode() {
    return this.currentMode;
  }

  getAvailableModes() {
    return Object.keys(this.modes).map(key => ({
      key,
      name: this.modes[key].name || key
    }));
  }

  // Cleanup
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.resizeCanvas);
  }
}

// Visual Mode Classes (Strategy Pattern Implementation)

class CircularMode {
  constructor(renderer) {
    this.renderer = renderer;
    this.name = 'Circular Progress';
  }

  render(state) {
    const { ctx, centerX, centerY, radius } = this.renderer;
    const progress = state.progress || 0;
    const phaseColor = this.renderer.getPhaseColor();
    const backgroundColor = this.renderer.getThemeColor('surface');

    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = backgroundColor;
    ctx.lineWidth = 8;
    ctx.stroke();

    // Progress arc
    if (progress > 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + (progress * 2 * Math.PI));
      ctx.strokeStyle = phaseColor;
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    // Center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = phaseColor;
    ctx.fill();

    // Animated pulse effect when running
    if (state.isRunning) {
      const pulseRadius = 6 + Math.sin(Date.now() / 500) * 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, 2 * Math.PI);
      ctx.strokeStyle = phaseColor;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.6;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }
}

class ShapesMode {
  constructor(renderer) {
    this.renderer = renderer;
    this.name = 'Creative Shapes';
    this.shapes = ['triangle', 'square', 'hexagon', 'star'];
    this.currentShape = 0;
  }

  render(state) {
    const { ctx, centerX, centerY, radius } = this.renderer;
    const progress = state.progress || 0;
    const phaseColor = this.renderer.getPhaseColor();
    
    // Cycle through shapes based on phase
    const shapeIndex = Math.floor(Date.now() / 5000) % this.shapes.length;
    const shapeName = this.shapes[shapeIndex];

    const size = radius * 0.8;
    
    // Background shape
    ctx.globalAlpha = 0.2;
    this.drawShape(shapeName, centerX, centerY, size, phaseColor);
    
    // Progress shape
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, size, -Math.PI / 2, -Math.PI / 2 + (progress * 2 * Math.PI));
    ctx.lineTo(centerX, centerY);
    ctx.clip();
    
    this.drawShape(shapeName, centerX, centerY, size, phaseColor);
    ctx.restore();

    // Rotating elements when running
    if (state.isRunning) {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(Date.now() / 1000);
      
      for (let i = 0; i < 3; i++) {
        ctx.rotate(Math.PI * 2 / 3);
        ctx.beginPath();
        ctx.arc(size * 0.7, 0, 3, 0, 2 * Math.PI);
        ctx.fillStyle = phaseColor;
        ctx.fill();
      }
      
      ctx.restore();
    }
  }

  drawShape(shape, x, y, size, color) {
    const ctx = this.renderer.ctx;
    
    ctx.strokeStyle = color;
    ctx.fillStyle = color + '30'; // Add transparency
    ctx.lineWidth = 3;

    switch (shape) {
      case 'triangle':
        this.drawTriangle(x, y, size);
        break;
      case 'square':
        this.drawSquare(x, y, size);
        break;
      case 'hexagon':
        this.drawHexagon(x, y, size);
        break;
      case 'star':
        this.drawStar(x, y, size);
        break;
    }
    
    ctx.fill();
    ctx.stroke();
  }

  drawTriangle(x, y, size) {
    const ctx = this.renderer.ctx;
    ctx.beginPath();
    ctx.moveTo(x, y - size * 0.6);
    ctx.lineTo(x - size * 0.5, y + size * 0.3);
    ctx.lineTo(x + size * 0.5, y + size * 0.3);
    ctx.closePath();
  }

  drawSquare(x, y, size) {
    const ctx = this.renderer.ctx;
    const half = size * 0.5;
    ctx.beginPath();
    ctx.rect(x - half, y - half, size, size);
  }

  drawHexagon(x, y, size) {
    const ctx = this.renderer.ctx;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const px = x + Math.cos(angle) * size;
      const py = y + Math.sin(angle) * size;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  drawStar(x, y, size) {
    const ctx = this.renderer.ctx;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
      const outerRadius = size;
      const innerRadius = size * 0.4;
      
      const outerX = x + Math.cos(angle) * outerRadius;
      const outerY = y + Math.sin(angle) * outerRadius;
      
      const innerAngle = angle + Math.PI / 5;
      const innerX = x + Math.cos(innerAngle) * innerRadius;
      const innerY = y + Math.sin(innerAngle) * innerRadius;
      
      if (i === 0) ctx.moveTo(outerX, outerY);
      else ctx.lineTo(outerX, outerY);
      ctx.lineTo(innerX, innerY);
    }
    ctx.closePath();
  }
}

class MinimalMode {
  constructor(renderer) {
    this.renderer = renderer;
    this.name = 'Minimal';
  }

  render(state) {
    const { ctx, centerX, centerY, width } = this.renderer;
    const progress = state.progress || 0;
    const phaseColor = this.renderer.getPhaseColor();
    const textColor = this.renderer.getThemeColor('text');

    // Minimal progress line
    const lineWidth = width * 0.6;
    const lineY = centerY + 40;
    
    // Background line
    ctx.beginPath();
    ctx.moveTo(centerX - lineWidth / 2, lineY);
    ctx.lineTo(centerX + lineWidth / 2, lineY);
    ctx.strokeStyle = this.renderer.getThemeColor('border');
    ctx.lineWidth = 2;
    ctx.stroke();

    // Progress line
    if (progress > 0) {
      ctx.beginPath();
      ctx.moveTo(centerX - lineWidth / 2, lineY);
      ctx.lineTo(centerX - lineWidth / 2 + (lineWidth * progress), lineY);
      ctx.strokeStyle = phaseColor;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    // Phase indicator dot
    const dotX = centerX - lineWidth / 2 + (lineWidth * progress);
    ctx.beginPath();
    ctx.arc(dotX, lineY, 6, 0, 2 * Math.PI);
    ctx.fillStyle = phaseColor;
    ctx.fill();

    // Subtle breathing animation when running
    if (state.isRunning) {
      const breathe = 1 + Math.sin(Date.now() / 1000) * 0.1;
      ctx.save();
      ctx.translate(dotX, lineY);
      ctx.scale(breathe, breathe);
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, 2 * Math.PI);
      ctx.strokeStyle = phaseColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4;
      ctx.stroke();
      ctx.restore();
    }
  }
}

class BarsMode {
  constructor(renderer) {
    this.renderer = renderer;
    this.name = 'Progress Bars';
    this.bars = 12;
  }

  render(state) {
    const { ctx, centerX, centerY, radius } = this.renderer;
    const progress = state.progress || 0;
    const phaseColor = this.renderer.getPhaseColor();
    
    const barCount = this.bars;
    const progressBars = Math.floor(progress * barCount);
    
    for (let i = 0; i < barCount; i++) {
      const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
      const startRadius = radius * 0.7;
      const endRadius = radius * 0.9;
      
      const x1 = centerX + Math.cos(angle) * startRadius;
      const y1 = centerY + Math.sin(angle) * startRadius;
      const x2 = centerX + Math.cos(angle) * endRadius;
      const y2 = centerY + Math.sin(angle) * endRadius;
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      
      if (i < progressBars) {
        ctx.strokeStyle = phaseColor;
        ctx.lineWidth = 4;
      } else if (i === progressBars && state.isRunning) {
        // Animated current bar
        const intensity = Math.sin(Date.now() / 200) * 0.5 + 0.5;
        ctx.strokeStyle = phaseColor;
        ctx.lineWidth = 4;
        ctx.globalAlpha = 0.5 + intensity * 0.5;
      } else {
        ctx.strokeStyle = this.renderer.getThemeColor('border');
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.3;
      }
      
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.4, 0, 2 * Math.PI);
    ctx.strokeStyle = this.renderer.getThemeColor('border');
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner progress circle
    if (progress > 0) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.3, -Math.PI / 2, -Math.PI / 2 + (progress * 2 * Math.PI));
      ctx.strokeStyle = phaseColor;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  }
}

export default VisualRenderer;