module.exports = function(db){
  return function(req, res){
    const id = req.params.id;
    db('dishes').select()
    .where('restaurant_id', id)
    .then( dishes => {
      res.json(dishes)
    })
  }
}
