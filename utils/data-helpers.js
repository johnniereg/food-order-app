/*
 * General utility functions to help with the data
 */

const to_dollars = (number) => {
  let asDollars = number / 100;
  let amount = asDollars.toString(),
    dollars = amount.split('.')[0],
    cents = (amount.split('.')[1] || '') +'00';
  dollars = dollars.split('').reverse().join('')
    .replace(/(\d{3}(?!$))/g, '$1,')
    .split('').reverse().join('');
  return '$' + dollars + '.' + cents.slice(0, 2);
};

const clean_price_input = (priceString) => {
  return priceString.indexOf('$') > -1 ? Number(priceString.slice(priceString.indexOf('$')+1)) * 100 : Number(priceString) * 100;
};

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
      cost:to_dollars(order.cost),
      dishes: [order.dish_name],
      order_time: order.order_time
    };
  });
  for(let order in ordersObjects){
    ordersArray.push(ordersObjects[order]);
  }
  return ordersArray;
};

const get_order_status = (timeRemaining) => {
  console.log(timeRemaining);
  if(timeRemaining===null){
    return 'Your order is pending acceptance.';
  }
  if(timeRemaining > 0){
    return `${timeRemaining} minutes until ready!`;
  }else{
    return 'Your order is ready!';
  }
};

module.exports = {
  to_dollars,
  clean_price_input,
  collectDishes,
  get_order_status
};
