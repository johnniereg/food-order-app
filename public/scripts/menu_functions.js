


//Function which constructs the new dish HTML nodes by deconstructing the database
//object and converting them into html elements.
function createDishes(dishes){

let header = $('<header>')
  .append(`<h2>${dishes.dish_name}</h2>`)
  .append(`<img src='${dishes.photo_url}'`);

let description = $(`<p>${dishes.description}</p>`);
let price = $(`<div> ${dishes.cost}</div>`);

let footer = $(`<footer>`)
  .append(`<input id='button' type='submit' value='addToCart' </input>`)
  .append('<div> Total </div>');

let totalDish = $('<section>')
  .append(header)
  .append(description)
  .append(price)
  .append(footer);

 return totalDish;

}

