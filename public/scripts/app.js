// Front end scripts - must be ES5


let shoppingCart = {
  1: {id: 1, name: 'Dim Sum', price: 1200, quantity: 1},
  2: {id: 2, name: 'Hot and Sour Soup', price: 1500, quantity: 2},
  5: {id: 5, name: 'Spring Rolls', price: 1000, quantity: 1}
};

$(document).ready(function() {

  // Load dishes on page load
  loadDishes();




});
