var webpack = require('webpack');
var path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'qquery.min.js',
        path: path.resolve(__dirname),
    },
    plugins: [
        new MinifyPlugin({
            "keepFnName": true
        }, {})
    ],
    optimization: {
        minimizer: [
          new TerserPlugin({
            cache: true,
            parallel: true,
            sourceMap: true, // Must be set to true if using source-maps in production
            terserOptions: {
              // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
              keep_classnames: true,
                keep_fnames: true,
            }
          }),
        ],
      }

    
}