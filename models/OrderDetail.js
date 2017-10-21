var bookshelf = require('../config/bookshelf');

var OrderDetail = bookshelf.Model.extend({
  tableName: 'order_details',
  hasTimestamps: false,

  initialize: function () {
  }
});

module.exports = OrderDetail;
