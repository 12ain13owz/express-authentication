/** @type {import('eslint').Linter.Config[]} */
import pluginJs from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import noUnsanitized from 'eslint-plugin-no-unsanitized'
import security from 'eslint-plugin-security'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  // Ignore files and directories
  {
    ignores: [
      'node_modules/**',
      'dist/**/*',
      'scripts/**',
      'eslint.config.mjs',
    ],
  },

  // Target files to lint
  { files: ['src/**/*.{js,mjs,cjs,ts}'] },

  // Language options for Node.js environment
  {
    languageOptions: {
      globals: globals.node,
      parser: tseslint.parser, // Use TypeScript parser
      parserOptions: {
        sourceType: 'module', // Support ES Modules (matches tsconfig.json "module": "nodenext")
        project: './tsconfig.json', // Enable type-aware linting
        tsconfigRootDir: import.meta.dirname, // Root directory for tsconfig
      },
    },
  },

  // JavaScript recommended rules
  pluginJs.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked, // Type-aware rules for stricter TypeScript linting

  // Custom rules and plugins
  {
    plugins: {
      import: importPlugin,
      security,
      'no-unsanitized': noUnsanitized,
    },
    rules: {
      // General JavaScript rules
      'no-async-promise-executor': 'error', // Prevent unsafe Promise executor functions
      'no-throw-literal': 'error', // Disallow throwing literals (e.g., throw "error")
      'no-eval': 'error', // Disallow use of eval()
      'no-console': ['error', { allow: ['warn', 'error'] }], // Allow console.warn and console.error for logging
      'no-process-env': 'warn', // Warn on direct process.env access (encourage dotenv)

      // Complexity control (adjusted for Express APIs)
      complexity: ['warn', { max: 15 }], // Allow higher complexity for API endpoints

      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ], // Ignore unused variables starting with _
      '@typescript-eslint/no-explicit-any': 'error', // Disallow explicit any
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Allow implicit return types in Express handlers
      '@typescript-eslint/require-await': 'off', // Allow async functions without await (common in Express middleware)

      // Security and sanitization
      'no-unsanitized/method': 'warn', // Warn on unsanitized DOM methods
      'security/detect-object-injection': 'warn', // Warn on potential object injection vulnerabilities

      // Import ordering (aligned with tsconfig.json paths: @/*)
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            'internal',
            ['parent', 'sibling', 'index'],
          ],
          pathGroups: [
            {
              pattern: '@/**', // Match @/ imports from src/*
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],
    },
  },
]
