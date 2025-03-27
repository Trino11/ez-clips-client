import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default defineConfig([
  {
    ignores: [
      'node_modules/**', // Ignore node_modules
      'dist/**', // Ignore build output
      'build/**', // Ignore build output
      '**/*.test.js', // Ignore test files
      'src-tauri/**', // Ignore Tauri source
    ],
  },
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: { globals: globals.browser },
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
    },
  },
  {
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]);
