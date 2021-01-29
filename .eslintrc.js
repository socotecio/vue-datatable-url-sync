module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "@vue/typescript"
  ],
  parserOptions: {
    parser: "@typescript-eslint/parser"
  },
  rules: {}
};
  