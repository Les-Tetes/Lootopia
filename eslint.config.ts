// Lootopia — ESLint flat config.
//
// Philosophy: zero tolerance. The CLI runs with --max-warnings=0, unused disable
// directives are errors, and every `eslint-disable` must carry a justification
// (`-- reason`). The goal is to stay aligned with the SonarQube quality gate
// defined in the specification (§ 11.2: no code smell, A ratings, duplication < 3 %).
import js from '@eslint/js';
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import eslintReact from '@eslint-react/eslint-plugin';
import vitest from '@vitest/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import importX from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y-x';
import nodePlugin from 'eslint-plugin-n';
import promise from 'eslint-plugin-promise';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import regexp from 'eslint-plugin-regexp';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const TS_FILES = ['**/*.{ts,tsx,mts,cts}'];
const API_FILES = ['apps/api/**/*.{ts,mts}'];
const WEB_FILES = ['apps/web/**/*.{ts,tsx}'];
const TEST_FILES = ['**/*.{spec,test}.{ts,tsx}', '**/test/**/*.{ts,tsx}'];
const TEST_SETUP_FILES = ['**/test/setup.{ts,tsx}'];
const CONFIG_FILES = ['*.config.{ts,mts,js,mjs}', '**/*.config.{ts,mts,js,mjs}'];

// Complexity budget, kept in line with SonarQube defaults.
const MAX_COMPLEXITY = 10;
const MAX_DEPTH = 3;
const MAX_FILE_LINES = 300;
const MAX_FUNCTION_LINES = 60;
const MAX_NESTED_CALLBACKS = 3;
const MAX_PARAMS = 4;
const MAX_STATEMENTS = 20;
const DUPLICATE_STRING_THRESHOLD = 3;

