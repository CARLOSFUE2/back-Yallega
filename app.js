let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
let logger = require('morgan');


const cors= require('cors');
//imports routes
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let contactsRouter = require('./routes/contacts');
let clientsRouter = require('./routes/clients');
let requestRouter = require('./routes/request')

let app = express();
app.use(cors());

//conection mongodb
const mongoose = require('./config/database.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.all('*',function(req,res,next){
  res.header('Access-Control-Allow-Origin',"*");
  res.header('Access-Control-Allow-Headers', "X-Requested-With")
  next();

});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/contacts', contactsRouter);
app.use('/clients', clientsRouter);
app.use('/request',requestRouter);

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
