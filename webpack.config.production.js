/**
 * Build config for electron 'Renderer Process' file
 */

import path from 'path';
import webpack from 'webpack';
import validate from 'webpack-validator';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import BabiliPlugin from 'babili-webpack-plugin';
import baseConfig from './webpack.config.base';

export default validate(merge(baseConfig, {
  devtool: 'cheap-module-source-map',

  entry: {
    bundle: [
      'babel-polyfill',
      './app/index'
    ],
    "capture-screen": [
      'babel-polyfill',
      './app/views/windows/capture-screen'
    ]
  },

  output: {
    path: path.join(__dirname, 'app/dist'),
    publicPath: '../dist/',
    filename: '[name].js',
  },

  module: {
    loaders: [
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
      },

      // Fonts
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' },

      // Images
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
        loader: 'url-loader'
      }
    ]
  },

  plugins: [
    // for bindings package, see https://github.com/rwaldron/johnny-five/issues/1101#issuecomment-213581938
    new webpack.ContextReplacementPlugin(/bindings$/, /^$/),

    // https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
    // https://github.com/webpack/webpack/issues/864
    new webpack.optimize.OccurrenceOrderPlugin(),

    // NODE_ENV should be production so that modules do not perform certain development checks
    new webpack.DefinePlugin({
      DEBUG: false,
      'process.env.NODE_ENV': JSON.stringify('production')
    }),

    // new BabiliPlugin(),

    new ExtractTextPlugin('style.css', { allChunks: true }),

    new HtmlWebpackPlugin({
      filename: '../app.html',
      template: 'app/app.html',
      inject: false
    })
  ],

  externals: ['bindings'],

  // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
  target: 'electron-renderer'
}));
