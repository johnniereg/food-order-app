// Front end scripts - must be ES5

$(document).ready(function() {

// Hides cart if you click anywhere else on the body
 $('body').on('click', () => {
    console.log('clicked the main element')
    $('div.shopping-cart').slideUp();
  });

  // Show and hide shopping cart listener.
  $('#cart-button').on('click', (e) => {
    $('div.shopping-cart').slideToggle();
    e.stopPropagation();
  });

  // Allows user to click on the shopping cart without invoking the toggle listener
  $('.shopping-cart').on('click', (e) => {
    e.stopPropagation();
  });

  // Load dishes on page load
  loadDishes();
});
