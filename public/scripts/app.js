// Front end scripts - must be ES5



$(document).ready(function() {

  const dishTest = {
    id: 1,
    dish_name: "Dim Sum",
    description: "Small bite-sized rounds stuffed with veggies or meat.",
    photo_url: "http://i.ndtvimg.com/i/2015-02/dim-sum_625x350_61424321956.jpg (47 kB)",
    cost: 1200,
    restaurant_id: 1
  };

  createDishes(dishTest);

});
