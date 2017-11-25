const express = require('express');

module.exports = function(dbHelpers) {

  const router = new express.Router();
  router.get('/home', (req, res) => {
    dbHelpers.get_orders(1)
      .then( orders => {
        res.render('./backend/backend-home', {orders});
      });
  });
  return router;
};
