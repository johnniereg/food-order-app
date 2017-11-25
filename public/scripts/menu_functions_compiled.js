'use strict';

var shoppingCart = {};

// Formatting for front-page price displays.
function toDollars(number) {
  var asDollars = number / 100;
  var amount = asDollars.toString(),
      dollars = amount.split('.')[0],
      cents = (amount.split('.')[1] || '') + '00';
  dollars = dollars.split('').reverse().join('').replace(/(\d{3}(?!$))/g, '$1,').split('').reverse().join('');
  return '$' + dollars + '.' + cents.slice(0, 2);
}

// Create HTML elements for dishes in the database to show on front page.
function createDishes(dishes) {
  var attributes = {
    src: dishes.photo_url,
    alt: dishes.dish_name
  };

  var dishData = {
    dishid: dishes.id,
    dishname: dishes.dish_name,
    dishcost: dishes.cost
  };

  var cardBody = $('<main>').addClass('card-body').append($('<h4>').text('' + dishes.dish_name).addClass('card-title')).append($('<p>').text('' + dishes.description).addClass('card-text')).append($('<input>').addClass('btn btn-primary add-to-cart').attr({ type: 'submit', value: 'Add to cart' })).append($('<p>').text('Price: ' + toDollars(dishes.cost)).addClass('price'));

  var totalDish = $('<article>').data(dishData).append($('<img>').attr(attributes).addClass('card-img-top')).append(cardBody).addClass('card');

  return totalDish;
}

// Create HTML elements for shopping cart.
function buildCartElement(dish) {

  var dishInfo = {
    dishid: dish.id
  };

  var $cartItem = $('<div>').addClass('cart-item').data(dishInfo).append($('<p>').append($('<span>').text('' + dish.name).addClass('dish-name')).append($('<span>').text('' + toDollars(dish.price)).addClass('dish-price')).append($('<button>').addClass('quantity-down btn').text('-')).append($('<span>').addClass('dish-quantity').text(dish.quantity)).append($('<button>').addClass('quantity-up btn').text('+')).append($('<button>').addClass('remove-item btn').text('Remove')));

  return $cartItem;
}

function renderShoppingCart() {
  // Resets cart on load.
  $('.cart-body').empty();

  // Loop over in memory cart to display items in visual cart.
  for (var item in shoppingCart) {
    var dish = shoppingCart[item];
    var $cartElement = buildCartElement(dish);
    $('.cart-body').append($cartElement);
  }
  var cartTotalCents = addUpCartCost(shoppingCart);
  var cartPrice = toDollars(cartTotalCents);

  // Sets the total price in the cart.
  $('.cart-price').html(cartPrice);

  // Controllers for in cart quantity changes.
  // Increase quantity.
  $('.quantity-down').on('click', function (event) {
    event.preventDefault();
    var clickedid = $(this).closest('.cart-item').data('dishid');
    if (shoppingCart[clickedid].quantity > 1) {
      shoppingCart[clickedid].quantity -= 1;
    }
    renderShoppingCart();
  });
  // Decrease quantity.
  $('.quantity-up').on('click', function (event) {
    event.preventDefault();
    var clickedid = $(this).closest('.cart-item').data('dishid');
    shoppingCart[clickedid].quantity += 1;
    renderShoppingCart();
  });
  // Remove item from cart.
  $('.remove-item').on('click', function (event) {
    event.preventDefault();
    var clickedid = $(this).closest('.cart-item').data('dishid');
    delete shoppingCart[clickedid];
    renderShoppingCart();
  });

  // Hide flash messages on cart load.
  $('.empty-cart').addClass('hide');
  $('.no-phone').addClass('hide');

  var cartCount = collectCartDishes(shoppingCart);
  if (cartCount.length > 0) {
    $('.cart-interactions').removeClass('hide');
  } else {
    $('.cart-interactions').addClass('hide');
  }
}

// function showAndHideCartButtons() {
//   let cartCount = collectCartDishes(shoppingCart);
//   console.log("Cart count", cartCount);
//   if (cartCount.length > 0) {
//     $('.cart-interactions').removeClass('hide');
//   } else {
//     $('.cart-interactions').addClass('hide');
//   }
//   renderShoppingCart();
// }

// // showAndHideCartButtons();


// Adds items from menu page to in-memory shopping cart object.
function addDishToCart(dish) {
  if (shoppingCart[dish.id]) {
    shoppingCart[dish.id].quantity += 1;
  } else {
    shoppingCart[dish.id] = { id: dish.id, name: dish.name, price: dish.price, quantity: 1 };
  }
}

// Front page initializiation and add event listeners.
function loadDishes() {
  // Server request for all dishes in database.
  $.ajax({
    type: "GET",
    url: "/api/restaurants/1",
    dataType: "json" // converts result to JSON
  }).done(function (dishes) {
    renderDishes(dishes);
    // let shoppingCart = {}; <--- We declare this twice. Don't think we need this. JR

    //Adds listener as menu items are rendered - continue to work on function call - to build object
    function addButtonListener() {
      $('.add-to-cart').on('click', function (event) {
        event.preventDefault();

        var card = $(this).closest('article');
        var dish = {
          id: card.data('dishid'),
          name: card.data('dishname'),
          price: card.data('dishcost')
        };

        addDishToCart(dish);
        renderShoppingCart();
      });
    }

    // Render dishes and append to HTML
    function renderDishes(dishes) {
      dishes.forEach(function (dish) {
        var createdDish = createDishes(dish);
        $('.menu').append(createdDish);
      });
      addButtonListener();
    }
  });
}
