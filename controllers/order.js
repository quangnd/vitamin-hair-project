var Product = require('../models/Product');
var Order = require('../models/Order');
var OrderDetail = require('../models/OrderDetail');
var OrderAddress = require('../models/OrderAddress');
var cityList = require('../models/City');

/**
 * method: POST
 * url: api/order
 * params:
 */
exports.orderProduct = function(req, res, next) {
  req.assert('user_id', 'User is required').notEmpty();
  req.assert('address', 'Adress is required').notEmpty();
  req.assert('product_list', 'Product list is required').notEmpty();
  req.assert('address.country', 'Country is required').notEmpty();
  req.assert('address.city', 'City is required').notEmpty();
  req.assert('address.address', 'Address is required').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    return res.status(400).send(errors);
  }

  var data = req.body;

  new Order()
    .query(function (qb) {
      qb.select('user_id', 'product_id', 'is_trial')
        .leftJoin('order_details', 'order_details.order_id', 'orders.id')
        .leftJoin('products', 'products.id', 'order_details.product_id')
        .where('orders.user_id', data.user_id)
        .where('is_trial', 1)
    })
    .count()
    .then(function (rs) {
      if(rs) {
        return res.status(400).send({ msg: 'You has been order product trial. Please don\'t order product trial again ' });
      } else {
        new Order({
          user_id: data.user_id,
          status: 0
        })
        .save()
        .then(function (order) {
          var addressParams = data.address;
          addressParams.order_id = order.id;
          new OrderAddress(addressParams)
            .save()
            .then(function (orderAddress) {

            })
            .catch(function (err) {
              return res.status(401).send(err);
            })

          var orderDetailParams = data.product_list.map(result => {
            result.order_id = order.id;
            new OrderDetail(result)
              .save()
              .then(function (orderDetail) {

              })
              .catch(function (err) {
                return res.status(401).send(err);
              })
          })

          return res.send({ msg: 'Your order has been successfully placed!' });
        })
        .catch(function (err) {
          return res.status(401).send(err);
        })
      }
    })
}

exports.getListAll = function(req, res, next) {
  new Order()
    .orderBy('status', 'asc')
    .orderBy('created_at', 'desc')
    .fetchAll({ withRelated: ['user'] })
    .then(function(orders) {

      return res.send({ orders });
    })
    .catch(function(err) {
      return res.status(401).send(err);
    })
}

/**
 *
 */
exports.getByUserId = function(req, res, next) {
  req.assert('user_id', 'User id is required').notEmpty();
  new Order()
    .where('user_id', req.params.user_id)
    .fetchAll()
    .then(function(orders) {
      return res.send({ orders });
    })
    .catch(function(err) {
      return res.status(401).send(err);
    })
}

exports.getListCity = function(req, res, next) {
  return res.send ( {data: cityList.cityList} );
}
