/**
 * commitlint configuration
 * Docs:
 * https://commitlint.js.org/#/reference-rules
 * https://cz-git.qbb.sh/guide/
 */

module.exports = {
  // Extends
  extends: ['@commitlint/config-conventional'],
  // Custom rules
  rules: {
    // Allowed commit types; `type` must be one of:
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation changes
        'style', // Code style (whitespace, formatting, missing semicolons, etc.)
        'refactor', // Code refactor (neither bug fix nor feature)
        'perf', // Performance improvements
        'test', // Add missing tests or update tests
        'build', // Build process or external dependencies (e.g. upgrade npm packages, modify webpack config)
        'ci', // CI configuration or scripts
        'revert', // Revert a commit
        'chore', // Changes to build tools or auxiliary libs (no effect on src/tests)
        'wip' // Work in progress
      ]
    ],
    'subject-case': [0] // Do not enforce subject case
  },

  prompt: {
    messages: {
      type: 'Select the type of change:',
      scope: 'Select a scope (optional):',
      customScope: 'Enter a custom scope:',
      subject: 'Write a short, imperative description:\n',
      body: 'Provide a longer description (optional). Use "|" for new lines:\n',
      breaking: 'List any breaking changes (optional). Use "|" for new lines:\n',
      footerPrefixesSelect: 'Select an issue prefix (optional):',
      customFooterPrefix: 'Enter a custom issue prefix:',
      footer: 'List related issues (optional), e.g. #31, #I3244:\n',
      generatingByAI: 'Generating a short commit description via AI...',
      generatedSelectByAI: 'Pick an AI-generated short description:',
      confirmCommit: 'Submit the commit or modify it?'
    },
    // prettier-ignore
    types: [
      { value: "feat",     name: "Feature:  Add a new feature" },
      { value: "fix",      name: "Fix:  Fix a bug" },
      { value: "docs",     name: "Docs:  Documentation changes (README, comments)" },
      { value: "style",    name: "Style:  Code style (whitespace/formatting/missing semicolons)" },
      { value: "refactor", name: "Refactor:  Code refactoring (no bug fix or feature)" },
      { value: "perf",     name: "Perf:  Performance improvements" },
      { value: "test",     name: "Test:  Add or update tests" },
      { value: "build",    name: "Build:  Build process or dependencies (e.g. vite config)" },
      { value: "ci",       name: "CI:  CI configuration or scripts" },
      { value: "revert",   name: "Revert:  Revert a commit" },
      { value: "chore",    name: "Chore:  Changes to build tools or auxiliary libs" },
    ],
    useEmoji: true,
    emojiAlign: 'center',
    useAI: false,
    aiNumber: 1,
    themeColorCode: '',
    scopes: [],
    allowCustomScopes: true,
    allowEmptyScopes: true,
    customScopesAlign: 'bottom',
    customScopesAlias: 'custom',
    emptyScopesAlias: 'empty',
    upperCaseSubject: false,
    markBreakingChangeMode: false,
    allowBreakingChanges: ['feat', 'fix'],
    breaklineNumber: 100,
    breaklineChar: '|',
    skipQuestions: ['breaking', 'footerPrefix', 'footer'], // Skip these steps
    issuePrefixes: [{ value: 'closed', name: 'closed:   ISSUES has been processed' }],
    customIssuePrefixAlign: 'top',
    emptyIssuePrefixAlias: 'skip',
    customIssuePrefixAlias: 'custom',
    allowCustomIssuePrefix: true,
    allowEmptyIssuePrefix: true,
    confirmColorize: true,
    maxHeaderLength: Infinity,
    maxSubjectLength: Infinity,
    minSubjectLength: 0,
    scopeOverrides: undefined,
    defaultBody: '',
    defaultIssues: '',
    defaultScope: '',
    defaultSubject: ''
  }
}
