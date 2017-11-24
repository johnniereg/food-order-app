
exports.up = function(knex, Promise) {
  return knex.schema.table('orders', (table) => {
    table.timestamp('time_accepted');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('orders', (table) => {
    table.dropColumn('time_accepted');
  });
};
