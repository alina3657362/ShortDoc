import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
    { ignores: ['dist', 'build', 'node_modules', '*.config.js', '*.config.ts'] },

    js.configs.recommended,
    ...tseslint.configs.recommended,

    {
      files: ['**/*.{ts,tsx}'],
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: tseslint.parser,
        parserOptions: {
          project: './tsconfig.eslint.json',
          tsconfigRootDir: import.meta.dirname,
        },
        globals: {
          ...globalThis.browser,
        },
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
      plugins: {
        react,
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
      },
      rules: {
        // React
        ...react.configs.recommended.rules,
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',

        // React Hooks
        ...reactHooks.configs.recommended.rules,

        // React Refresh (для Vite)
        'react-refresh/only-export-components': 'warn',

        // TypeScript
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',

        // Общие правила
        'no-console': 'warn',
        'no-debugger': 'error',
        'prefer-const': 'error',
        'eqeqeq': ['error', 'always'],
      },
    }
);
