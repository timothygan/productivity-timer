import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    // Test environment
    environment: 'jsdom',
    
    // Global test configuration
    globals: true,
    
    // Setup files
    setupFiles: ['./tests/setup.js'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/**',
        'dist/**',
        'coverage/**',
        'tests/**',
        '**/*.config.js',
        '**/*.config.ts'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    
    // Test patterns
    include: [
      'tests/**/*.{test,spec}.{js,mjs,ts}',
      'src/**/__tests__/**/*.{test,spec}.{js,mjs,ts}'
    ],
    
    // Exclude patterns
    exclude: [
      'node_modules/**',
      'dist/**',
      '.idea/**',
      '.git/**',
      '.vscode/**'
    ],
    
    // Test timeout
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Reporter configuration
    reporter: ['verbose', 'junit'],
    outputFile: {
      junit: './coverage/junit.xml'
    },
    
    // Mock configuration
    deps: {
      inline: ['vitest-canvas-mock']
    },
    
    // Pool options for parallel testing
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        isolate: true
      }
    }
  },
  
  // Resolve configuration (same as vite.config.js)
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@js': resolve(__dirname, 'src/js'),
      '@css': resolve(__dirname, 'src/css'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },
  
  // Define global constants for tests
  define: {
    __DEV__: JSON.stringify(true),
    __PROD__: JSON.stringify(false),
    __TEST__: JSON.stringify(true),
    __VERSION__: JSON.stringify('test')
  }
})