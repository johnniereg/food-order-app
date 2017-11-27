// Front end scripts - must be ES5

$(document).ready(function() {


 //Jquery popup form to enter order id
  $('#order-link').on('click', (e) => {
    $('#monkey').slideToggle();
    return false;
  }

// Hides cart if you click anywhere else on the body

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
