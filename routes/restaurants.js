const express = require('express');

module.exports = function(restaurantHelpers) {

  const router = new express.Router();

  /**
   * Gets the dishes for id {number} restaurant
   */
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    restaurantHelpers.get_dishes(id)
      .then( dishes => {
        res.json(dishes);
      });
  });

  /**
   * Get the orders for id {number} restaurant.
   */
  router.get('/:id/orders', (req, res) => {
    const { id } = req.params;
    restaurantHelpers.get_orders(id)
      .then((orders) => {
        res.json(orders);
      });
  });

  return router;
};
