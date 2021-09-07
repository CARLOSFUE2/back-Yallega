let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
let logger = require('morgan');
const {notification} = require('./controllers/notifications');



const cors= require('cors');
//imports routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const clientsRouter = require('./routes/clients');
const requestRouter = require('./routes/request');
const billingRouter = require('./routes/billing');
const deliverRouter = require('./routes/deliver');
const paymentRouter = require('./routes/payment');
const generalRouter = require('./routes/general');
const contactRouter = require('./routes/contact');
const messageRouter = require('./routes/message');
const tokenRouter = require('./routes/tokens');

const app = express();
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
app.use('/clients', clientsRouter);
app.use('/request',requestRouter);
app.use('/billing', billingRouter);
app.use('/deliver', deliverRouter);
app.use('/payment', paymentRouter );
app.use('/general', generalRouter );
app.use('/contact', contactRouter );
app.use('/messages', messageRouter );
app.use('/tokens', tokenRouter );

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

//ejecucion del servidor
app.set('port',process.env.PORT|| 3000)

const server = app.listen(app.get('port'),()=>{
  console.log('server on port ' +  app.get('port'))
}) 


//sockets
let io = require('socket.io')(server,{
  cors:{
    origin: '*',
  }
});

io.on('connection', (socket)=>{
  console.log('new Conecction ' + socket.id );

  socket.on('new-message', (data)=>{
    io.sockets.emit('new-message',data)
  })
  socket.on('new-request', (request)=>{
    io.sockets.emit('new-request',request)
  })
  socket.on('changeStatusRequest', (request)=>{
    io.sockets.emit('changeStatusRequest',request)
  })
  socket.on('new-contact', (contact)=>{
    io.sockets.emit('new-contact',contact)
  })
  socket.on('new-message-chat', (message)=>{
    io.sockets.emit('new-message-chat',message)
  })
})
