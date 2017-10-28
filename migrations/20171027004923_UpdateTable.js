
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('order_address', function(table) {
      table.string('note');
      table.renameColumn('country', 'district')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('order_address', function (table) {
      table.dropColumn('note');
      table.renameColumn('district', 'country')
    })
  ])
};
