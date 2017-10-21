var bookshelf = require('../config/bookshelf');
/*
- hasTimestamps: true will enable auto update created_at and updated_at
*/
var User = require('./User');

var Order = bookshelf.Model.extend({
  tableName: 'orders',
  hasTimestamps: true,

  initialize: function () {
  },

  user: function() {
    return this.belongsTo(User);
  }
});

module.exports = Order;
