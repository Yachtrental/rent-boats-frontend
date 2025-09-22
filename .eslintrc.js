module.exports = {
  root: true,
  extends: ['react-app'],
  env: { browser: true, es2021: true },
  parserOptions: { ecmaVersion: 12, sourceType: 'module' },
  rules: {
    'no-unused-vars': 'warn',
    'react/react-in-jsx-scope': 'off'
  }
};
