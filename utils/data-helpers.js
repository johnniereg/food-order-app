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
}
module.exports = {
  to_dollars,
  clean_price_input
};
