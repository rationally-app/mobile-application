module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:jest/all",
    "plugin:prettier/recommended",
  ],
  plugins: ["react", "@typescript-eslint", "react-hooks"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "react/jsx-filename-extension": [
      1,
      { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    ],
    "react/prop-types": 0,
    "react/jsx-boolean-value": [1, "always"],
    "import/prefer-default-export": 0,
    "@typescript-eslint/no-unused-vars": [2, { args: "none" }],
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/explicit-function-return-type": [
      "warn",
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      },
    ],
    "jest/no-hooks": 0,
    "jest/lowercase-name": 0,
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    "no-duplicate-imports": "error",
  },
  overrides: [
    {
      files: [
        "**/*.test.tsx",
        "storybook/**/*.tsx",
        "*.tsx",
        "*.ts",
        "**/*.tsx",
      ],
      rules: {
        "@typescript-eslint/no-empty-function": "off",
        "jest/prefer-strict-equal": "off",
        "jest/require-hook": "off",
      },
    },
  ],
  settings: {
    react: {
      version: "detect",
    },
  },
};
