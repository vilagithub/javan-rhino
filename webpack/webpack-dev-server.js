var Express = require('express');
var util = require('util');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware  = require('webpack-hot-middleware');
var webpackConfig = require('./dev-config');

var app = Express();
var compiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler, {
  contentBase: 'http://localhost:3001',
  hot: true,
  noInfo: true,
  headers: { 'Access-Control-Allow-Origin': '*' },
  publicPath: webpackConfig.output.publicPath })
);

app.use(webpackHotMiddleware(compiler));

app.use(Express.static('public'));

var port = process.env.PORT || 3001;
var address = process.env.ADDRESS || 'localhost';

var server = app.listen(port, address, () => {
  var host = server.address().address;
  var port = server.address().port;

  util.log('🚧  WebPack development server listening on http://%s:%s 🚧', host, port);
});
