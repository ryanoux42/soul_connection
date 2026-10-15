var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./src/routes/index');
var loginRouter = require('./src/routes/login/login');
var customerRouter = require('./src/routes/customer/customer');
var employeeRouter = require('./src/routes/employee/employee');
var tipsRouter = require('./src/routes/tip/tip');
var eventRouter = require('./src/routes/event/event');

var app = express();

const cors = require('cors');
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/customer', customerRouter.router);
app.use('/employee', employeeRouter.router);
app.use('/tip', tipsRouter.router);
app.use('/event', eventRouter.router);

// const { load_update_db } = require('./src/cron/load_db/load_db');
// var cron = require('node-cron');

// //cron each two hours update all the db
// cron.schedule('0 0 */2 * * *', function() {
//   load_update_db();
// });

// //at the start of the server update all the db
// load_update_db();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
