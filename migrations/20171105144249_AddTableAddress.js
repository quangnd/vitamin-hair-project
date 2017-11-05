
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('user_address', function (table) {
      table.increments();
      table.integer('user_id').unsigned().index().references('id').inTable('users');
      table.string('city');
      table.string('district');
      table.string('address');
    })
    .createTable('cities', function(table) {
      table.increments();
      table.string('name');
      table.integer('time_ship');
    })
    .createTable('districts', function(table) {
      table.increments();
      table.integer('city_id').unsigned().index().references('id').inTable('cities');
      table.string('name');
    })
  ])
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('user_address')
    .dropTableIfExists('districts')
    .dropTableIfExists('cities')
};
