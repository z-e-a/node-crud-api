module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    "dist",
    ".eslintrc.cjs",
    "*config.js",
    "tsconfig.json",
    "webpack.config.cjs",
    "__tests__",
  ],
  rules: {
    "no-plusplus": "off",
    "no-console": "off",
    "no-debugger": "warn",
    "@typescript-eslint/no-explicit-any": ["warn"],
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "max-len": ["warn", { code: 120 }],
    indent: [
      "warn",
      2,
      {
        SwitchCase: 1,
      },
    ],
  },
};
