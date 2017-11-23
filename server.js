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
  const { order } = req.body;
  const orderArray = [];
  for(let item in order){
    orderArray.push(order[item]);
  }
  restaurantHelpers.make_order(orderArray);
  res.send('Your order is confirmed!'); //or whatever we send them
});


app.get('/orders', (req, res) => {
  knex.select().from('orders').then( function (result) {
    console.log(result);
  });
  res.render("orders");
});
//expects
app.post('/orders', (req, res) => {
  console.log(req.body);
  if(req.body['phone_number']!==''&&req.body['cost']!==''&&req.body['restaurant_id']!==''&&req.body['order_time']!==''){
  knex('orders').insert(
    { phone_number: req.body['phone_number'],
      cost:req.body['cost'],
      restaurant_id:req.body['restaurant_id'],
      order_time: req.body['order_time']
    }).then( function (result) {
    console.log(result);
    if(usesms){
    twilio.messages.create({
      to: myphone,
      from: twiphone,
      body: "ORDER MADE for "+req.body['phone_number']+" Number of items:"+req.body['cost']
    }).then((message) => console.log(message.sid));
    }
  });
    res.send('POST SUCESSFUL');
  }else{
    res.send('POST UNSUCESSFUL');
  }
});

app.listen(port, () => {
  console.log('Example app listening on port ' + port);
  //console.log(myphone);
  //console.log(twiphone);
  //console.log(authToken);
  //console.log(accountSid);
});
