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
const dataHelpers = require('./utils/data-helpers');
const dbHelpers = require('./utils/database-helpers')(knex);
const restaurantRoutes = require('./routes/restaurants');
const timeCalculator = require('./utils/timeCalculator')(knex);
const twilioHelpers = require('./utils/twilio-helpers');
const backendRoutes = require('./routes/backend');
const restaurantNumber = process.env.MYPHONE;
const fileUpload = require('express-fileupload');

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
app.use(fileUpload());
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

// Restaurant API routes
app.use('/api/restaurants', restaurantRoutes(dbHelpers));

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
    // @TODO put this in a seperate function that outputs an object: {orderStatusTime, name, address, phone_number, dishList, percentFinished, orderPrice}
    const timeRemaining = allResolves[0], order = allResolves[1];
    const dishList = {};
    
    // Formatting the dish list
    order.dishes.forEach((item) => (item in dishList) ? dishList[item]++ : dishList[item] = 1);

    // calculating percentage and time status message
    let percentFinished = ((timeRemaining/order.order_time) * 100) - 100 > 15 ? ((timeRemaining/order.order_time) * 100) * 100 : 15;
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
    res.render('status', {orderStatusTime, name, address, phone_number, dishList, percentFinished, orderPrice: order.cost});
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
      dbHelpers.update_item('orders', {'id': order_id}, {'order_time': order_eta, time_accepted: knex.fn.now()})
        .then(order_id => dbHelpers.get_order(order_id[0]))
        .then(twilioHelpers.send_confirmation);
    }
  }
});

app.listen(port, () => {
  console.log('Example app listening on port ' + port);
});
