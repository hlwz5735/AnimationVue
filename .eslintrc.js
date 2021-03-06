module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/recommended',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  rules: {
    indent: ['off'],
    'no-useless-constructor': ['off'],
    'no-dupe-class-members': ['off'],
    'space-before-function-paren': ['off', 'never'],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    '@typescript-eslint/no-non-null-assertion': ['off']
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
  }
}
