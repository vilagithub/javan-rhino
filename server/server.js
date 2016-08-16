import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import util from 'util';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import Html from '../src/helpers/Html';
import webpackConfig from '../webpack/dev-config';

const app = Express();
const compiler = webpack(webpackConfig);

if (!(process.env.NODE_ENV === 'production')) {

  app.use(webpackDevMiddleware(compiler, {
    hot: true,
    noInfo: true,
    publicPath: webpackConfig.output.publicPath })
  );
  app.use(webpackHotMiddleware(compiler));

}

app.use(Express.static('public'));

app.get('/', function (req, res) {
  res.send('<!doctype html>\n' +
    ReactDOM.renderToString(<Html />));
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  const host = server.address().address;
  const port = server.address().port;

  util.log('try-auth app listening at http://%s:%s', host, port);
});
