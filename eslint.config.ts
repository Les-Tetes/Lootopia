// Strict ESLint config: every rule is an error and the CLI runs with --max-warnings=0.
import js from '@eslint/js';
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import eslintReact from '@eslint-react/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import importX from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y-x';
import nodePlugin from 'eslint-plugin-n';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import regexp from 'eslint-plugin-regexp';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['**/node_modules/', '**/dist/']),

  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
      reportUnusedInlineConfigs: 'error',
    },
  },

  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  sonarjs.configs.recommended,
  unicorn.configs.recommended,
  security.configs.recommended,
  regexp.configs['flat/recommended'],
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  comments.recommended,

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({ project: ['tsconfig.json', 'apps/*/tsconfig.json'] }),
      ],
    },
    rules: {
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'no-console': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      'no-param-reassign': ['error', { props: true }],
      'no-restricted-syntax': [
        'error',
        { selector: 'TSEnumDeclaration', message: 'Use a union of string literals instead.' },
      ],
      'object-shorthand': ['error', 'always'],
      'prefer-template': 'error',
      complexity: ['error', 10],
      'max-depth': ['error', 3],
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['error', { max: 60, skipBlankLines: true, skipComments: true }],
      'sonarjs/cognitive-complexity': ['error', 10],

      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-member-accessibility': 'error',
      '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/return-await': ['error', 'always'],
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        { allowString: false, allowNumber: false, allowNullableObject: false },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',

      'import-x/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'import-x/no-cycle': 'error',
      'import-x/no-default-export': 'error',
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      '@eslint-community/eslint-comments/require-description': 'error',

      // `null` is part of the DOM and React APIs.
      'unicorn/no-null': 'off',
    },
  },

  // API (NestJS, compiled to CommonJS)
  {
    files: ['apps/api/**/*.ts'],
    plugins: { n: nodePlugin },
    languageOptions: { globals: globals.node },
    rules: {
      'n/no-process-exit': 'error',
      'n/no-sync': 'error',
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
      'unicorn/prefer-top-level-await': 'off',
    },
  },

  // Web (React)
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    extends: [
      eslintReact.configs['strict-type-checked'],
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
      jsxA11y.configs.strict,
    ],
    languageOptions: { globals: globals.browser },
    rules: {
      'unicorn/filename-case': ['error', { cases: { kebabCase: true, pascalCase: true } }],
    },
  },

  // Tooling config files must use a default export.
  {
    files: ['*.config.ts', '**/*.config.ts'],
    languageOptions: { globals: globals.node },
    rules: {
      'import-x/no-default-export': 'off',
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off',
    },
  },
);
