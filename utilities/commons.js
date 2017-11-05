var jwt = require('jsonwebtoken');
var moment = require('moment');

module.exports = {

  generateToken: function (user) {
    //TODO Replace iss value when release
    var payload = {
      iss: 'my.domain.com1',
      sub: user.id,
      permission: user.permission,
      iat: moment().unix(),
      exp: moment().add(7, 'days').unix()
    };
    return jwt.sign(payload, process.env.TOKEN_SECRET);
  },

  getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
  },

  buildDateTime: function () {
      var date = new Date();
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  },

  getUrl: function (req) {
      return req.protocol + '://' + req.get('host');
  },

  getAppUrl: function (req) {
      return req.protocol + '://' + req.get('host') + req.originalUrl;
  },

  isUrlValid: function (userInput) {
      var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
      if (res == null) {
          return false;
      }
      return true;
  },

  getParameterByName: function (name, url) {
      name = name.replace(/[\[\]]/g, '\\$&');
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'), results = regex.exec(url);
      if (!results) {
          return null;
      }
      if (!results[2]) {
          return '';
      }

      return decodeURIComponent(results[2].replace(/\+/g, ' '));
  },

  checkPhoneFormat: function(phone) {
    var regEx = /^0(1\d{9,10}|9\d{8,9})$/;
    return regEx.test(phone);
  },

  checkEmailFormat: function(email) {
    var regEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return regEx.test(email);
  },

  checkUsername: function(username) {
    return this.checkEmailFormat(username) || this.checkPhoneFormat(username);
  }
};
