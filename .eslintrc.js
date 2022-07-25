module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: [
    //"plugin:vue/vue3-essential",
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "@vue/typescript"
  ],

  parserOptions: {
    parser: '@typescript-eslint/parser'
  },

  plugins: [
    "typescript"
  ],

  rules: {
    'vue/no-unused-vars': 'off',
    "@typescript-eslint/no-unused-vars": [
      "error"
    ]
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
};
  
