module.exports = {
  parser: "@babel/eslint-parser",
  env: {
    browser: true,
    es2021: true,
  },
  // extends: 'airbnb',
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': ["error", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }],
    'import/prefer-default-export': 'off',
    'no-useless-escape': 'off',
    "import/no-cycle": "off",
    "import/no-named-as-default": "off",
    "import/no-named-as-default-member": "off",
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ["@", "."]
          ['models', '/src/models'],
          ['options', '/src/options'],
          ['components', '/src/options/components'],
          ['pages', '/src/options/pages'],
          ['assets', '/src/assets'],
          ['services', '/src/services'],
        ],
        extensions: ['.js', '.jsx', '.json']
      }
    }
  }
};
