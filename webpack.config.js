const debug = process.env.NODE_ENV !== 'production';
const webpack = require('webpack');
const publicPath = 'dist';
const contentBase = 'docs';
const build = contentBase + '/' + publicPath;
const path = require('path');

module.exports = {
  context: __dirname,
  devtool: debug ? 'inline-sourcemap' : null,
  entry: './js/main.js',
  watch: true,
  output: {
    path: path.resolve(__dirname, contentBase),
    publicPath: publicPath,
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: contentBase,
    port: 3000
  },
  resolve : {
    alias: {
      modules: path.join(__dirname, 'node_modules')
    }
  },
  plugins: debug ? [] : [
    new webpack.ProvidePlugin({
      '$': 'jquery',
      'jQuery': 'jquery',
      'window.jQuery': 'jquery'
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false })
  ],
  module: {
    loaders: [
      { test: /\.css$/, loader: "style!css" },
      { test: /\.(jpe?g|png|gif)$/i, loader:"file" },
    ],
    rules: [{
        test: /\.css$/,
        use: [{loader: 'css-loader'}]
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader: [{loader: 'file-loader'}]
      },
      {
         test: /\.scss$/,
         use: [{
             loader: 'style-loader' // creates style nodes from JS strings
         }, {
             loader: 'css-loader' // translates CSS into CommonJS
         }, {
             loader: 'sass-loader' // compiles Sass to CSS
         }]
     }]
   }
};
