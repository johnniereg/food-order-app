
// Front end scripts - must be ES5

$(document).ready(function () {

  // Hides cart if you click anywhere else on the body
  $('body').on('click', function () {
    console.log('clicked the main element');
    $('div.shopping-cart').slideUp();
    $('.id-form').slideUp();

  });

  $('.id-form').on('click', function (e) {
    e.stopPropagation();
  });

  // Show and hide shopping cart listener.
  $('#cart-button').on('click', function (e) {
    $('div.shopping-cart').slideToggle();
    e.stopPropagation();
  });

  // Allows user to click on the shopping cart without invoking the toggle listener
  $('.shopping-cart').on('click', function (e) {
    e.stopPropagation();
  });

  $('#order-link').on('click', (e) => {
    console.log("clicked the order button");
    $('.id-form').slideToggle();
    e.stopPropagation();
  });

  // Load dishes on page load
  loadDishes();
});
