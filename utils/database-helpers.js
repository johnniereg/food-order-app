const dataHelpers = require('./data-helpers');
const twilioHelpers = require('../utils/twilio-helpers');


module.exports = function(db){

  // Gets the dishes of a specific restaurant based on their id
  const get_dishes = (id) => {
    return new Promise((resolve, reject) => {
      db('dishes').select()
        .where('restaurant_id', id)
        .then( dishes => {
          resolve(dishes.sort((dishA, dishB) => {
            return dishA.id - dishB.id;
          }));
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
          return resolve(restaurant[0]);
        })
        .catch( err => {
          return reject(err);
        });
    });
  };
  const get_users = (name)=>{
    return new Promise((resolve, reject) => {
      db('users').select()
        .where('username',name)
        .then( user => {
          return resolve(user[0]);
        })
        .catch( err => {
          return reject(err);
        });
    });
  };

  // Returns an array of order objects for restuarant id
  const get_orders = (id) => {
    return new Promise((resolve, reject) => {
      db('orders_dishes').select('order_id', 'dishes.dish_name', 'orders.cost', 'orders.phone_number')
        .leftJoin('dishes', 'dishes.id', 'dish_id')
        .leftJoin('orders', 'orders.id', 'order_id')
        .leftJoin('restaurants', 'restaurants.id', 'orders.restaurant_id')
        .where('restaurants.id', id)
        .then( orders => {
          return resolve(dataHelpers.collectDishes(orders).sort((orderA, orderB) => {
            return orderA.order_id - orderB.order_id;
          }));
        })
        .catch( err => {
          return reject(err);
        });
    });
  };

  const get_order = (id) => {
    return new Promise((resolve, reject) => {
      db('orders_dishes').select('order_id', 'dishes.dish_name', 'orders.cost', 'orders.phone_number', 'orders.order_time')
        .leftJoin('dishes', 'dishes.id', 'dish_id')
        .leftJoin('orders', 'orders.id', 'order_id')
        .where('orders.id', id)
        .then( orders => {
          return resolve(dataHelpers.collectDishes(orders)[0]);
        })
        .catch( err => {
          return reject(err);
        });
    });
  };

  const remove_order = (id) => {
    return db('orders').where('id', id).del().then(() => {
      db('orders_dishes').where('order_id', id).del();
    });
  };

  /**
   * @param {string} table The name of a table as a string.
   * @param {object} clause A set of where clauses.
   * @param {object} change The changes that you'd like to be made.
   * @returns {promise} Returns the promise of a completed database change.
   */
  const update_item = (table, clause, change) => {
    return db(table).where(clause)
      .update(change, 'id');
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
      // order_time = order.dishes.length * 10;
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
            return resolve(order_id[0]);
          });
        })
        .catch( error => {
          return reject(error);
        });
    });
  };
  const confirm_order = (order_id) => {
    return get_order(order_id)
      .then((order) => {
        twilioHelpers.send_message(order.phone_number, twilioHelpers.twiPhone, `Your order, #${order_id}, is ready for pick up from House of Noodles!`);
      });
  };


  return {
    confirm_order,
    get_dishes,
    get_restaurant,
    get_orders,
    get_order,
    update_item,
    make_order,
    get_users,
    remove_order
  };
};
