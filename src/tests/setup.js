// Global test setup
import { vi } from 'vitest'

// Mock Web APIs that might not be available in test environment
global.requestAnimationFrame = vi.fn((cb) => setTimeout(cb, 16))
global.cancelAnimationFrame = vi.fn(clearTimeout)

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
global.localStorage = localStorageMock

// Mock audio APIs
global.AudioContext = vi.fn(() => ({
  createOscillator: vi.fn(() => ({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    frequency: { value: 0 }
  })),
  createGain: vi.fn(() => ({
    connect: vi.fn(),
    gain: { value: 0 }
  })),
  destination: {}
}))

// Mock Fullscreen API
global.document.fullscreenElement = null
global.document.exitFullscreen = vi.fn()
global.HTMLElement.prototype.requestFullscreen = vi.fn()

// Mock Page Visibility API
Object.defineProperty(document, 'visibilityState', {
  writable: true,
  value: 'visible'
})

Object.defineProperty(document, 'hidden', {
  writable: true,
  value: false
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock performance API
global.performance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn(() => [])
}

// Setup DOM cleanup after each test
afterEach(() => {
  document.body.innerHTML = ''
  vi.clearAllMocks()
  localStorage.clear()
})