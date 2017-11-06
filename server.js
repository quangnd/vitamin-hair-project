var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var request = require('request');

// Models
var User = require('./models/User');

// Normal Controllers
var userController = require('./controllers/user');
var contactController = require('./controllers/contact');
var orderController = require('./controllers/order');

// Admin Controller
var adminUserController = require('./controllers/admins/user');

var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");
  next();
});

app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
if (app.get('env') !== 'production') {
  // Load environment variables from .env file
  dotenv.load();
  app.use(require('connect-livereload')({
    port: 35729
  }));
}
app.use(function(req, res, next) {
  req.isAuthenticated = function() {
    var token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || req.cookies.token;
    try {
      return jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
      return false;
    }
  };

  if (req.isAuthenticated()) {
    var payload = req.isAuthenticated();
    new User({ id: payload.sub })
      .fetch()
      .then(function(user) {
        req.user = user.toJSON();
        next();
      });
  } else {
    next();
  }
});

app.post('/contact', contactController.contactPost);
app.put('/account', userController.ensureAuthenticated, userController.accountPut);
app.delete('/account', userController.ensureAuthenticated, userController.accountDelete);
app.post('/signup', userController.signupPost);
app.post('/login', userController.loginPost);
app.post('/forgot', userController.forgotPost);
app.post('/reset', userController.resetPost);
app.post('/checkUserIdentify', userController.checkEmailPhone);
app.get('/unlink/:provider', userController.ensureAuthenticated, userController.unlink);
app.post('/auth/facebook', userController.authFacebook);
app.get('/auth/facebook/callback', userController.authFacebookCallback);
app.post('/auth/google', userController.authGoogle);
app.get('/auth/google/callback', userController.authGoogleCallback);

app.post('/api/order', userController.ensureAuthenticated, orderController.orderProduct);
app.get('/api/order', userController.ensureAuthenticated, orderController.getByUserId);
app.put('/api/order', userController.ensureAuthenticated, orderController.cancelOrder);

app.get('/api/city', orderController.getListCity);

// BEGIN ADMIN ROUTER
app.post('/admin/login', adminUserController.adminEnsureAuthenticated, adminUserController.loginPost);
app.get('/admin/listuser', adminUserController.adminEnsureAuthenticated, adminUserController.listAllUser);
app.get('/admin/userdetail/:user_id', adminUserController.adminEnsureAuthenticated, adminUserController.userDetail);
app.post('/admin/edituser', adminUserController.adminEnsureAuthenticated, adminUserController.updateUser);
// END ADMIN ROUTER

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'app', 'index.html'));
});

app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});

// Production error handler
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);  // eslint-disable-line no-console
    res.sendStatus(err.status || 500);
  });
}

app.listen(app.get('port'), function() {
  console.log('----------------------------------------');            // eslint-disable-line no-console
  console.log('Express server listening on port ' + app.get('port')); // eslint-disable-line no-console
  console.log('----------------------------------------');            // eslint-disable-line no-console
});

module.exports = app;
