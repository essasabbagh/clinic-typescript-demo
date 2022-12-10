module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base',
    'plugin:prettier/reconmended',
    'plugin: import/errors',
    'plugin: import/warnings',
    'plugin: import/typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'import', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/quotes': [
      'error',
      'single',
      {
        allowTemplateLiterals: true,
      },
    ],

    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    // 'import/no-default-export': 'error',
    'no-console': 'off',
    'no-use-before-define': [
      'error',
      {
        functions: false,
        classes: true,
        variables: true,
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: false,
        classes: true,
        variables: true,
        typedefs: true,
      },
    ],
    'import/no-extraneous-dependencies': 'off',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
};
