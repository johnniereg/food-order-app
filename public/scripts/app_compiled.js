'use strict';

// Front end scripts - must be ES5

$(document).ready(function () {
  // Show and hide shopping cart listener.
  $('#cart-button').on('click', function () {
    $('div.shopping-cart').slideToggle();
  });
  // Load dishes on page load
  loadDishes();
});
