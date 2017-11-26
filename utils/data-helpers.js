
/**
 * to_dollars - converts a number into a dollar formatted string.
 *
 * @param {number} number The number to be converted into a string.
 * @return {string} A dollar formatted string produced from the number.
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


/**
 * clean_price_input - Removes a dollar sign from the input dollar formatted string if one exists.
 *
 * @param {string} priceString The dollar formmatted string that is to be stripped.
 * @return {number} A number representing the dollar amount input.
 */
const clean_price_input = (priceString) => {
  return priceString.indexOf('$') > -1 ? Number(priceString.slice(priceString.indexOf('$')+1)) * 100 : Number(priceString) * 100;
};

/**
 * collectDishes - For each order object in an array, collects all the dishes associated with an order object into one array.
 *
 * @param {array} orders An array containing an object for each array.
 * @return {array} Returns an array whose order objects have all dishes associated with individual orders in an array.
 */
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

/**
 * get_order_status - returns an appropriate order status based on the time remaining until the order is complete.
 *
 * @param {number} timeRemaining The time remaining until an order is complete.
 * @return {string} The status of the order.
 */
const get_order_status = (timeRemaining) => {
  if(timeRemaining > 0){
    return `${timeRemaining} minutes until ready!`;
  }
  if (timeRemaining <= 0){
    return 'Your order is ready!';
  }
  return 'Your order is pending acceptance.';
};

module.exports = {
  to_dollars,
  clean_price_input,
  collectDishes,
  get_order_status
};
