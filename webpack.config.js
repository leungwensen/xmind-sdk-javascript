const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  entry: {
    'dist/xmind': path.resolve(__dirname, './lib/index-browser.js'),
    'spec/index': path.resolve(__dirname, './spec/index.spec.js'),
  },
  output: {
    filename: '[name].js',
    library: 'xmind',
    libraryTarget: 'var',
    path: path.resolve(__dirname),
    publicPath: '/',
  },
  alias: {},
  resolveLoader: {},
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        loader: 'babel-loader',
        exclude: /locale/,
        query: {
          presets: [
            'es2015',
          ]
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
      },
      {
        test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i, // images
        loader: 'url?name=[path][name].[ext]'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/, // font files
        loader: 'url?name=[path][name].[ext]'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
    ]
  },
  externals: {
    'jquery': 'jQuery',
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {
        discardComments: {
          removeAll: true
        }
      },
      canPrint: true
    })
  ],
};
