import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import pluginPrettier from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['**/node_modules/**', '**/.next/**', '**/dist/**', '**/build/**', '**/coverage/**'],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    plugins: { prettier: pluginPrettier },
    rules: {
      'prettier/prettier': 'error',
    },
  },

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      import: importPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'import/order': [
        'warn',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: true,
      },
    },
  },

  {
    files: ['apps/web/**/*.{js,jsx,ts,tsx}'],
    rules: {},
  },

  {
    files: ['apps/api/**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-console': 'off',
    },
  },

  eslintConfigPrettier,
];
