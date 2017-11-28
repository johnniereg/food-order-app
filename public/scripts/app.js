
// Front end scripts - must be ES5
$(document).ready(function () {


  // Hides cart if you click anywhere else on the body
  $('body').on('click', function () {
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

  $('#order-link').on('click', function (e) {
    $('.id-form').slideToggle().find("input").focus();
    e.stopPropagation();
  });

  $(".id-form .btn").click( function(e) {
    event.preventDefault();
    var formData = $('input[name="orderID"]').val()
    var url = "/orders/" + formData
    window.location.replace(url);
});

  // Load dishes on page load
  loadDishes();

});
