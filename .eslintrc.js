module.exports = {
  root: true,
  extends: '@react-native',
  env: { jest: true },
  rules: {
    indent: ['error', 2, { VariableDeclarator: 1 }],
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true,
      },
    ],
  },
  plugins: ['unused-imports', 'prettier'],
};
