let shoppingCart = {
  1: {id: 1, name: 'Dim Sum', price: 1200, quantity: 1},
  2: {id: 2, name: 'Hot and Sour Soup', price: 1500, quantity: 2},
  5: {id: 5, name: 'Spring Rolls', price: 1000, quantity: 1}
};

// Convert cents to dollars as string.
function displayDollars(number) {
  let centsToDollars = number / 100;
  let numberString = centsToDollars.toString(),
  dollars = numberString.split('.')[0],
  cents = (numberString.split('.')[1] || '') +'00';
  dollars = dollars.split('').reverse().join('')
      .replace(/(\d{3}(?!$))/g, '$1,')
      .split('').reverse().join('');
  return '$' + dollars + '.' + cents.slice(0, 2);
}

// Remove symbols from phone number input, output just numbers
function formatPhoneNumber(string) {
  return string.replace(/\D+/g, '');
}

// Sets shopping cart object to empty.
function clearCart() {
  shoppingCart = {};
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
  return cartItems;
}

// Builds the order and submits to server
function submitCart(shoppingCart, phoneNumber) {

  let order = {
    phone_number: formatPhoneNumber(phoneNumber),
    cost: addUpCartCost(shoppingCart),
    dishes: collectCartDishes(shoppingCart)
  };

  $.ajax({
    type: "POST",
    url: "/checkout",
    data: order,
    dataType: "json", // converts result to JSON
    success: function (data) {
      console.log("success:", data);
    },
    failure: function (errMsg) {
      console.log(errMsg);
    }
  });
};

// $('.cart-submit').on('submit', function(event) {
//   event.preventDefault();
//   let phoneNum = $(this).value();
//   submitCart(shoppingCart, phoneNum);
// });

