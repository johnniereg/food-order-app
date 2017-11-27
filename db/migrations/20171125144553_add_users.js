
exports.up = function(knex, Promise) {
   return knex.schema.createTable('users', (table) => {
    table.increments('id');
    table.text('username');
    table.text('password');
    table.integer('restaurant');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
