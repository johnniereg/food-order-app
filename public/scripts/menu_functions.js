
//Function which constructs the new dish HTML nodes by deconstructing the database
//object and converting them into html elements.
function createDishes(dishes){

  let header = $('<header>')
    .append(`<h2>${dishes.dish_name}</h2>`)
    .append(`<img src=${dishes.photo_url}>`);

  let description = $(`<p>${dishes.description}</p>`);
  let price = $(`<div>${dishes.cost}</div>`);

  let footer = $(`<footer>`)
    .append(`<input id='button' type='submit' value='addToCart' </input>`)
    .append('<div> Total </div>');

  let totalDish = $(`<article class='menu-item' data-dishid=${dishes.id} data-hidden='true'>`)
    .append(header)
    .append(description)
    .append(price)
    .append(footer);

  return totalDish;
}

// Render dishes and append to HTML
function renderDishes(dishes){
  console.log(dishes);
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
