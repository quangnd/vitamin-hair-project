var Product = require('../models/Product');
var Order = require('../models/Order');
var OrderDetail = require('../models/OrderDetail');
var OrderAddress = require('../models/OrderAddress');
var City = require('../models/City');
var District = require('../models/District');
var async = require('async');
var config = require('../knexfile');
var knex = require('knex')(config);
var constant = require('../utilities/constants');
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
        .where('order_details.product_id', constant.PRODUCT_TRIAL_ID)
    })
    .fetch()
    .then(function (result) {
      var isProdTrial = data.product_list.filter(function (product) {
        return product.product_id === constant.PRODUCT_TRIAL_ID;
      });

      if (isProdTrial.length && result.toJSON().is_trial) {
        return res.status(400).send({ msg: 'Bạn đã đặt sản phẩm dùng thử rồi. Xin vui lòng không đặt tiếp.' });
      }

      if (isProdTrial.length && result) {
        return res.status(400).send({ msg: 'Đơn đặt hàng sản phẩm dùng thử của bạn đang được xử lý. Vui lòng không đặt lại và theo dõi trong mục quản lý đơn hàng.' });
      }

      new Order({
        user_id: data.user_id,
        status: constant.ORDER_STATUS_PENDING
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

            return res.status(401).send({ msg: 'Đã có vài lỗi trong quá trình xử lý đơn hàng của bạn. Vui lòng thử lại' });
          } else {
            return res.send({ msg: 'Đơn hàng của bạn đã được đặt thành công. Xin vui lòng theo dõi trạng thái đơn hàng tại mục Quản lý đơn hàng!' });
          }
        })
      })
      .catch(function (err) {
        return res.status(401).send(err);
      })
    })
}

/**
 * /GET /order/:user_id
 */
exports.getByUserId = function(req, res, next) {
  new Order()
    .query(function (qb) {
      qb.select(knex.raw('orders.id, orders.user_id, orders.created_at, sum(products.price*order_details.quality) as total_price, orders.status, orders.updated_at')) //'orders.id', 'orders.user_id', 'orders.created_at','products.price', '*' ,'order_details.quality', 'orders.status')
        .leftJoin('order_details', 'order_details.order_id', 'orders.id')
        .leftJoin('products', 'products.id', 'order_details.product_id')
        .where('orders.user_id', req.user.id)
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
/**
 * /PUT /api/order
 */
exports.cancelOrder = function(req, res, next) {
  req.assert('order_id', 'Order Id không được rỗng').notEmpty();

  new Order({ id: req.body.order_id })
    .fetch()
    .then(function(response) {
      if(response.toJSON().user_id !== req.user.id) {
        return res.status(400).send({ msg: "Đơn hàng này không phải của bạn." });
      }

      if (response.toJSON().status === constant.ORDER_STATUS_PENDING) {
        new Order({ id: req.body.order_id })
          .save({ status: constant.ORDER_STATUS_CANCEL }, { patch: true })
          .then(function(response) {
            return res.send({ msg: "Hủy đơn hàng thành công." });
          })
          .catch(function(err) {
            return res.status(401).send({ msg: "Có lỗi trong quá trình hủy đơn hàng. Xin vui lòng thử lại." });
          })
      } else if (response.toJSON().status === constant.ORDER_STATUS_CANCEL){
        return res.status(400).send({ msg: "Đơn hàng này đã được hủy rồi. Xin vui lòng không hủy lại" });
      } else {
        return res.status(400).send({ msg: "Đơn hàng của bạn đang trong quá trình xử lý nên không thể hủy." });
      }
    })
    .catch(function(err) {
      return res.status(401).send({ msg: "Có lỗi trong quá trình hủy đơn hàng. Xin vui lòng thử lại." });
    })
}

exports.getListCity = function(req, res, next) {
  async.parallel([
    function(callback) {
      new City()
        .fetchAll()
        .then(function(cities) {
          callback(null, cities);
        })
        .catch(function(err) {
          callback('error', null);
        })
    },
    function (callback) {
      new District()
        .fetchAll()
        .then(function (districts) {
          callback(null, districts);
        })
        .catch(function (err) {
          callback('error', null);
        })
    }
    ],
    function (err, results) {
      if(err) {
        console.log(err);
        return res.status(400).send({ msg: "Có lỗi trong quá trình tải dữ liệu. Xin vui lòng thử lại." });
      }
      return res.send({ cities: results[0], districts: results[1] });
  })
}
