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

  // Returns an array of order objects.
  const get_orders = (id) => {
    return new Promise((resolve, reject) => {
      db('orders_dishes').select('order_id', 'dishes.dish_name', 'orders.cost', 'orders.phone_number')
        .leftJoin('dishes', 'dishes.id', 'dish_id')
        .leftJoin('orders', 'orders.id', 'order_id')
        .leftJoin('restaurants', 'restaurants.id', 'orders.restaurant_id')
        .where('restaurants.id', id)
        .then( orders => {
          resolve(collectDishes(orders));
        })
        .catch( err => {
          reject(err);
        });
    });
  };

  /**
   * Inserts the order items into the orders table and orders_dishes table
   *
   * @param {object} An object containing a phone_number {string}, a cost {number} and a dishes {array}.
   * @param {number} The ID {number} of the restaurant to whom the order belongs.
   * @return {object} Returns are promise object which resolves with an {array} containing the id {number} of the order as per our database structure.
   */
  const make_order = (order, restaurant_id) => {
    return new Promise((resolve, reject) => {
      const {phone_number, cost, dishes} = order;
      let order_time = null;
      // enable this if you want to test with order_time auto-populated
      order_time = order.dishes.length * 10;
      db('orders').insert(
        {
          phone_number: phone_number,
          cost: cost,
          order_time: order_time,
          restaurant_id:restaurant_id,
          time_accepted: null
        }, 'id')
        .then((order_id) => {
          const orders_dishes = [];
          for(let item of dishes){
            orders_dishes.push(
              db('orders_dishes').insert(
                { order_id: order_id[0], dish_id: item }));
          }
          Promise.all(orders_dishes).then(() => {
            // resolve the promise with the order id that was just created
            resolve(order_id[0]);
          });
        })
        .catch( error => {
          reject(error);
        });
    });
  };

  return {
    get_dishes,
    get_restaurant,
    get_orders,
    make_order
  };
};
