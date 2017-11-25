const express = require('express');
const dataHelpers = require('../utils/data-helpers')

module.exports = function(dbHelpers) {
  const router = new express.Router();

  router.get('/home', (req, res) => {
    dbHelpers.get_orders(1)
      .then( orders => {
        res.render('./backend/backend-home', {orders});
      });
  });

  router.get('/menu', (req, res) => {
    dbHelpers.get_dishes(1)
      .then((dishes) => {
        res.render('./backend/menu', {dishes});
      });
  });

  router.put('/dishes/:id', (req, res) => {
    let dish_id = req.params.id;
    let changes = {};
    let description = req.body.description;
    let cost = req.body.price;
    console.log(req.body);
    if(cost){
      // if there is a dollar sign
      cost.indexOf('$') ? cost = Number(cost.slice(cost.indexOf('$'))) * 100 : Number(cost) * 100;
      if(isNaN(cost)){
        res.json({message: 'Please input a valid number into the price field.'});
        return;
      }
      changes['cost'] = cost;
    }
    if(description){
      changes['description'] = description;
    }
    dbHelpers.update_item('dishes',{id: dish_id}, changes)
      .then(() => {
        res.send('/backend/menu');
      }).
      catch((err) => {
        console.log(err);
      });
  });



  return router;
};
