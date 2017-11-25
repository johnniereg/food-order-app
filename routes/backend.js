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
    const { description, price } = req.body;
    dbHelpers.update_item('dishes',{id: dish_id}, {description, cost: price})
      .then(() => {
        res.send('/backend/menu');
      }).
      catch((err) => {
        console.log(err);
      });
  });



  return router;
};
