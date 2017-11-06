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

exports.listAllUser = function (req, res, next) {
  new User()
    .query(function (qb) {
      qb.select('id', 'name', 'email', 'phone_number', 'created_at')
    })
    .where('permission', '!=', constants.USER_DEACTIVE)
    .orderBy('created_at', 'desc')
    .fetchAll()
    .then(function (users) {
      return res.send({ users: users });
    })
    .catch(function (err) {
      return res.status(400).send(err);
    })
};

exports.userDetail = function (req, res, next) {
  req.assert('user_id', 'User_id không được trống.').notEmpty();

  new User({ id: req.params.user_id })
    .fetch()
    .then(function (user) {
      if (!user) {
        return res.status(401).send({ msg: 'User không tồn tại' });
      } else {
        return res.send({ user: user });
      }
    })
    .catch(function (err) {
      return res.status(400).send(err);
    })
}

exports.updateUser = function (req, res, next) {
  req.assert('user_id', 'User_id không được trống').notEmpty();

  var data = {
    name: req.body.name,
    gender: req.body.gender,
    permission: req.body.permission,
    address: req.body.address
  };

  new User({ id: req.body.user_id })
    .save(data, { patch: true })
    .then(function (result) {
      return res.send({ msg: 'Thay đổi thông tin người dùng thành công.' });
    })
    .catch(function (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(409).send({ msg: 'Email hoặc số điện thoại đã tồn tại.' });
      } else {
        return res.status(400).send();
      }
    })
};
