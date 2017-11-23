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

/* Gets the dishes for a given restaurant
 */
app.get('/api/restaurants/:id', (req, res) => {
  const { id } = req.params;
  restaurantHelpers.get_dishes(id)
    .then( dishes => {
      res.json(dishes);
    });
});

app.get('/api/restaurants/:id/orders', (req, res) => {
  const { id } = req.params;
  restaurantHelpers.get_orders(id)
    .then((orders) => {
      res.json(orders);
    });
});

// Home page
app.get('/', (req, res) => {
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
  console.log(req.body);
  let order = req.body;
  order.id = Math.ceil(Math.random()*1000);
  if(usesms){
        twilio.messages.create({
          to: myphone,
          from: twiphone,
          body: `ORDER MADE for ${req.body.order.phone_number} Number of items: ${req.body.order.cost}`
        }).then((message) => console.log(message.sid))
          .then(() => {
            res.send('Order SUCESSFUL');
          });
      }else{
        order.order_time=order.dishes.length*10;
      }
  console.log("ordertime ="+order.order_time)
  restaurantHelpers.make_order(order).then(() => {
      console.log("Order sent to DB.");
    });
    res.send('complete');

});

app.get('/checkout', (req, res) => {
  /*knex.select().from('orders').then( function (result) {
    console.log(result);
  });*/
  res.render("orders");
});

app.get('/orders/status/:id', (req, res) => {
  restaurantHelpers.get_orders(1)
    .then( orders => {
      let orderInfo = null;
      for(let order of orders){
        if(order.order_id == req.params.id){
          orderInfo = {
            dishes: order.dishes,
            time: order.order_time
          };
        }
      }
      res.render('status', orderInfo);
    });
});

app.listen(port, () => {
  console.log('Example app listening on port ' + port);
  //console.log(myphone);
  //console.log(twiphone);
  //console.log(authToken);
  //console.log(accountSid);
});
