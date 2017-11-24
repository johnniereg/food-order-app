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
const restaurantnumber = '+17786796398';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const myphone = process.env.MYPHONE;
const twiphone = process.env.TWILIOPHONE;
const usesms = false;
//SET usesms TO TRUE TO RECIEVE SMS, USE WITH CARE
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
  const order = req.body;
  //let order = { phone_number: '+17786796398', cost: 4200,restaurant_id:1,  dishes: [1, 5, 7, 9]  }
  order.id = Math.ceil(Math.random() * 1000);
  if( usesms ){
    twilio.messages.create({
      to: restaurantnumber,
      from: twiphone,
      body: `ORDER MADE for ${order.phone_number}Id: ${order.id}`
    }).then((message) => console.log(message.sid)).then(() => {
      res.send('Order SUCESSFUL');
    });
  }else{
    order.order_time = order.dishes.length * 10;
  }
  console.log("ordertime =" + order.order_time);
  restaurantHelpers.make_order(order, 1).then(() => {
    console.log("Order sent to DB.");
  });
  res.send('order id = ' + order.id);
});
//sms rout
app.post('/sms', (req, res) => {
  if(usesms){
    let bod = req.body.Body;
    //Expecting format of incoming text to be Id,###,eta,### for example: Id,676,eta,40
    //meaning order id 767 will be done in 40 minutes
    //split along commas
    bod = bod.split(",");
    //check to ensure format is correct
    if(bod[0] === 'Id' && bod[2] === 'eta'){
    //Select(*) from orders where id = bod[1]
      knex('orders').where('id', '=', bod[1]).select().then( (result) => {
        //if the result is not empty
        if(result !== []){
          twilio.messages.create({
            to: result[0]['phone_number'],
            from: twiphone,
            body: "Order " + bod[1] + " received, ETA" + bod[3] + " minutes."
          }).then((message) =>{
          //log sid for future reference
          console.log(message.sid) });
        }else{
        //value if order is not found. 
        console.log("ORDER NOT FOUND");
      }
    });
  //add 
  knex('orders').where('id', '=', bod[1]).update({'order_time':bod[3]}).then(function (status) {
  
       console.log(count);
  });
  //redirect to no response url
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
