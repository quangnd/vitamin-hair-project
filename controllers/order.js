var Product = require('../models/Product');
var Order = require('../models/Order');
var OrderDetail = require('../models/OrderDetail');
var OrderAddress = require('../models/OrderAddress');
var cityList = require('../models/City');
var async = require('async');
var config = require('../knexfile');
var knex = require('knex')(config);

/**
 * method: POST
 * url: api/order
 * params:
 */
exports.orderProduct = function(req, res, next) {
  req.assert('user_id', 'User is required').notEmpty();
  req.assert('address', 'Adress is required').notEmpty();
  req.assert('product_list', 'Product list is required').notEmpty();
  req.assert('address.district', 'District is required').notEmpty();
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
    .fetch()
    .then(function (result) {
      if (result) {
        var isProdTrial = data.product_list.filter(function(product) {
          return product.product_id === 1;
        });
        if (isProdTrial.length && result.toJSON().is_trial) {
          return res.status(400).send({ msg: 'You has been order product trial. Please don\'t order product trial again ' });
        }
      }
      new Order({
        user_id: data.user_id,
        status: 0
      })
      .save()
      .then(function (order) {
        async.parallel([
          function(callback) {
            var addressParams = data.address;
            addressParams.order_id = order.id;
            new OrderAddress(addressParams)
              .save()
              .then(function (orderAddress) {
                callback(null, 'success');
              })
              .catch(function (err) {
                callback('error', null);
              })
          },
          function(callback) {
            var orderDetailParams = data.product_list.map(function (result) {
              result.order_id = order.id;

              new OrderDetail(result)
                .save()
                .then(function (orderDetail) {
                  callback(null, 'success');
                })
                .catch(function (err) {
                  callback('error', null);
                })
            })
          }
        ],
        function(err, results) {
          if(err) {
            new OrderDetail({ order_id: order.id })
              .destroy()
              .then(function(orderDetail) {

              })
              .catch(function(err) {

              })

            new OrderAddress({ order_id: order.id })
              .destroy()
              .then(function(orderAddres) {

              })
              .catch(function(err) {

              })

            new Order({ id: order.id })
              .destroy()
              .then(function(order) {

              })
              .catch(function(err) {

              })

            return res.status(401).send({ msg: 'Has some error in process order!' });
          } else {
            return res.send({ msg: 'Your order has been successfully placed!' });
          }
        })
      })
      .catch(function (err) {
        return res.status(401).send(err);
      })
    })
}

exports.getListAll = function(req, res, next) {
  new Order()
    .orderBy('status', 'asc')
    .orderBy('created_at', 'desc')
    .fetchAll({ withRelated: ['user'] })
    .then(function(orders) {
      return res.send({ orders: orders });
    })
    .catch(function(err) {
      return res.status(401).send(err);
    })
}

/**
 * /GET /order/:user_id
 */
exports.getByUserId = function(req, res, next) {
  req.assert('user_id', 'User id is required').notEmpty();
  new Order()
    .query(function (qb) {
      qb.select(knex.raw('orders.id, orders.user_id, orders.created_at, sum(products.price*order_details.quality) as total_price, orders.status')) //'orders.id', 'orders.user_id', 'orders.created_at','products.price', '*' ,'order_details.quality', 'orders.status')
        .leftJoin('order_details', 'order_details.order_id', 'orders.id')
        .leftJoin('products', 'products.id', 'order_details.product_id')
        .where('orders.user_id', req.params.user_id)
        .groupBy('orders.id')
        .orderBy('orders.id', 'desc')
    })
    .fetchAll()
    .then(function(orders) {
      return res.send({ orders: orders });
    })
    .catch(function(err) {
      return res.status(401).send(err);
    })
}

exports.changeStatusOrderById = function(req, res, next) {

}

exports.getListCity = function(req, res, next) {
  return res.send ( {data: cityList.cityList} );
}
