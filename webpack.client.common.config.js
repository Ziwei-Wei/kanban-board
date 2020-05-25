const path = require("path");

const clientCommon = {
  entry: path.resolve(__dirname, "src/client/index.tsx"),
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ["babel-loader", "ts-loader", "stylelint-custom-processor-loader"]
      },
      {
        test: /\.css$/,
        use: ["css-loader"]
      },
      {
        test: /\.(png|jpg|mp4|ttf)$/,
        use: ["file-loader"]
      }
    ]
  }
};

module.exports = clientCommon;
