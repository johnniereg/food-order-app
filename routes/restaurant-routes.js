module.exports = function(db){
  // Gets the dishes of a specific restaurant based on their id
  const get_dishes = (req, res) => {
    const id = req.params.id;
    db('dishes').select()
      .where('restaurant_id', id)
      .then( dishes => {
        res.json(dishes);
      });
  };
  /* Returns a new promise that, if resolved returns the restaurant.
   * Condition is an object as per knex.
   */
  const get_restaurant = (condition) => {
    return new Promise(function(resolve, reject){
      db('restaurants').select()
        .where(condition)
        .then( restaurant => {
          resolve(restaurant[0]);
        })
        .catch( err => {
          reject(err);
        });
    });
  };
  return {
    get_dishes,
    get_restaurant
  };
};
