var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const seedProductsFromJson = require('./utils/seedProductsFromJson');
const factory = require('./utils/factory')();

const knex = require('./config/knex');

const productsRepository = require('./repositories/products.repository')(knex);
const productsController = require('./controllers/products.controller')(productsRepository);
const shoppingCartRepository = require('./repositories/shopping-cart.repository')(knex);
const shoppingCartController = require('./controllers/shopping-cart.controller')(shoppingCartRepository, productsRepository);

factory.setProductsRepository(productsRepository);
factory.setProductsController(productsController);
factory.setShoppingCartRepository(shoppingCartRepository);
factory.setShoppingCartController(shoppingCartController);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var shoppingCartRouter = require('./routes/shoppingCart');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/shopping-cart', shoppingCartRouter);

(async () => await seedProductsFromJson(productsRepository))(); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
