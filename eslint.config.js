import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default defineConfig([
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    ignores: [
      'node_modules/**', // Ignore node_modules
      'dist/**', // Ignore build output
      'build/**', // Ignore build output
      '**/*.test.js', // Ignore test files
      'src-tauri/**', // Ignore Tauri source
      'package.lock.json', // Ignore lock file
    ],
  },
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    // languageOptions: { globals: globals.browser },
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: { js, prettier: prettierPlugin },
    extends: ['js/recommended', prettier],
    rules: {
      'prettier/prettier': 'error', // Enforce Prettier rules as ESLint errors
      'react/react-in-jsx-scope': 'off', // React is always in scope
      'prefer-const': ['error', { ignoreReadBeforeAssign: true }],
    },
  },
  {
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
  },
]);
