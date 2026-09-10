import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['coverage/**', 'dist/**', 'src-tauri/target/**', '.agents/**', '.codex/**'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs}'],
    languageOptions: { ecmaVersion: 2022, sourceType: 'module' },
    linterOptions: { reportUnusedDisableDirectives: 'error' },
    rules: { eqeqeq: ['error', 'always'], 'no-var': 'error', 'prefer-const': 'error' }
  },
  { files: ['src/**/*.js'], languageOptions: { globals: globals.browser } },
  { files: ['*.{js,mjs}', 'test/**/*.js'], languageOptions: { globals: globals.node } }
];
