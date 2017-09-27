const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractLESS = new ExtractTextPlugin(
  { filename:'bundle.min.css', disable:false, allChunks: true }
);

// Webpack Production Config
module.exports = {

  context: path.join(__dirname, '_dist'), // copy-webpack-plugin output path
  entry: [
    path.join(__dirname, "../../client/scripts/app.js"), // react,cjs -> js
    path.join(__dirname, "../../client/styles/index.js") // less -> css
  ],

  output: {
    path: path.join(__dirname, '../../_dist'),
    filename: 'bundle.min.js'
  },

  module: {
    loaders: [
      { test: /\.less$/,  exclude: /node_modules/, loader: extractLESS.extract(['css-loader','less-loader']) },
      { test: /\.(js|jsx)$/i, exclude: /node_modules/, loader: 'babel-loader', query: {presets: ['env']} },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /.*\.(gif|png|jpe?g|svg)$/i, loaders: [
        'file?name=images/[name].[ext]',
        'image-webpack' //add compression config here in the future
      ]}
    ]
  },

  plugins: [
    extractLESS,
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') }
    }),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      compress: { warnings: false }
    }),
    new CopyWebpackPlugin([
      {from: path.join(__dirname, "../../client/images"), to: "images"},
      {from: path.join(__dirname, "../../client/fonts"), to: "fonts"}
    ])
  ]

};
