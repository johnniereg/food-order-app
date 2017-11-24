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
const restaurantRoutes = require('./routes/restaurants');
const timeCalculator = require('./utils/timeCalculator')(knex);
const twilioHelpers = require('./utils/twilio-helpers');
const restaurantNumber = process.env.MYPHONE;
const usesms = false; // set true when using SMS
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

// Restaurant API routes
app.use('/api/restaurants', restaurantRoutes(restaurantHelpers));


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
    // res.redirect(`/orders/${order_id}`);
    res.status(200).send({result: 'redirect', url:`/orders/${order_id}`});
    // return restaurantHelpers.get_order(order_id);
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
  timeCalculator.timeCalculator(req.params.id)
    .then((timeRemaining) => {
      res.render('status', {timeRemaining});
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
