// Front end scripts - must be ES5

$(document).ready(function() {
  // Show and hide shopping cart listener.
  $('#cart-button').on('click', () => {
    $('div.shopping-cart').slideToggle();
  });
  // Load dishes on page load
  loadDishes();
});
