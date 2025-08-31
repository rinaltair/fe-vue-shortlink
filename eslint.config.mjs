// Import required utilities from URL and path modules
import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

// Import recommended configs from ESLint plugins
import pluginJs from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// Get current module path using import.meta.url
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Read .auto-import.json and parse it as JSON
const autoImportConfig = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.auto-import.json'), 'utf-8')
)

export default [
  // Target files
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}']
  },
  // Globals and environment
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  // Extend base configs
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  // Custom rules
  {
    // Apply the following config to all JS/TS/Vue files
    files: ['**/*.{js,mjs,cjs,ts,vue}'],

    languageOptions: {
      globals: {
        // Merge globals read from autoImportConfig
        ...autoImportConfig.globals,
        // TypeScript global namespaces
        Api: 'readonly',
        Form: 'readonly'
      }
    },
    rules: {
      quotes: ['error', 'single'], // Use single quotes
      semi: ['error', 'never'], // No semicolons at end of statements
      'no-var': 'error', // Require let or const instead of var
      '@typescript-eslint/no-explicit-any': 'off', // Allow any
      'vue/multi-word-component-names': 'off', // Allow single-word Vue component names
      'no-multiple-empty-lines': ['warn', { max: 1 }], // Disallow multiple consecutive blank lines
      'no-unexpected-multiline': 'error' // Disallow confusing multiline
    }
  },
  // Vue rules
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tseslint.parser }
    }
  },
  // Ignore files
  {
    ignores: [
      'node_modules',
      'dist',
      'public',
      '.vscode/**',
      'src/assets/**',
      'src/utils/console.ts'
    ]
  },
  // Prettier config
  eslintPluginPrettierRecommended
]
