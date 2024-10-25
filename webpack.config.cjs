// Generated using webpack-cli https://github.com/webpack/webpack-cli
const ESLintPlugin = require("eslint-webpack-plugin");
const path = require("path");
const { parseArgs } = require("node:util");

const isProduction =
  parseArgs({
    args: process.argv.slice(2),
    options: { mode: { type: "string" } },
  }).values.mode == "production";

const config = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  target: "node",
  plugins: [new ESLintPlugin({ extensions: "ts" })],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        use: "ts-loader",
        exclude: ["/node_modules/"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
