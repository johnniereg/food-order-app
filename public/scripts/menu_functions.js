let shoppingCart ={};

// Formatting for front-page price displays.
function toDollars(number) {
  let asDollars = number / 100;
  let amount = asDollars.toString(),
  dollars = amount.split('.')[0],
  cents = (amount.split('.')[1] || '') +'00';
  dollars = dollars.split('').reverse().join('')
      .replace(/(\d{3}(?!$))/g, '$1,')
      .split('').reverse().join('');
  return '$' + dollars + '.' + cents.slice(0, 2);
}

// Create HTML elements for dishes in the database to show on front page.
function createDishes(dishes){
  let attributes = {
    src : dishes.photo_url,
    alt : dishes.dish_name
  };

  let dishData = {
    dishid: dishes.id,
    dishname: dishes.dish_name,
    dishcost: dishes.cost
  };

  let cardBody = $('<main>').addClass('card-body')
    .append($('<h4>').text(`${dishes.dish_name}`).addClass('card-title'))
    .append($('<p>').text(`${dishes.description}`).addClass('card-text'))
    .append($('<input>').addClass('btn btn-primary add-to-cart').attr({type: 'submit', value: 'Add to cart'}))
    .append($('<p>').text(`Price: ${toDollars(dishes.cost)}`).addClass('price'))

  let totalDish = $('<article>').data(dishData)
    .append($('<img>').attr(attributes).addClass('card-img-top'))
    .append(cardBody)
    .addClass('card')

  return totalDish;
}

// Create HTML elements for shopping cart.
function buildCartElement(dish) {

  let dishInfo = {
    dishid: dish.id
  };

  let $cartItem = $('<div>').addClass('cart-item').data(dishInfo)
    .append($('<p>')
      .append($('<span>').text(`${dish.name}`).addClass('dish-name'))
      .append($('<span>').text(`${toDollars(dish.price)}`).addClass('dish-price'))
      .append($('<button>').addClass('quantity-down btn').text('-'))
      .append($('<span>').addClass('dish-quantity').text(dish.quantity))
      .append($('<button>').addClass('quantity-up btn').text('+'))
      .append($('<button>').addClass('remove-item btn').text('Remove')));

  return $cartItem;
}

function renderShoppingCart() {
  // Resets cart on load.
  $('.cart-body').empty();

  // Loop over in memory cart to display items in visual cart.
  for (let item in shoppingCart) {
    let dish = shoppingCart[item];
    let $cartElement = buildCartElement(dish);
    $('.cart-body').append($cartElement);
  }
  let cartTotalCents = addUpCartCost(shoppingCart);
  let cartPrice = toDollars(cartTotalCents);

  // Sets the total price in the cart.
  $('.cart-price').html(cartPrice);

  // Controllers for in cart quantity changes.
  // Increase quantity.
  $('.quantity-down').on('click', function(event) {
    event.preventDefault();
    let clickedid = $(this).closest('.cart-item').data('dishid');
    if (shoppingCart[clickedid].quantity > 1) {
      shoppingCart[clickedid].quantity -= 1;
    }
    renderShoppingCart();
  });
  // Decrease quantity.
  $('.quantity-up').on('click', function(event) {
    event.preventDefault();
    let clickedid = $(this).closest('.cart-item').data('dishid');
    shoppingCart[clickedid].quantity += 1;
    renderShoppingCart();
  });
  // Remove item from cart.
  $('.remove-item').on('click', function(event) {
    event.preventDefault();
    let clickedid = $(this).closest('.cart-item').data('dishid');
    delete shoppingCart[clickedid];
    renderShoppingCart();
  });

  // Hide flash messages on cart load.
  $('.flash-message.empty-cart').hide();
  $('.flash-message.no-phone').hide();
}

// Adds items from menu page to in-memory shopping cart object.
function addDishToCart(dish){

  if (shoppingCart[dish.id]) {
      shoppingCart[dish.id].quantity += 1;
  } else {
    shoppingCart[dish.id] = {id: dish.id, name: dish.name, price: dish.price, quantity:1};
  }
  // return shoppingCart; <--- Do we need this? JR

}

// Front page initializiation and add event listeners.
function loadDishes() {
  // Server request for all dishes in database.
  $.ajax({
    type: "GET",
    url: "/api/restaurants/1",
    dataType: "json", // converts result to JSON
  }).done(function(dishes) {
    renderDishes(dishes);
    // let shoppingCart = {}; <--- We declare this twice. Don't think we need this. JR

    //Adds listener as menu items are rendered - continue to work on function call - to build object
    function addButtonListener(){
      $('.add-to-cart').on('click', function(event){
        event.preventDefault();

        let card = $(this).closest('article');
        const dish = {
          id: card.data('dishid'),
          name: card.data('dishname'),
          price: card.data('dishcost')
        };

        addDishToCart(dish);
        renderShoppingCart();

      });
    }

    // Render dishes and append to HTML
    function renderDishes(dishes){
      dishes.forEach(function(dish) {
        let createdDish = createDishes(dish);
        $('.menu').append(createdDish);
      });
      addButtonListener();
    }
  });
}
