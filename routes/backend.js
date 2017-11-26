const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const dataHelpers = require('../utils/data-helpers');
const fs = require('fs');
const cookieSession = require('cookie-session');
// const dataHelpers = require('../utils/data-helpers');
module.exports = function(dbHelpers) {
  const router = new express.Router();

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
      res.send({message: 'Please submit both a user name and a password.'})
    }
    dbHelpers.get_users(nme).then( user =>{
      //@TODO make async
      if(user){
        if(bcrypt.compareSync(pwd,user.password)){
          req.session.userID = nme;
          res.send('/backend');
          return;
        }
      }
      res.send({message: 'The user name or password submitted did not match our records.'});
    });
  });

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

  router.put('/dishes/:id', (req, res) => {
    //@TODO add functionality for name handling.
    //@TODO filter files by mimetype
    const makeUpdateToDish = (changes) => {
      return dbHelpers.update_item('dishes',{id: dish_id}, changes);
    };
    const photo = req.files.photo;
    const description = req.body.description;
    let dish_id = req.params.id;
    let cost = req.body.price;
    let changes = {};

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

  router.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/backend/login');
  });

  return router;
};
