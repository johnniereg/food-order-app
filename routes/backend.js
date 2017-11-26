const express = require('express');
const cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
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
  return router;
};
