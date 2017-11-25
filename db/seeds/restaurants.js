
exports.seed = function(knex, Promise) {
  return knex('restaurants').del()
    .then(function () {
      return knex('restaurants').insert([
      {  
        id: 1,
        restaurant_name: 'House of Noodles',
        address: '123 Pandora Ave, Victoria, BC, Canada',
        phone_number: '1-555-555-5431'
      },
      {  
        id: 2,
        restaurant_name: 'Pablos Pizzaria',
        address: '321 Quadra Street, Victoria, BC, Canada',
        phone_number: '1-555-555-1111'
      },
      {  
        id: 3,
        restaurant_name: 'The Sushi bar',
        address: '359 Douglas Street, Victoria, BC, Canada',
        phone_number: '1-555-555-3214'
      }]
      );
    });
};
