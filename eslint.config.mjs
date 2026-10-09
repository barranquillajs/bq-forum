import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default [
  {
    ignores: ['dist/', 'coverage/', 'node_modules/', '.astro/'],
  },
  ...astro.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx,mts,cts}'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
    },
    rules: {
      'no-console': [
        'warn',
        {
          allow: ['error'],
        },
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
  {
    files: ['**/*.astro'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      'no-console': [
        'warn',
        {
          allow: ['error'],
        },
      ],
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
];
