const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './assets',
  },
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    library: 'workbench',
    // libraryExport: 'MyModule',
    path: path.resolve(__dirname, './assets/js'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      template: './templates/index.html',
    }),
  ],
});
