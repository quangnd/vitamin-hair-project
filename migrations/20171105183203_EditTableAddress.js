
exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema
      .table('cities', function (table) {
        table.dropColumn('time_ship');
      })
      .table('districts', function (table) {
        table.integer('time_ship');
      })
  ])
};

exports.down = function (knex, Promise) {
  return Promise.all([
    knex.schema
      .table('cities', function (table) {
        table.integer('time_ship');
      })
      .table('districts', function (table) {
        table.dropColumn('time_ship');
      })
  ])
};
