const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: __dirname +config.from+ '/'+config.name'.js',
  output: {
    path: __dirname + config.to,
    filename: config.name+'.min.js'
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
