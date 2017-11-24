

// Remove symbols from phone number input, output just numbers
function formatPhoneNumber(string) {
  return string.replace(/\D+/g, '');
}

// Sets shopping cart object to empty.
function clearCart() {
  shoppingCart = {};
  $("#cart-button").html("Cart");

}

// Add up all the cost of items in the cart
function addUpCartCost(shoppingCart) {
  let totalPrice = 0;

  for (dish in shoppingCart) {
    let dishPrice = shoppingCart[dish].price;
    let quantity = shoppingCart[dish].quantity;
    let dishSubTotal = dishPrice * quantity;
    totalPrice += dishSubTotal;
  }
  return totalPrice;
}

// Collect total appearances of dish IDs
function collectCartDishes(shoppingCart) {
  let cartItems = [];
  for (dish in shoppingCart) {
    let quantity = shoppingCart[dish].quantity;

    for (let i = quantity; i > 0; i--) {
      cartItems.push(dish);
    }
  }
  //Updates number of items in Cart by rewriting DOM at #cart-button
  if (cartItems.length == 0) {
    $("#cart-button").html("Cart");
  } else {
    $("#cart-button").html("Cart " + "(" + cartItems.length + ")");

  }
  return cartItems;
}


// Builds the order and submits to server
function submitCart(shoppingCart, phoneNumber) {

  // Formats shopping cart and phone number for server.

  let order = {
    phone_number: formatPhoneNumber(phoneNumber),
    cost: addUpCartCost(shoppingCart),
    dishes: collectCartDishes(shoppingCart)
  };

  // Sends order to the server.
  $.ajax({
    type: "POST",
    url: "/checkout",
    data: order,
    dataType: "json", // converts result to JSON
    success: function (response) {
      if (response.result == 'redirect') {
        window.location.replace(response.url);
      }
    },
    failure: function (errMsg) {
      console.log("The servers error: ", errMsg);
    }
  });
};

// Listener event for shopping cart submit. Handles some errors.
$('.cart-submit').on('submit', function(event) {
  event.preventDefault();
  let phoneNumber = $(this).closest('.cart-submit').find('input').val();
  let preparedNumber = formatPhoneNumber(phoneNumber);
  let cart = collectCartDishes(shoppingCart);
  // Displays message if cart empty
  if (cart.length < 1) {
    $('.empty-cart').removeClass('hide');
    return;
  }
  // Displays message if phone number length is too short when submitting.
  if (preparedNumber.length < 10) {
    $('.hide.no-phone').removeClass('hide');
    return;
  }
  // Full cart and valid phone will send to server.
  if (cart.length >= 1 && preparedNumber > 9) {
    submitCart(shoppingCart, preparedNumber);
  }
});

// Clears and reloads shopping cart on click of empty button.
$('.cart-clear').on('click', function(event) {
  event.preventDefault();
  clearCart();
  renderShoppingCart();

});



