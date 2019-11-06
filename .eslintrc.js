module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    es6: true
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:jest/all",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
    "prettier/react"
  ],
  plugins: ["react", "@typescript-eslint"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    "react/jsx-filename-extension": [
      1,
      { extensions: [".js", ".jsx", ".ts", ".tsx"] }
    ],
    "import/prefer-default-export": 0,
    "@typescript-eslint/no-unused-vars": [2, { args: "none" }]
  }
};
