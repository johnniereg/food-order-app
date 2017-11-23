// Given an array of orders, this function makes a new array of objects.
// These objects will collect the dishes into one handy array
const collectDishes = (orders) => {
  const ordersObjects = {};
  const ordersArray = [];
  orders.forEach((order) => {
    if(ordersObjects[order.order_id]){
      ordersObjects[order.order_id].dishes.push(order.dish_name);
      return;
    }
    ordersObjects[order.order_id] = {
      order_id: order.order_id,
      phone_number: order.phone_number,
      cost: order.cost,
      dishes: [order.dish_name]
    };
  });
  for(let order in ordersObjects){
    ordersArray.push(ordersObjects[order]);
  }
  return ordersArray;
};

module.exports = function(db){
  // Gets the dishes of a specific restaurant based on their id
  const get_dishes = (id) => {
    return new Promise((resolve, reject) => {
      db('dishes').select()
        .where('restaurant_id', id)
        .then( dishes => {
          resolve(dishes);
        })
        .catch( err => {
          reject(err);
        });
    });
  };
  /* Returns a new promise that, if resolved returns the restaurant.
   * Condition is an object as per knex.
   */
  const get_restaurant = condition => {
    return new Promise((resolve, reject) => {
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

  const get_orders = (id) => {
    return new Promise((resolve, reject) => {
      db('orders_dishes').select('order_id', 'dishes.dish_name', 'orders.cost', 'orders.phone_number')
        .leftJoin('dishes', 'dishes.id', 'dish_id')
        .leftJoin('orders', 'orders.id', 'order_id')
        .leftJoin('restaurants', 'restaurants.id', 'orders.restaurant_id')
        .where('restaurants.id', 1)
        .then( orders => {
          resolve(collectDishes(orders));
        })
        .catch( err => {
          reject(err);
        });
    });
  };
  return {
    get_dishes,
    get_restaurant,
    get_orders
  };
};
