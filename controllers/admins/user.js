var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var request = require('request');
var qs = require('querystring');
var shortid = require('shortid');
var User = require('../../models/User');
var common = require('../../utilities/commons');
var constants = require('../../utilities/constants');
var userController = require('../user');
/**
 * POST /login
 * Sign in with email and password
 */
exports.loginPost = function (req, res, next) {
  req.assert('username', 'Email or phone number cannot be blank').notEmpty();
  req.assert('password', 'Password cannot be blank').notEmpty();
  // req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  if (req.body.username) {
    if (!common.checkUsername(req.body.username)) {
      return res.status(400).send({ msg: 'Email or phone number is not valid.' });
    }
  }

  new User()
    .query({ where: { email: req.body.username }, orWhere: { phone_number: req.body.username } })
    .fetch()
    .then(function (user) {
      if (!user) {
        return res.status(401).send({
          msg: 'The email address or phone number ' + req.body.username + ' is not associated with any account. ' +
          'Please check email or phone number and try again.'
        });
      }
      if (user.toJSON().permission === constants.USER_NORMAL) {
        return res.status(401).send({ msg: 'You are not Administrator' });
      }
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (!isMatch) {
          return res.status(401).send({ msg: 'The password does not match this email or phone number' });
        }
        res.send({ token: common.generateToken(user), user: user.toJSON() });
      });
    });
};

