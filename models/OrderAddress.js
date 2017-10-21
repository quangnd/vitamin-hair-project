var bookshelf = require('../config/bookshelf');

var OrderAddress = bookshelf.Model.extend({
  tableName: 'order_address',
  hasTimestamps: false,

  initialize: function () {
  }
});

module.exports = OrderAddress;
