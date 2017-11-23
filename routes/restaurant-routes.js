module.exports = function(db){
  // Gets the dishes of a specific restaurant based on their id
  const get_dishes = (req, res) => {
    const id = req.params.id;
    db('dishes').select()
      .where('restaurant_id', id)
      .then( dishes => {
        res.json(dishes);
      });
  };
  return {
    get_dishes
  };
};
