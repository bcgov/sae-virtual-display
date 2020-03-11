const webpack = require('webpack');
const path = require('path');

const { version } = require('./package.json');

const srcDir = path.resolve(__dirname, 'src');

module.exports = {
  resolve: {
    alias: {
      '@src': srcDir,
    },
    extensions: ['.js', '.jsx', '.css'],
    modules: ['node_modules', srcDir],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(version),
    }),
  ],
  stats: {
    colors: true,
  },
};
