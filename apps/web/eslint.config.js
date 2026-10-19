import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat['recommended-latest'],
      jsxA11y.flatConfigs.recommended,
    ],
    plugins: { 'react-refresh': reactRefresh },
    languageOptions: { ecmaVersion: 2022, globals: globals.browser },
    rules: {
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      // 팀 규칙: 제어문 중첩 1단계, 중첩 삼항 금지, 함수 본문 120줄 상한
      'max-depth': ['error', 1],
      'no-nested-ternary': 'error',
      'max-lines-per-function': ['warn', { max: 120, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    // 팀 규칙: src 안에서는 default export 대신 named export만 쓴다
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        { selector: 'ExportDefaultDeclaration', message: 'default export 대신 named export를 쓴다.' },
      ],
    },
  },
]);
