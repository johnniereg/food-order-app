function clearCart() {

}


let shoppingCart = {
  1: {id: 1, name: 'Dim Sum', price: 1200, quantity: 1},
  2: {id: 2, name: 'Hot and Sour Soup', price: 1500, quantity: 2},
  5: {id: 5, name: 'Spring Rolls', price: 1000, quantity: 1}
};


function submitCart(shoppingCart, phoneNumber) {

  let totalPrice = 0;
  let cartItems = [];

  for (dish in shoppingCart) {

    let dishPrice = shoppingCart[dish].price;
    let quantity = shoppingCart[dish].quantity;

    // Add up all the cost of items in the cart
    let dishSubTotal = dishPrice * quantity;
    console.log(dishSubTotal);
    totalPrice += dishSubTotal;

    // Collect total appearances of dish IDs
    for (let i = quantity; i > 0; i--) {
      cartItems.push(dish);
    }

  };

  let order = {
    phone_number: phoneNumber,
    cost: totalPrice,
    dishes: cartItems
  };

  $.ajax({
    type: "POST",
    url: "/checkout",
    data: JSON.string(order),
    dataType: "json", // converts result to JSON
    success: function (data) {
      console.log(data);
    },
    failure: function (errMsg) {
      console.log(errMsg);
    }
  });

};

submitCart(shoppingCart, '12508857405');
