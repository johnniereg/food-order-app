
exports.up = function(knex, Promise) {
  return knex.schema.createTable('restaurants', (table) => {
    table.increments();
    table.string('restaurant_name');
    table.text('address');
    table.string('phone_number');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('restaurants');
};
