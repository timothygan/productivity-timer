export default {
  plugins: {
    // Autoprefixer for vendor prefixes
    autoprefixer: {
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead',
        'not ie 11'
      ],
      grid: 'autoplace'
    },
    
    // CSS optimization for production
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          // Disable unsafe optimizations
          mergeRules: false,
          mergeLonghand: false,
          
          // Safe optimizations
          normalizeWhitespace: true,
          minifySelectors: true,
          minifyParams: true,
          minifyFontValues: true,
          
          // Preserve custom properties
          reduceIdents: false,
          zindex: false,
          
          // CSS Grid support
          cssDeclarationSorter: false
        }]
      }
    } : {})
  }
}