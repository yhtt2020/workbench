const path = require("path");
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
  optimization: {
    minimize: false
  },
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: "xtbSdk.js",
    library: 'xtb-SDK',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          },
        },
      }
    ],
  },
  plugins: [
    new ProgressBarPlugin()
  ]
};
