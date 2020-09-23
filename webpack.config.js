var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'qquery.min.js',
        path: path.resolve(__dirname),
    },
}