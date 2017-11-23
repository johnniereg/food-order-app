
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('orders_dishes').del()
    .then(function () {
      // Inserts seed entries
      return knex('orders_dishes').insert([
        {dish_id: '3', order_id: '1'},
        {dish_id: '6', order_id: '1'},
        {dish_id: '7', order_id: '1'}
      ]);
    });
};
