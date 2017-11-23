
exports.seed = function(knex, Promise) {
  return knex('restaurants').del()
    .then(function () {
      return knex('restaurants').insert({id: 1, restaurant_name: 'House of Noodles', address: '123 Pandora Ave, Victoria, BC, Canada', phone_number: '1-555-555-5431'});
    });
};
