let shoppingCart ={};

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
  $('.cart-body').empty();
  for (let item in shoppingCart) {
    let dish = shoppingCart[item];
    let $cartElement = buildCartElement(dish);
    $('.cart-body').append($cartElement);
  }
  let cartTotalCents = addUpCartCost(shoppingCart);
  let cartPrice = toDollars(cartTotalCents);
  console.log(cartPrice);
  $('.cart-price').html(cartPrice);

  $('.quantity-down').on('click', function(event) {
    event.preventDefault();
    console.log("We clicked down.");
    let clickedid = $(this).closest('.cart-item').data('dishid');

    if (shoppingCart[clickedid].quantity > 1) {
      shoppingCart[clickedid].quantity -= 1;
    }

    renderShoppingCart();
  });

  $('.quantity-up').on('click', function(event) {
    event.preventDefault();
    console.log("We clicked up.");
    let clickedid = $(this).closest('.cart-item').data('dishid');

    shoppingCart[clickedid].quantity += 1;

    renderShoppingCart();
  });

  $('.remove-item').on('click', function(event) {
    event.preventDefault();
    console.log("We ditched a dish.");
    let clickedid = $(this).closest('.cart-item').data('dishid');
    delete shoppingCart[clickedid];
    renderShoppingCart();
  });

}

function addDishToCart(dish){

  if (shoppingCart[dish.id]) {
      shoppingCart[dish.id].quantity += 1;
  } else {
    shoppingCart[dish.id] = {id: dish.id, name: dish.name, price: dish.price, quantity:1}
  }
  console.log('shoppingCart:', shoppingCart);
  return shoppingCart;

}

// initialization
function loadDishes() {
  $.ajax({
    type: "GET",
    url: "/api/restaurants/1",
    dataType: "json", // converts result to JSON
  }).done(function(dishes) {
    renderDishes(dishes);
    let shoppingCart = {};

    //Adds listener as menu items are rendered - continue to work on function call - to build object
    function addButtonListener(){
      $('.add-to-cart').on('click', function(event){
        event.preventDefault();

        let card = $(this).closest('article');
        // console.log('$', $(this).data('dishid'));
        // console.log('No $', this.data('dishid'));
        console.log('dish id', 'dishid');
        // console.log(this);
        const dish = {
          id: card.data('dishid'),
          name: card.data('dishname'),
          price: card.data('dishcost')
        };
        console.log("button listen", dish);
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
