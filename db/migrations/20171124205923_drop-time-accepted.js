
exports.up = function(knex, Promise) {
  return knex.schema.table('orders', (table) => {
    table.dropColumn('time_accepted');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('orders', (table) => {
    table.integer('time_accepted');
  });
};
