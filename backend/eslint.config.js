import globals from 'globals';
import pluginJs from '@eslint/js';
import jestPlugin from 'eslint-plugin-jest';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  pluginJs.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      ...jestPlugin.configs.recommended.rules,
    },
  },
  {
    ignores: ['node_modules/', 'coverage/', 'dist/', 'bin/'],
  },
];
