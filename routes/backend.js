const express = require('express');
const cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const dataHelpers = require('../utils/data-helpers');
const fs = require('fs');
// const dataHelpers = require('../utils/data-helpers');
module.exports = function(dbHelpers) {
  const router = new express.Router();

  router.use(cookieParser());
  router.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }));

  router.get('/login',(req, res) => {
    //res.send("welcome to login");
    res.render('./backend/backend-login');
  });

  router.post('/login',(req, res) => {
    console.log(req.body);
    let nme = req.body['userId'];
    let pwd = req.body['password'];
    dbHelpers.get_users(nme).then( user=>{
      if(user){
        if(bcrypt.compareSync(pwd,user.password)){
          req.session.userID=nme;
          res.redirect('http://localhost:8080/backend/home');
        }else{
          res.send("INVALID PASSWORD");
        }
      }else{
        res.send("USER NOT FOUND");
      }
    });
  });
  router.get('/home', (req, res) => {
    console.log(req.session.userID);
    if(req.session.userID===undefined){
      res.redirect('http://localhost:8080/backend/login');
    }else{
      dbHelpers.get_users(req.session.userID).then(user =>{
        dbHelpers.get_orders(user.restaurant)
          .then( orders => {
            res.render('./backend/backend-home', {orders});
        });
      });
    }
  });

  router.get('/menu', (req, res) => {
    dbHelpers.get_dishes(1)
      .then((dishes) => {
        let formattedDishes = dishes.map(dish => {
          dish.cost = dataHelpers.to_dollars(dish.cost);
          return dish;
        });
        res.render('./backend/menu', {dishes: formattedDishes});
      });
  });

  router.put('/dishes/:id', (req, res) => {

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

  return router;
};
