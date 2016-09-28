var path = require('path')
var webpack = require('webpack')

var entry = ['./example/index.js']

if (process.env.NODE_ENV === 'development') {
  entry = entry.concat([
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server'
  ])
}

var webpackConfig = {
  devtool: 'eval',
  entry: entry,
  output: {
    path: path.join(__dirname, 'example'),
    filename: 'bundle.js',
    publicPath: '/example/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['react-hot', 'babel'],
      exclude: /build|lib|node_modules/
    }]
  }
}
// ------------------------------------
// Style Loaders
// ------------------------------------
// We use cssnano with the postcss loader, so we tell
// css-loader not to duplicate minimization.
const BASE_CSS_LOADER = 'css?sourceMap&-minimize'

webpackConfig.module.loaders.push({
  test    : /\.scss$/,
  exclude : null,
  loaders : [
    'style',
    BASE_CSS_LOADER
  ]
})
webpackConfig.module.loaders.push({
  test    : /\.css$/,
  exclude : null,
  loaders : [
    'style',
    BASE_CSS_LOADER
  ]
})

module.exports = webpackConfig
