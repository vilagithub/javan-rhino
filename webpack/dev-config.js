const path = require('path');
const webpack = require('webpack');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const variables = require('postcss-simple-vars');
const autoprefixer = require('autoprefixer');

const webpackIsomorphicToolsPlugin =
  new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools-configuration'))
  .development();

module.exports = {
  context: path.resolve(__dirname, '..'),
  entry: [
    'webpack-hot-middleware/client?path=http://localhost:3001/__webpack_hmr',
    'webpack/hot/only-dev-server',
    './src',
  ],
  output: {
    path: path.join(__dirname, '../public/static'),
    filename: 'bundle.js',
    publicPath: 'http://localhost:3001/static/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('style.css', { allChunks: true }),
    webpackIsomorphicToolsPlugin
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel'],
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          [
            'style-loader',
            'postcss-loader'
          ].join('!'),
          [
            loader(
              'css-loader',
              [
                'modules',
                'importLoaders=1',
                'localIdentName=[name]__[local]___[hash:base64:5]'
              ]
            ),
            'postcss-loader'
          ].join('!')
        )
      }
    ]
  },
  postcss: function () {
    return [variables, autoprefixer];
  }
};

function loader(name, options) {
  if (options.length > 0) {
    return name + '?' + options.join('&');
  }

  return name;
}
