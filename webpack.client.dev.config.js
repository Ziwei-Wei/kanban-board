const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");

const clientCommon = require("./webpack.client.common.config");

const clientDevelopment = {
  ...clientCommon,
  mode: "development",
  devtool: "inline-source-map",
  output: {
    path: path.resolve("./dist/public"),
    filename: "[name].js"
  },
  plugins: [
    new CleanWebpackPlugin({cleanStaleWebpackAssets: false}),
    new HtmlWebpackPlugin({
      template: path.resolve("./src/client/template.html")
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    })
  ],
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false
  },
  devServer: {
    contentBase: "./dist/public",
    hot: true
  }
};

module.exports = clientDevelopment;
