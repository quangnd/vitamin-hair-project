var bookshelf = require('../config/bookshelf');

var City = bookshelf.Model.extend({
  tableName: 'cities',
  hasTimestamps: false,

  initialize: function () {
  }
});

module.exports = City;
