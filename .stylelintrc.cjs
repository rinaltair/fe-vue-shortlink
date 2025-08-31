module.exports = {
  // Extend recommended configurations
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-scss',
    'stylelint-config-recommended-vue/scss',
    'stylelint-config-html/vue',
    'stylelint-config-recess-order'
  ],
  // Specify syntax parsers per file type
  overrides: [
    {
      files: ['**/*.{vue,html}'],
      customSyntax: 'postcss-html'
    },
    {
      files: ['**/*.{css,scss}'],
      customSyntax: 'postcss-scss'
    }
  ],
  // Custom rules
  rules: {
    'import-notation': 'string', // How to import CSS files ("string" | "url")
    'selector-class-pattern': null, // Class selector naming rule
    'custom-property-pattern': null, // Custom property naming rule
    'keyframes-name-pattern': null, // Keyframes naming rule
    'no-descending-specificity': null, // Allow descending specificity
    'no-empty-source': null, // Allow empty sources
    'property-no-vendor-prefix': null, // Allow vendor prefixes
    // Allow global, export, deep pseudo-classes
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'export', 'deep']
      }
    ],
    // Allow unknown properties
    'property-no-unknown': [
      true,
      {
        ignoreProperties: []
      }
    ],
    // Allow unknown at-rules
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'apply',
          'use',
          'mixin',
          'include',
          'extend',
          'each',
          'if',
          'else',
          'for',
          'while'
        ]
      }
    ]
  }
}
