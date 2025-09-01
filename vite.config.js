import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  // Root directory for source files
  root: '.',
  
  // Base public path when served in development or production
  base: './',
  
  // Directory to serve as plain static assets
  publicDir: 'public',
  
  // Build configuration
  build: {
    // Output directory for build files
    outDir: 'dist',
    
    // Generate sourcemaps for production
    sourcemap: true,
    
    // Target browsers
    target: 'es2020',
    
    // Minification
    minify: 'esbuild',
    
    // Clean output directory before build
    emptyOutDir: true,
    
    // Rollup options
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        // Manual chunks for better caching
        manualChunks: {
          vendor: ['howler', 'hotkeys-js', 'tinycolor2', 'canvas-confetti', 'date-fns']
        },
        // Asset file names
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js'
      }
    },
    
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    // CSS code splitting
    cssCodeSplit: true
  },
  
  // Development server configuration
  server: {
    port: 3000,
    open: true,
    cors: true,
    strictPort: false,
    host: true
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    open: true,
    cors: true
  },
  
  // CSS configuration
  css: {
    postcss: './postcss.config.js',
    devSourcemap: true,
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  },
  
  // Asset optimization
  assetsInclude: ['**/*.woff', '**/*.woff2', '**/*.ttf', '**/*.eot'],
  
  // Define global constants
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production'),
    __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0')
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@js': resolve(__dirname, 'src/js'),
      '@css': resolve(__dirname, 'src/css'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },
  
  // Optimization configuration
  optimizeDeps: {
    include: ['howler', 'hotkeys-js', 'tinycolor2', 'canvas-confetti', 'date-fns'],
    exclude: []
  },
  
  // Experimental features
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { js: `"./${filename}"` }
      } else {
        return { relative: true }
      }
    }
  },
  
  // Plugin configuration
  plugins: [
    // Custom plugin for environment detection
    {
      name: 'env-vars',
      config(config, { command }) {
        if (command === 'serve') {
          config.define = {
            ...config.define,
            __BUILD_TIME__: JSON.stringify(new Date().toISOString())
          }
        }
      }
    }
  ]
})