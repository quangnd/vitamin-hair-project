
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('districts').del(),
    knex('cities').del(),
    // Inserts seed entries
    knex('cities').insert({id: 1, name: 'Hà Nội'}),
    knex('cities').insert({ id: 2, name: 'TP Hồ Chí Minh'}),

    knex('districts').insert({ name: 'Ba Đình', city_id: 1, time_ship: 0 }),
    knex('districts').insert({ name: 'Hoàn Kiếm', city_id: 1, time_ship: 0 }),
    knex('districts').insert({ name: 'Đống Đa', city_id: 1, time_ship: 0 }),
    knex('districts').insert({ name: 'Hai Bà Trưng', city_id: 1, time_ship: 0 }),
    knex('districts').insert({ name: 'Tây Hồ', city_id: 1, time_ship: 0 }),
    knex('districts').insert({ name: 'Cầu Giấy', city_id: 1, time_ship: 0 }),
    knex('districts').insert({ name: 'Thanh Xuân', city_id: 1, time_ship: 0 }),
    knex('districts').insert({ name: 'Nam Từ Liêm', city_id: 1, time_ship: 0 }),
    knex('districts').insert({ name: 'Bắc Từ Liêm', city_id: 1, time_ship: 0 }),
    knex('districts').insert({ name: 'Hoàng Mai', city_id: 1, time_ship: 0 }),
    knex('districts').insert({ name: 'Long Biên', city_id: 1, time_ship: 0 }),

    knex('districts').insert({ name: 'Tân Bình', city_id: 2, time_ship: 1 }),
    knex('districts').insert({ name: 'Bình Thạnh', city_id: 2, time_ship: 1 }),
    knex('districts').insert({ name: 'Gò Vấp', city_id: 2, time_ship: 1 }),
    knex('districts').insert({ name: 'Phú Nhuận', city_id: 2, time_ship: 1 }),
    knex('districts').insert({ name: 'Tân Phú', city_id: 2, time_ship: 1 }),
    knex('districts').insert({ name: 'Quận 1', city_id: 2, time_ship: 1 }),
    knex('districts').insert({ name: 'Quận 2', city_id: 2, time_ship: 1 }),
    knex('districts').insert({ name: 'Quận 3', city_id: 2, time_ship: 1 }),
    knex('districts').insert({ name: 'Quận 4', city_id: 2, time_ship: 1 }),
    knex('districts').insert({ name: 'Quận 5', city_id: 2, time_ship: 1 }),
    knex('districts').insert({ name: 'Quận 6', city_id: 2, time_ship: 1 }),
    knex('districts').insert({ name: 'Quận 7', city_id: 2, time_ship: 1 }),
    knex('districts').insert({ name: 'Quận 8', city_id: 2, time_ship: 1 }),
    knex('districts').insert({ name: 'Quận 9', city_id: 2, time_ship: 1 }),
    knex('districts').insert({ name: 'Quận 10', city_id: 2, time_ship: 1 }),
    knex('districts').insert({ name: 'Quận 11', city_id: 2, time_ship: 1 })
  );
};
