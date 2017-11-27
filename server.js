require('dotenv').config();
const port = process.env.PORT || 8080;
const env = process.env.ENV || 'development';
const restaurantNumber = process.env.MYPHONE;
// 3rd party modules
const express = require('express');
const bodyParser = require('body-parser');
const sass = require('node-sass-middleware');
const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig[env]);
// const morgan = require('morgan');
// const knexLogger = require('knex-logger');
// utilities
const dbHelpers = require('./utils/database-helpers')(knex);
const dataHelpers = require('./utils/data-helpers');
const timeCalculator = require('./utils/timeCalculator')(knex);
const twilioHelpers = require('./utils/twilio-helpers');
// routes
const backendRoutes = require('./routes/backend');
const restaurantRoutes = require('./routes/restaurants');
// use texts?
const usesms = true;

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
// Node sass middleware
app.use('/styles', sass({
  src: __dirname + '/styles',
  dest: __dirname + '/public/styles',
  debug: false,
  outputStyle: 'expanded'
}));

app.use(express.static('public'));

// making this available 'globally'
let restaurantInfo = {};
app.use((req, res, next) => {
  restaurantInfo = {};
  dbHelpers.get_restaurant({id: 1})
    .then( restaurant => {
      restaurantInfo = {
        name: restaurant.restaurant_name,
        address: restaurant.address,
        phone_number: restaurant.phone_number
      };
      next();
    });
});

// Restaurant API routes
app.use('/api/restaurants', restaurantRoutes(dbHelpers));

// client backend routes
app.use('/backend', backendRoutes(dbHelpers));

/**
 * UI for ordering from a specific restaurant.
 * How this restaurant is chosen can be varied.
 */
app.get('/', (req, res) => {
  res.render('index', restaurantInfo);
});

app.post('/checkout', (req, res) => {
  const order = req.body;
  dbHelpers.make_order(order, 1).then((order_id) => {
    // Sends a response to the AJAX request with redirect route.
    res.status(200).send({result: 'redirect', url:`/orders/${order_id}`});
    return dbHelpers.get_order(order_id);
  })
    .then((order) => {
      if(usesms){
        twilioHelpers.send_order(order, restaurantNumber);
      }
    });
});

app.get('/orders/:id', (req, res) => {
  const { name, address, phone_number } = restaurantInfo;
  Promise.all([
    timeCalculator.timeCalculator(req.params.id),
    dbHelpers.get_order(req.params.id)
  ]).then((allResolves) => {
    const timeRemaining = allResolves[0], order = allResolves[1];
    const dishList = {};

    // Formatting the dish list
    order.dishes.forEach((item) => (item in dishList) ? dishList[item]++ : dishList[item] = 1);


    // calculating percentage and time status message
    let percentFinished = 100 - ((timeRemaining/order.order_time) * 100) > 15 ? 100 -((timeRemaining/order.order_time) * 100) : 15;
    if(timeRemaining <= 0){
      percentFinished = 100;
    }
    if(!order.order_time){
      percentFinished = 0;
    }
    // Get the order status message.
    let orderStatus = dataHelpers.get_order_status(timeRemaining);

    res.render('status', {orderStatus, name, address, phone_number, dishList, percentFinished, orderPrice: order.cost});
  });
});

//sms route
app.post('/sms', (req) => {
  const textInformation = req.body.Body.split(' ');
  const order_id = Number(textInformation[0]);
  const order_status = textInformation[1];
  if(usesms){
    //Expecting format of incoming text to be ### for example: 40
    if(order_status && order_id){
      if(order_status === 'done'){
        dbHelpers.confirm_order(order_id);
        return;
      }
      dbHelpers.update_item('orders', {'id': order_id}, {'order_time': Number(order_status), time_accepted: knex.fn.now()})
        .then(order_id => dbHelpers.get_order(order_id[0]))
        .then(twilioHelpers.send_confirmation);
    }
  }
});

//footer nav routes
app.get('/aboutus', (req, res) => {
  res.render('about-us', restaurantInfo);
});

app.get('/privacypolicy', (req, res) => {
  res.render('privacy-policy', restaurantInfo);
});

app.get('/terms', (req, res) => {
  res.render('terms-of-service', restaurantInfo);
});

app.listen(port);
