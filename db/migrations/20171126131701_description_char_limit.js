
exports.up = function(knex, Promise) {
  return knex.schema.table('dishes', function (table) {
    table.string('description',1200).alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('dishes', function (table) {
    table.string('description').alter();
  })
};
