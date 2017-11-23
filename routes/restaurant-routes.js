module.exports = function(db){
  return function(req, res){
    const id = req.params.id;
    console.log(id);
    db('dishes').select().then(data => {
      console.log(data);
    })
    // res.json(dishes)
  }
}
