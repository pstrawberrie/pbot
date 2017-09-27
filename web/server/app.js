const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const promisify = require('es6-promisify');
const flash = require('connect-flash');
const routes = require('./routes/index');
const helpers = require('./lib/helpers');
const errorHandlers = require('./handlers/errorHandlers');

const app = express();
const sessionStore = new session.MemoryStore;

// Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Handle Front-End Files
if (app.get('env') === 'development') {
  var webpack = require('webpack');
  var webpackDevMiddleware = require('webpack-dev-middleware');
  var webpackDevConfig = require('../webpack.dev.config');
  var compiler = webpack(webpackDevConfig);
  app.use(webpackDevMiddleware(compiler, {
      publicPath: webpackDevConfig.output.publicPath,
      stats: {colors: true}
  }));
} else {
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(compression());
}

// Library Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: false,
    resave: 'true',
    secret: 'secret'
}));
app.use(flash());

// App Global Middleware
app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.currentPath = req.path;
  next();
});

// App Routes
app.use('/', routes);

// Handle Errors
app.use(errorHandlers.notFound);
app.use(errorHandlers.flashValidationErrors);
if (app.get('env') === 'development') {
  app.use(errorHandlers.developmentErrors);
}
app.use(errorHandlers.productionErrors);


module.exports = app;
