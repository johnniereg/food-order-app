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

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const myphone = process.env.MYPHONE;
const twiphone = process.env.TWILIOPHONE;

const restaurantRoutes = require('./routes/restaurant-routes')(knex);

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

// Mount all resource routes
app.use('/api/restaurants/:id', restaurantRoutes.get_dishes);

// Home page
app.get('/', (req, res) => {
  restaurantRoutes.get_restaurant({id: 1})
    .then( restaurant => {
      const restaurantInfo = {
        name: restaurant.restaurant_name,
        address: restaurant.address,
        phone_number: restaurant.phone_number
      };
      res.render('index', restaurantInfo);
    });
});

app.get('/orders', (req, res) => {
  knex.select().from('orders').then( function (result) {
    console.log(result);
  });
  res.send("Success");
});

app.post('/orders', (req, res) => {
  knex('orders').insert(
    { phone_number: '1-555-555-0002',
      cost:10,
      restaurant_id:1,
      order_time: '45'
    }).then( function (result) {
    console.log(result);
  });
  res.send('POST SUCESSFUL');
});

app.listen(port, () => {
  console.log('Example app listening on port ' + port);
  console.log(myphone);
  console.log(twiphone);
  console.log(authToken);
  console.log(accountSid);
});
