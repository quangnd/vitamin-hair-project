var bookshelf = require('../config/bookshelf');

var District = bookshelf.Model.extend({
  tableName: 'districts',
  hasTimestamps: false,

  initialize: function () {
  }
});

module.exports = District;
