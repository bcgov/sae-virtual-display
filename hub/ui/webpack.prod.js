const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const merge = require('webpack-merge');

const common = require('./webpack.common');

module.exports = merge({
  mode: 'production',
  plugins: [new CleanWebpackPlugin(['dist'])],
});
