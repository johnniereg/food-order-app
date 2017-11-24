require('dotenv').config();

const port = process.env.PORT || 8080;
const env = process.env.ENV || 'development';
const express = require('express');
const bodyParser = require('body-parser');
const sass = require('node-sass-middleware');
const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig[env]);
const morgan = require('morgan');
const knexLogger = require('knex-logger');
const restaurantHelpers = require('./utils/restaurant-helpers')(knex);
const restaurantnumber ='+17786796398';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const myphone = process.env.MYPHONE;
const twiphone = process.env.TWILIOPHONE;
const usesms = false; //SET TO TRUE TO RECIEVE SMS
const twilio = require('twilio')(accountSid, authToken);
const app = express();
app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.use(bodyParser.urlencoded({ extended: true }));

restaurantHelpers.make_order({ phone_number: '12315515', cost: 4200,  dishes: [1, 5, 7, 9] });
// Node sass middleware
app.use('/styles', sass({
  src: __dirname + '/styles',
  dest: __dirname + '/public/styles',
  debug: true,
  outputStyle: 'expanded'
}));

app.use(express.static('public'));

/**
 * Gets the dishes for id {number} restaurant
 */
app.get('/api/restaurants/:id', (req, res) => {
  const { id } = req.params;
  restaurantHelpers.get_dishes(id)
    .then( dishes => {
      res.json(dishes);
    });
});


/**
 * Get the orders for id {number} restaurant.
 */
app.get('/api/restaurants/:id/orders', (req, res) => {
  const { id } = req.params;
  restaurantHelpers.get_orders(id)
    .then((orders) => {
      res.json(orders);
    });
});

/**
 * UI for ordering from a specific restaurant.
 * How this restaurant is chosen can be varied.
 */
app.get('/', (req, res) => {
  // Restaurant does not need to be chosen by ID.
  restaurantHelpers.get_restaurant({id: 1})
    .then( restaurant => {
      const restaurantInfo = {
        name: restaurant.restaurant_name,
        address: restaurant.address,
        phone_number: restaurant.phone_number
      };
      res.render('index', restaurantInfo);
    });
});

app.post('/checkout', (req, res) => {
  const order = req.body;
  restaurantHelpers.make_order(order, 1).then((order_id) => {
    if(usesms){
      twilio.messages.create({
        to: restaurantnumber,
        from: twiphone,
        body: `ORDER MADE for ${order.phone_number}, Id: ${order_id}`
      }).then((message) => console.log(message.sid))
        .then(() => {
          res.send('Order SUCESSFUL');
        });
      return;
    }
    console.log('Sucess! Order sent to DB.');
    console.log('Text would read:', `ORDER MADE for ${order.phone_number}, Id: ${order_id}`);
  })
  // error handling
    .catch(err => {
      console.log('Post to checkout error', err);
    });
});

//sms rout
app.post('/sms',(req, res) => {

  if(usesms){
  let bod = req.body.Body;
  bod = bod.split(",");

  if(bod[0]==='Id' && bod[2] === 'eta'){
    //res.sendStatus(200);
    console.log(bod[1]);
    knex('orders').where('id','=',bod[1]).select().then( (result) => {
      console.log(result[0]['phone_number']);
      if(result!=[]){
        twilio.messages.create({
            to: result[0]['phone_number'],
            from: twiphone,
            body: "Order "+bod[1]+" received, ETA" + bod[3]+" minutes."
        }).then((message) =>{


        console.log(message.sid)});
      }else{
        console.log("ORDER NOT FOUND");
      }
    });
  knex('orders').where('id', '=', bod[1]).update({'order_time':bod[3]}).then(function (count) {
       console.log(count);
  });
  res.redirect("http://twimlets.com/echo?Twiml=%3CResponse%3E%3C%2FResponse%3E");
  }else{
    res.redirect("http://twimlets.com/echo?Twiml=%3CResponse%3E%3C%2FResponse%3E");
  }
  }else{
    res.send("NOT USING SMS");
  }
});
app.get('/checkout', (req, res) => {
  /*knex.select().from('orders').then( function (result) {
    console.log(result);
  });*/
  res.render("orders");
});

app.listen(port, () => {
  console.log('Example app listening on port ' + port);
  //console.log(myphone);
  //console.log(twiphone);
  //console.log(authToken);
  //console.log(accountSid);
});
