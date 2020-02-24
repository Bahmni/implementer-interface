

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const srcPath = path.join(__dirname, './src');
const testPath = path.join(__dirname, './test');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  devtool: 'eval',
  entry: [
    './src/index.js',
    './styles/styles.scss',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/implementer-interface/',
  },
  devServer: {
    inline: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentBase: './dist',
    proxy: {
      '/openmrs': {
        target: 'https://192.168.33.10',
        secure: false,
      },
      '/bahmni': {
        target: 'https://192.168.33.10',
        secure: false,
      },
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('styles.css', { allChunks: true }),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, 'styles/fonts'), to: path.join(__dirname, '../dist/fonts'),
      },
    ], { copyUnmodified: true }
    ),
      new StyleLintPlugin(),
  ],
  externals: {
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
    'react/addons': true,
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src'),
      },
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        include: path.join(__dirname, 'test'),
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass'),
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      // the url-loader uses DataUrls.
      // the file-loader emits files.
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'file-loader?name=/styles/images/[name].[ext]',
      },
    ],
  },
  resolve: {
    alias: {
      common: `${srcPath}/common/`,
      'form-builder': `${srcPath}/form-builder/`,
      test: testPath,
    },
  },
};
