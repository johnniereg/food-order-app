const bcrypt = require('bcrypt');
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {'username': 'David',password:bcrypt.hashSync('badpass', 10),'restaurant':1},
        {'username': 'William',password:bcrypt.hashSync('badpass2', 10),'restaurant':2},
        {'username': 'Alan',password:bcrypt.hashSync('badpass3', 10),'restaurant':3}
      ]);
    });
};
