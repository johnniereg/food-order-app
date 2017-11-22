
exports.up = function(knex, Promise) {
  return knex.schema.createTable('orders_dishes', (table) => {
    table.integer('order_id');
    table.integer('dish_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('orders_dishes');
};