export default defineConfig(
  globalIgnores([
    '**/node_modules/',
    '**/dist/',
    '**/build/',
    '**/coverage/',
    '**/playwright-report/',
    '**/test-results/',
    '**/*.tsbuildinfo',
  ]),

  {
    name: 'lootopia/linter-options',
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
      reportUnusedInlineConfigs: 'error',
    },
  },

  // ---------------------------------------------------------------------------
  // Base presets
  // ---------------------------------------------------------------------------
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  sonarjs.configs.recommended,
  unicorn.configs.recommended,
  security.configs.recommended,
  promise.configs['flat/recommended'],
  regexp.configs['flat/recommended'],
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  comments.recommended,

  {
    name: 'lootopia/typescript-parser',
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: ['tsconfig.json', 'apps/*/tsconfig.json', 'apps/*/tsconfig.*.json'],
        }),
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // Core rules — applied everywhere
  // ---------------------------------------------------------------------------
  {
    name: 'lootopia/core',
    files: TS_FILES,
    rules: {
      // --- Possible errors / correctness -----------------------------------
      'array-callback-return': ['error', { checkForEach: true }],
      'no-await-in-loop': 'error',
      'no-constructor-return': 'error',
      'no-promise-executor-return': 'error',
      'no-self-compare': 'error',
      'no-template-curly-in-string': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unreachable-loop': 'error',
      'require-atomic-updates': 'error',

      // --- Best practices ---------------------------------------------------
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'default-case-last': 'error',
      'guard-for-in': 'error',
      'no-alert': 'error',
      'no-caller': 'error',
      'no-console': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-implicit-coercion': 'error',
      'no-labels': 'error',
      'no-lone-blocks': 'error',
      'no-multi-assign': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-object-constructor': 'error',
      'no-param-reassign': ['error', { props: true }],
      'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
      'no-proto': 'error',
      'no-return-assign': ['error', 'always'],
      'no-sequences': 'error',
      'no-useless-call': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-concat': 'error',
      'no-useless-rename': 'error',
      'no-useless-return': 'error',
      'no-var': 'error',
      'no-void': ['error', { allowAsStatement: true }],
      'object-shorthand': ['error', 'always'],
      'prefer-const': 'error',
      'prefer-object-spread': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      radix: 'error',
      yoda: 'error',

      // --- Complexity budget (mirrors SonarQube cognitive complexity) -------
      complexity: ['error', MAX_COMPLEXITY],
      'max-depth': ['error', MAX_DEPTH],
      'max-lines': ['error', { max: MAX_FILE_LINES, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': [
        'error',
        { max: MAX_FUNCTION_LINES, skipBlankLines: true, skipComments: true },
      ],
      'max-nested-callbacks': ['error', MAX_NESTED_CALLBACKS],
      'max-params': 'off',
      'max-statements': ['error', MAX_STATEMENTS],
      'sonarjs/cognitive-complexity': ['error', MAX_COMPLEXITY],
      'sonarjs/no-duplicate-string': ['error', { threshold: DUPLICATE_STRING_THRESHOLD }],

      // --- Restricted syntax -----------------------------------------------
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSEnumDeclaration',
          message: 'Use a union of string literals or an `as const` object instead of an enum.',
        },
        {
          selector: 'ForInStatement',
          message: 'Use Object.keys/values/entries with for...of instead of for...in.',
        },
        {
          selector: 'LabeledStatement',
          message: 'Labels are a form of GOTO and make code hard to follow.',
        },
      ],

      // --- TypeScript: stricter than strictTypeChecked ---------------------
      // Type-only imports/exports always use a separate top-level `import type`
      // statement, which is what `verbatimModuleSyntax` erases cleanly.
      '@typescript-eslint/consistent-type-exports': [
        'error',
        { fixMixedExportsWithInlineTypeSpecifier: false },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/default-param-last': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        { allowExpressions: true, allowTypedFunctionExpressions: true },
      ],
      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'explicit' }],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/max-params': ['error', { max: MAX_PARAMS }],
      '@typescript-eslint/member-ordering': 'error',
      '@typescript-eslint/method-signature-style': ['error', 'property'],
      '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-loop-func': 'error',
      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          ignore: [-1, 0, 1, 2],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          ignoreReadonlyClassProperties: true,
          ignoreTypeIndexes: true,
          enforceConst: true,
        },
      ],
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unnecessary-parameter-property-assignment': 'error',
      '@typescript-eslint/no-unnecessary-qualifier': 'error',
      '@typescript-eslint/no-use-before-define': [
        'error',
        { functions: false, classes: true, variables: true, typedefs: true },
      ],
      '@typescript-eslint/no-useless-empty-export': 'error',
      '@typescript-eslint/parameter-properties': ['error', { prefer: 'parameter-property' }],
      '@typescript-eslint/prefer-enum-initializers': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/require-array-sort-compare': ['error', { ignoreStringArrays: false }],
      '@typescript-eslint/return-await': ['error', 'always'],
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowString: false,
          allowNumber: false,
          allowNullableObject: false,
          allowNullableBoolean: false,
          allowNullableString: false,
          allowNullableNumber: false,
          allowAny: false,
        },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': [
        'error',
        { requireDefaultForNonUnion: true, considerDefaultExhaustiveForUnions: false },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'default', format: ['camelCase'], leadingUnderscore: 'forbid' },
        { selector: 'import', format: ['camelCase', 'PascalCase'] },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'forbid',
        },
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'has', 'should', 'can', 'did', 'will'],
        },
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
        { selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'allow' },
        { selector: 'typeLike', format: ['PascalCase'] },
        {
          selector: 'typeParameter',
          format: ['PascalCase'],
          custom: { regex: '^(T|T[A-Z][A-Za-z]+)$', match: true },
        },
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: { regex: '^I[A-Z]', match: false },
        },
        { selector: 'enumMember', format: ['UPPER_CASE'] },
        // Object literal keys and HTTP headers may legitimately use other casings.
        { selector: ['objectLiteralProperty', 'typeProperty'], format: null },
        {
          selector: 'classProperty',
          modifiers: ['static', 'readonly'],
          format: ['UPPER_CASE', 'camelCase'],
        },
      ],

      // --- Imports ----------------------------------------------------------
      'import-x/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'import-x/first': 'error',
      'import-x/newline-after-import': 'error',
      'import-x/no-absolute-path': 'error',
      'import-x/no-cycle': ['error', { ignoreExternal: true }],
      'import-x/no-default-export': 'error',
      'import-x/no-duplicates': 'error',
      'import-x/no-extraneous-dependencies': [
        'error',
        { includeTypes: true, packageDir: [import.meta.dirname] },
      ],
      'import-x/no-mutable-exports': 'error',
      'import-x/no-relative-packages': 'error',
      'import-x/no-self-import': 'error',
      'import-x/no-useless-path-segments': ['error', { noUselessIndex: true }],
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // --- Comments ---------------------------------------------------------
      '@eslint-community/eslint-comments/no-unlimited-disable': 'error',
      '@eslint-community/eslint-comments/no-use': [
        'error',
        { allow: ['eslint-disable-next-line', 'eslint-disable', 'eslint-enable'] },
      ],
      '@eslint-community/eslint-comments/require-description': ['error', { ignore: [] }],

      // --- Unicorn tuning ---------------------------------------------------
      // `null` is part of the DOM / React / JSON contracts.
      'unicorn/no-null': 'off',
      'unicorn/name-replacements': [
        'error',
        {
          allowList: {
            args: true,
            env: true,
            Env: true,
            params: true,
            Params: true,
            props: true,
            Props: true,
            ref: true,
            Ref: true,
            dto: true,
            Dto: true,
          },
        },
      ],
    },
  },

  // ---------------------------------------------------------------------------
  // API (NestJS, Node.js)
  // ---------------------------------------------------------------------------
  {
    name: 'lootopia/api',
    files: API_FILES,
    plugins: { n: nodePlugin },
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          includeTypes: true,
          packageDir: [import.meta.dirname, `${import.meta.dirname}/apps/api`],
        },
      ],
      // Configuration must flow through a dedicated module, never ad-hoc.
      'n/no-process-env': 'error',
      'n/no-process-exit': 'error',
      'n/no-sync': 'error',
      'n/prefer-global/buffer': ['error', 'never'],
      'n/prefer-global/process': ['error', 'always'],
      'n/prefer-promises/fs': 'error',
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
      // The API is compiled to CommonJS: top-level await is not available.
      'unicorn/prefer-top-level-await': 'off',
    },
  },
  {
    name: 'lootopia/api-bootstrap',
    files: ['apps/api/src/main.ts', 'apps/api/src/config/**/*.ts'],
    rules: {
      'n/no-process-env': 'off',
    },
  },

  // ---------------------------------------------------------------------------
  // Web (React PWA)
  // ---------------------------------------------------------------------------
  {
    name: 'lootopia/web',
    files: WEB_FILES,
    extends: [
      eslintReact.configs['strict-type-checked'],
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
      jsxA11y.configs.strict,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          includeTypes: true,
          packageDir: [import.meta.dirname, `${import.meta.dirname}/apps/web`],
        },
      ],
      'unicorn/filename-case': ['error', { cases: { kebabCase: true, pascalCase: true } }],
    },
  },

  // ---------------------------------------------------------------------------
  // Tests
  // ---------------------------------------------------------------------------
  {
    name: 'lootopia/tests',
    files: TEST_FILES,
    extends: [vitest.configs.recommended],
    rules: {
      'vitest/consistent-test-it': ['error', { fn: 'it', withinDescribe: 'it' }],
      'vitest/no-disabled-tests': 'error',
      'vitest/no-focused-tests': 'error',
      'vitest/prefer-strict-equal': 'error',
      'vitest/prefer-to-be': 'error',
      'vitest/require-top-level-describe': 'error',
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/unbound-method': 'off',
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      'sonarjs/no-duplicate-string': 'off',
    },
  },
  {
    // Global test setup files register hooks outside of any describe block.
    name: 'lootopia/test-setup',
    files: TEST_SETUP_FILES,
    rules: {
      'vitest/require-top-level-describe': 'off',
    },
  },

  // ---------------------------------------------------------------------------
  // Tooling configuration files
  // ---------------------------------------------------------------------------
  {
    name: 'lootopia/config-files',
    files: CONFIG_FILES,
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/no-magic-numbers': 'off',
      'import-x/no-default-export': 'off',
      // Plugins are documented as `plugin.configs.x`, which these rules flag.
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
    },
  },

  {
    // Ambient module declarations must mirror the shape of the real package.
    name: 'lootopia/type-declarations',
    files: ['**/*.d.ts'],
    rules: {
      'import-x/no-default-export': 'off',
    },
  },

  // Must stay last: turns off every stylistic rule that Prettier owns.
  prettier,
  {
    // `curly: all` is compatible with Prettier and is re-enabled on purpose.
    name: 'lootopia/after-prettier',
    rules: {
      curly: ['error', 'all'],
    },
  },
);
