exports.up = function (knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function (table) {
      table.increments();
      table.string('name');
      table.string('email', 128).notNullable().unique();
      table.string('phone_number', 11).notNullable().unique();
      table.string('referral_key').notNullable().unique();
      table.string('password');
      table.string('passwordResetToken');
      table.dateTime('passwordResetExpires');
      table.string('gender');
      table.string('address');
      table.boolean('is_referral').defaultTo(false);
      table.string('picture');
      table.string('facebook');
      table.string('google');
      table.float('credit');
      table.integer('permission').defaultTo(0);
      table.timestamps();
    })
    .createTable('products', function (table) {
      table.increments();
      table.string('name');
      table.float('price');
      table.text('description');
      table.string('images');
      table.boolean('is_trial').defaultTo(false);
      table.timestamps();
    })
    .createTable('stores', function (table) {
      table.increments();
      table.string('name');
      table.string('address');
      table.string('lat');
      table.string('long');
      table.boolean('status');
    })
    .createTable('articles', function (table) {
      table.increments();
      table.string('title');
      table.text('content');
      table.boolean('status');
      table.timestamps();
    })
    .createTable('question_answers', function (table) {
      table.increments();
      table.text('question');
      table.text('answer');
      table.integer('priority');
      table.boolean('status');
      table.timestamps();
    })
    .createTable('referrals', function (table) {
      table.integer('user_send_id');
      table.integer('user_receive_id').unique();
      table.integer('status').defaultTo(0);
      table.timestamps();
    })
  ]);
};

exports.down = function (knex, Promise) {
  return knex.schema
    .dropTableIfExists('referrals')
    .dropTableIfExists('question_answers')
    .dropTableIfExists('articles')
    .dropTableIfExists('stores')
    .dropTableIfExists('products')
    .dropTableIfExists('users')
};
