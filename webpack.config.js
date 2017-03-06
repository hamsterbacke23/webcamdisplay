// const debug = process.env.NODE_ENV !== 'production';
const debug = false;
const webpack = require('webpack');
const path = require('path');

const contentBase = 'docs';

module.exports = {
  context: __dirname,
  devtool: debug ? 'inline-sourcemap' : false,
  entry: './js/main.js',
  output: {
    path: path.resolve(__dirname, contentBase),
    filename: 'bundle.js',
  },
  devServer: {
    contentBase,
    port: 3000,
  },
  resolve: {
    alias: {
      modules: path.join(__dirname, 'node_modules'),
      'jquery-ui': path.join(__dirname, 'node_modules/jquery-ui'),
    },
  },
  plugins: [],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: [__dirname + '/node_modules/', __dirname + '/js/vendor/'],
        loaders: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: [__dirname + '/node_modules/', __dirname + '/js/vendor/'],
        query: {
          presets: ['es2015']
        },
        loaders: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [{ loader: 'file-loader' }],
      },
      {
        test: /\.html$/,
        use: [
          'file-loader?name=[name].[ext]',
          'extract-loader?publicPath=../',
          'html-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
        }, {
          loader: 'sass-loader',
        }],
      }],
  },
};
