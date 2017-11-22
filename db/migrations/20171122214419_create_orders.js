
exports.up = function(knex, Promise) {
  return knex.schema.createTable('orders', (table) => {
    table.increments();
    table.string('phone_number');
    table.integer('cost');
    table.integer('restaurant_id');
    table.integer('order_time');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('orders');
};
