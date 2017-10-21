var bookshelf = require('../config/bookshelf');

var Product = bookshelf.Model.extend({
  tableName: 'products',
  hasTimestamps: true,

  initialize: function () {
  }
});

module.exports = Product;
