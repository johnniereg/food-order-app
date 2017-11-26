require('dotenv').config();
const port = process.env.PORT || 8080;
const env = process.env.ENV || 'production';
const express = require('express');
const bodyParser = require('body-parser');
const sass = require('node-sass-middleware');
const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig[env]);
const morgan = require('morgan');
const knexLogger = require('knex-logger');
const dataHelpers = require('./utils/data-helpers');
const restaurantHelpers = require('./utils/restaurant-helpers')(knex);
const restaurantRoutes = require('./routes/restaurants');
const timeCalculator = require('./utils/timeCalculator')(knex);
const twilioHelpers = require('./utils/twilio-helpers');
const restaurantNumber = '+12508857405';
// use texts?
const usesms = true;
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

let restaurantInfo = {};
app.use(express.static('public'));

app.use((req, res, next) => {
  restaurantHelpers.get_restaurant({id: 1})
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
app.use('/api/restaurants', restaurantRoutes(restaurantHelpers));


/**
 * UI for ordering from a specific restaurant.
 * How this restaurant is chosen can be varied.
 */
app.get('/', (req, res) => {
  res.render('index', restaurantInfo);
});

app.post('/checkout', (req, res) => {
  const order = req.body;
  console.log("What is post checkout order: ", order);
  restaurantHelpers.make_order(order, 1).then((order_id) => {
    // Sends a response to the AJAX request with redirect route.
    res.status(200).send({result: 'redirect', url:`/orders/${order_id}`});
    return restaurantHelpers.get_order(order_id);
  })
    .then((order) => {
      if(usesms){
        twilioHelpers.send_order(order, restaurantNumber);
      }
    })
    // error handling
    .catch(err => {
      console.log('Post to checkout error', err);
    });
});

app.get('/orders/:id', (req, res) => {

  const { name, address, phone_number } = restaurantInfo;
  Promise.all([
    timeCalculator.timeCalculator(req.params.id),
    restaurantHelpers.get_order(req.params.id)
  ]).then((allResolves) => {
    const timeRemaining = allResolves[0], order = allResolves[1];

    const orderPrice = dataHelpers.to_dollars(order.cost);
    const dishList = {};
    let percentFinished = Math.round(timeRemaining/order.order_time);
    // Formatting the dish list
    order.dishes.forEach((item) => (item in dishList) ? dishList[item]++ : dishList[item] = 1);

    let orderStatusTime = '';
    if(timeRemaining){
      orderStatusTime = `${timeRemaining} minutes until ready!`;
      if (timeRemaining < 0){
        percentFinished = 100;
        orderStatusTime = 'Your order is ready!';
      }
    } else {
      percentFinished = 0;
      orderStatusTime = 'Your order is pending acceptance.';
    }
    res.render('status', {orderStatusTime, name, address, phone_number, dishList, percentFinished, orderPrice});
  });
});

//sms rout
app.post('/sms', (req) => {
  const textInformation = req.body.Body.split(' ');
  const order_id = Number(textInformation[0]);
  const order_eta = Number(textInformation[1]);
  if(usesms){
    //Expecting format of incoming text to be ### for example: 40
    if(order_eta && order_id){
      restaurantHelpers.update_order_time(order_id, order_eta)
        .then(order_id => restaurantHelpers.get_order(order_id[0]))
        .then(twilioHelpers.send_confirmation);
    }
  }
});

app.listen(port, () => {
  console.log('Example app listening on port ' + port);
});
