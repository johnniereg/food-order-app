const express = require('express');

module.exports = function(dbHelpers) {

  const router = new express.Router();
  /**
   * Gets the dishes for id {number} restaurant
   */
  router.get('/home', (req, res) => {
    dbHelpers.get_orders(1)
      .then( orders => {
        console.log(orders);
        res.render('./backend/backend-home', {orders});
      });
  });
  return router;
};
