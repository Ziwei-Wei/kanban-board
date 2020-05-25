const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

const server = {
  entry: path.resolve(__dirname, "src/server/index.ts"),
  output: {
    path: path.resolve("./dist"),
    filename: "index.js"
  },
  target: "node",
  devtool: false,
  externals: [nodeExternals()],
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: path.resolve(__dirname, "src/client"),
        use: ["ts-loader"]
      }
    ]
  },
  plugins: [new CleanWebpackPlugin()]
};

module.exports = server;
