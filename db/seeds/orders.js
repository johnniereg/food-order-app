
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('orders').del()
    .then(function () {
      // Inserts seed entries
      return knex('orders').insert(
        {id: 1, phone_number: '1-555-555-0001',cost:10,restaurant_id:1,order_time:"30"}
      );
    });
};
