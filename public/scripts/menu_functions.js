
//Function which constructs the new dish HTML nodes by deconstructing the database
//object and converting them into html elements.
function createDishes(dishes){
  let attributes = {
    src : dishes.photo_url,
    alt : dishes.dish_name
  };


  let cardBody = $('<main>').addClass('card-body')
    .append($('<h4>').text(`${dishes.dish_name}`).addClass('card-title'))
    .append($('<p>').text(`${dishes.description}`).addClass('card-text'))
    .append($('<input>').addClass('btn btn-primary add-to-cart').attr({type: 'submit', value: 'Add to cart'}))
    .append($('<p>').text(`Price: $${Number(dishes.cost)/100}`).addClass('price'))

  // value='addToCart' </input>`)
  let totalDish = $('<article>')
    .append($('<img>').attr(attributes).addClass('card-img-top'))
    .append(cardBody)
    .addClass('card')

  return totalDish;
}

// Render dishes and append to HTML
function renderDishes(dishes){
  dishes.forEach(function(dish) {
    let createdDish = createDishes(dish);
    $('.menu').append(createdDish);
  });
}

// Request all dishes from DB and load them on page
function loadDishes() {
  $.ajax({
    type: "GET",
    url: "/api/restaurants/1",
    dataType: "json", // converts result to JSON
    success: function (result) {
      renderDishes(result);
    }
  });
}
