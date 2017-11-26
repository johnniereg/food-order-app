const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const dataHelpers = require('../utils/data-helpers');
const fs = require('fs');
const cookieSession = require('cookie-session');
const fileUpload = require('express-fileupload');
const twilioHelpers = require('../utils/twilio-helpers');

module.exports = function(dbHelpers) {
  const router = new express.Router();

  // File upload middleware
  router.use(fileUpload({
    safeFileNames: true
  }));
  // Cookie session
  router.use(cookieParser());
  router.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }));

  router.get('/login',(req, res) => {
    if(req.session.userID){
      res.redirect('/backend/');
      return;
    }
    res.render('./backend/login');
  });

  router.post('/login',(req, res) => {
    let nme = req.body['userId'];
    let pwd = req.body['password'];
    if(!nme || !pwd){
      res.send({message: 'Please submit both a user name and a password.'});
    }
    dbHelpers.get_users(nme).then( user =>{
      if(user){
        bcrypt.compare(pwd, user.password).then((result) => {
          if(result){
            req.session.userID = nme;
            res.send('/backend');
            return;
          }
          res.send({message: 'The user name or password submitted did not match our records.'});
        });
        return;
      }
      res.send({message: 'The user name or password submitted did not match our records.'});
    });
  });

  // making these 'globally' available.
  let restaurant = undefined;
  let orders = undefined;
  let user = undefined;
  // check if user is logged in...
  router.use((req, res, next) => {
    // reset these each time.
    restaurant = undefined;
    orders = undefined;
    user = undefined;
    if(!req.session.userID){
      res.redirect('/backend/login');
      return;
    }
    // populate restaurant and orders variables.
    dbHelpers.get_users(req.session.userID).then(usr =>{
      user = usr;
      Promise.all([
        dbHelpers.get_orders(user.restaurant),
        dbHelpers.get_restaurant({id: user.restaurant}),
      ]).then( allResolves => {
        orders = allResolves[0];
        restaurant = allResolves[1];
        next();
      });
    });
  });

  // orders page
  router.get('/', (req, res) => {
    res.render('./backend/home', {orders, restaurant});
  });

  router.get('/menu', (req, res) => {
    dbHelpers.get_dishes(user.restaurant)
      .then((dishes) => {
        let formattedDishes = dishes.map(dish => {
          dish.cost = dataHelpers.to_dollars(dish.cost);
          return dish;
        });
        res.render('./backend/menu', {restaurant, dishes: formattedDishes});
      });
  });

  // Updating a dish.
  router.put('/dishes/:id', (req, res) => {
    // function to run when we're done collecting changes.
    const makeUpdateToDish = (changes) => {
      return dbHelpers.update_item('dishes',{id: dish_id}, changes);
    };
    const photo = req.files.photo;
    const description = req.body.description;
    const dish_name = req.body.dish_name;
    let dish_id = req.params.id;
    let cost = req.body.price;
    let changes = {};

    // Collecting changes.
    if(dish_name){
      changes['dish_name'] = dish_name;
    }
    if(description){
      changes['description'] = description;
    }
    if(cost){
      cost = dataHelpers.clean_price_input(cost);
      if(isNaN(cost)){
        res.send({message : 'Please input a valid number'});
        return;
      }
      changes['cost'] = cost;
    }
    if(photo){
      // if the photo is not an image.
      if(photo.mimetype.indexOf('image') === -1){
        res.send({message:'Please submit a valid image file (.jpg or .png recommended).'});
        return;
      }
      changes['photo_url'] = `/images/${photo.name}`;
      fs.writeFile(`./public/images/${photo.name}`, photo.data, () => {
        makeUpdateToDish(changes)
          .then(() => {
            res.send('/backend/menu');
          });
      });
      return;
    }
    makeUpdateToDish(changes).then(() => {
      res.send('/backend/menu');
    });
  });

  // delete an order
  router.delete('/:id/delete', (req, res) => {
    dbHelpers.remove_order(req.params.id).then(() => {
      res.send('/backend/');
    });
  });

  // confirm order
  router.post('/:id/confirm', (req, res) => {
    dbHelpers.confirm_order(req.params.id).then(() => {
      res.send({message: 'Order confirmed!'});
    });
  });

  router.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/backend/login');
  });

  return router;
};
