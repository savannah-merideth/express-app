const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const { JwtMiddleware } = require('./middleware');

const main = require('./routes/index');
const books = require('./routes/books');
const users = require('./routes/users');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));

// use the cookie-parser to help with auth token, 
// it must come before the JwtMiddleware
app.use(cookieParser());
//for all route
// app.use(JwtMiddleware);

app.use('/', main);
app.use('/books', books);
app.use('/users', users);



// catch 404 Not found middleware
app.use((req, res, next) => {
  console.log('Not found', req.url);
  const err = new Error(`The page requested does not exist.`);
  res.status(404).render('page-not-found', { err });
})

//Global error middleware handler
app.use(function(err, req, res, next) {
  // console.log('Global error', err);
  if (err && err.status === 404) {
    err.message = `The page requested does not exist.`
    res.status(404).render('page-not-found', { err });
  } else {
    if (!err.message)
      err.message = `Ooops! It looks like something went wrong on the server.`
    res.status(err.status || 500).render('server-error', { err });
  }
});



module.exports = app;
