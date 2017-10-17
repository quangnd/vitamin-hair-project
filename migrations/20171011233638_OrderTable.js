
exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('orders', function(table) {
        table.increments();
        table.integer('user_id').unsigned().index().references('id').inTable('users');
        table.integer('status').defaultTo(0);
        table.timestamps();
    })
    .createTable('order_details', function(table) {
        table.increments();
        table.integer('order_id').unsigned().index().references('id').inTable('orders');
        table.integer('product_id').unsigned().index().references('id').inTable('products');
        table.integer('quality').defaultTo(1);
    })
    .createTable('order_address', function(table) {
        table.increments();
        table.integer('order_id').unsigned().index().references('id').inTable('orders');
        table.string('country');
        table.string('city');
        table.string('address');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTableIfExists('order_address')
        .dropTableIfExists('order_details')
        .dropTableIfExists('orders');
};
