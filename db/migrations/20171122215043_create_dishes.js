
exports.up = function(knex, Promise) {
  return knex.schema.createTable('dishes', (table) => {
    table.increments();
    table.string('dish_name');
    table.text('description');
    table.text('photo_url');
    table.integer('cost');
    table.integer('restaurant_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('dishes');
};
