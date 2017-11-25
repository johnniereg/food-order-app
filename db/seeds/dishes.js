
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('dishes').del()
    .then(function () {
      // Inserts seed entries
      return knex('dishes').insert([
        {
          id: 1,
          dish_name: 'Dim Sum',
          description: 'Small bite-sized rounds stuffed with veggies or meat.',
          photo_url: 'http://i.ndtvimg.com/i/2015-02/dim-sum_625x350_61424321956.jpg',
          cost: '1200',
          restaurant_id: 1
        },
        {
          id: 2,
          dish_name: 'Hot and Sour Soup',
          description: 'A soup with a spicy and sour broth.',
          photo_url: 'http://i.ndtvimg.com/i/2016-06/soup-625_625x350_81466064298.jpg',
          cost: '1500',
          restaurant_id: 1
        },
        {
          id: 3,
          dish_name: 'Quick Noodles',
          description: 'One of the staples in every Chinese home, this version is super speedy. Just bung in all your favourites and create a masterpiece of your own.',
          photo_url: 'http://i.ndtvimg.com/i/2016-06/noodles-625_625x350_41466064269.jpg',
          cost: '1150',
          restaurant_id: 1
        },
        {
          id: 4,
          dish_name: 'Szechuan Chili Chicken',
          description: 'A fiery delight straight from the Sichuan region. It is loaded with pungent spices like brown pepper. red chillies, ginger, green chillies and white pepper.',
          photo_url: 'http://i.ndtvimg.com/i/2015-02/chilli-chicken_625x350_81424323578.jpg',
          cost: '1300',
          restaurant_id: 1
        },
        {
          id: 5,
          dish_name: 'Spring Rolls',
          description: 'A crisp appetizer where shredded veggies are encased in thin sheets and then fried golden.',
          photo_url: 'http://i.ndtvimg.com/i/2015-02/spring-roll_625x350_51424323845.jpg',
          cost: '1000',
          restaurant_id: 1
        },
        {
          id: 6,
          dish_name: 'Shitake Fried Rice with Water Chestnuts',
          description: 'Mushrooms and water chestnuts are used frequently in Chinese cooking. A dish that is fast, filling and flavourful.',
          photo_url: 'http://i.ndtvimg.com/i/2016-06/tofu-with-rice_625x350_81466070125.jpg',
          cost: '1400',
          restaurant_id: 1
        },
        {
          id: 7,
          dish_name: 'Chicken with Chestnuts',
          description: 'This earthy recipe is perfect for a holiday feast.',
          photo_url: 'http://i.ndtvimg.com/i/2015-02/mushroom-rice_625x350_61424324920.jpg',
          cost: '1600',
          restaurant_id: 1
        },
        {
          id: 8,
          dish_name: 'Date Pancakes',
          description: 'Pancakes are like a blank canvas, ever so versatile. Chinese pancakes are usually made with dough instead of using a batter.',
          photo_url: 'http://i.ndtvimg.com/i/2016-06/dhaniwal-chicken_625x350_71464783643.jpg',
          cost: '1300',
          restaurant_id: 1
        },
        {
          id: 9,
          dish_name: 'Wok Tossed Veggies in Honey and Black Bean Glaze',
          description: 'A colourful melange of veggies like chestnuts, mushrooms, Chinese cabbage - all tossed in honey and black bean sauce.',
          photo_url: 'http://i.ndtvimg.com/i/2016-06/veggies_625x350_71466071339.jpg',
          cost: '1600',
          restaurant_id: 1
        },
        {
          id: 10,
          dish_name: 'Chicago Style Square Deep Dish Pizza',
          description: 'A staple of michigan italian cuisine, this pizza is 2.5 inches think, covered in alternating layers of cheese, peperoni and salami',
          photo_url: 'http://www.seriouseats.com/recipes/assets_c/2017/02/20170216-detroit-style-pizza-43-thumb-1500xauto-436479.jpg',
          cost: '1800',
          restaurant_id: 2
        },
        {
          id: 11,
          dish_name: 'Dynamite roll',
          description: 'Prawn tempura with avacado rolled in seaweed and rice and covered in japanese style mayonnaise. Contains 6 pieces and comes with soy sauce and pickled ginger',
          photo_url: 'http://cisl.edu/wordpress/wp-content/uploads/2013/05/Dynamite-Roll-JapaneseFoodAdventures.jpg',
          cost: '800',
          restaurant_id: 3
        },
        {
          id:12
          dish_name: 'Smoked Salmon Roll',
          description: 'Smoked Salmon Roll. Contains 3 pieces and comes with soy sauce and pickled ginger',
          photo_url: 'https://i.ytimg.com/vi/a6tBjoYxbYQ/maxresdefault.jpg',
          cost: '300',
          restaurant_id: 3
        },
        {
          id: 13,
          dish_name: 'Hawiian Pizza',
          description: 'Satan made this pizza. eat at your own risk',
          photo_url: 'https://img.grouponcdn.com/deal/8DDtq5XRzVnLXEUnPHPd/p2-2048x1229/v1/c700x420.jpg',
          cost: '16.66',
          restaurant_id: 2
        }
        
      ]);
    });
};
