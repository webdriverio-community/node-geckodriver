import typescriptEslint from '@typescript-eslint/eslint-plugin'
import unicorn from 'eslint-plugin-unicorn'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'

export default [{
  plugins: {
    '@typescript-eslint': typescriptEslint,
    unicorn,
  },
  ignores: ['node_modules/**', 'dist/**', 'build/**'],

  languageOptions: {
    globals: {
      ...globals.node,
    },

    parser: tsParser,
    ecmaVersion: 2020,
    sourceType: 'module',
  },

  rules: {
    quotes: ['error', 'single', {
      avoidEscape: true,
    }],

    camelcase: ['error', {
      properties: 'never',
    }],

    semi: ['error', 'never'],
    indent: [2, 2],
    eqeqeq: ['error', 'always'],
    'prefer-const': 'error',

    'no-multiple-empty-lines': [2, {
      max: 1,
      maxEOF: 1,
    }],

    'array-bracket-spacing': ['error', 'never'],

    'brace-style': ['error', '1tbs', {
      allowSingleLine: true,
    }],

    'comma-spacing': ['error', {
      before: false,
      after: true,
    }],

    'no-lonely-if': 'error',
    'dot-notation': 'error',
    'no-else-return': 'error',
    'no-tabs': 'error',

    'no-trailing-spaces': ['error', {
      skipBlankLines: false,
      ignoreComments: false,
    }],

    'no-var': 'error',
    'unicode-bom': ['error', 'never'],
    curly: ['error', 'all'],
    'object-curly-spacing': ['error', 'always'],
    'keyword-spacing': ['error'],
    'require-atomic-updates': 0,
    'linebreak-style': ['error', 'unix'],
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    'unicorn/prefer-node-protocol': ['error'],
    'no-restricted-syntax': ['error', 'IfStatement > ExpressionStatement > AssignmentExpression'],
    'unicorn/prefer-ternary': 'error',
  },
}, {
  files: ['**/*.ts'],
  ignores: ['node_modules/**', 'dist/**', 'build/**'],
  rules: {
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'no-redeclare': 'off',
    'dot-notation': 'off',
  },
}]
