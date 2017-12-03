const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: __dirname + '/template/js/index.js',
  output: {
    path: __dirname + '/lib/js/',
    filename: 'template.min.js'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                'es2015', 'stage-3'
              ],
              "plugins": [
                [
                  "transform-runtime", {
                    "helpers": false,
                    "polyfill": true,
                    "regenerator": true,
                    "moduleName": "babel-runtime"
                  }
                ]
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: []
};
