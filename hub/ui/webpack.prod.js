const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const path = require('path');

const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  output: {
    filename: 'bundle.js',
    library: 'workbench',
    path: path.resolve(__dirname, './assets/js'),
  },
  plugins: [new CleanWebpackPlugin()],
});
