# Houses of Noodles Food Order App

## See the app live at [https://serene-ridge-47454.herokuapp.com/](https://serene-ridge-47454.herokuapp.com/)

This food order app is an application built for the fictional Chinese food restaurant, House of Noodles. The requirements for this project were:

* Hungry clients of a fictitious restaurant can visit its website, Select one or more dishes and place an order for pick-up.
* They will receive a notification when their order is ready.
* When an order is placed the restaurant receives the order via SMS. The restaurant can then specify how long it will take to fulfill it. Once they provide this information, the website updates for the client and also notifies them via SMS.

In addition to these requirements, we developed a backend interface for the restaurant owner and their employees to edit menu items on the website, review orders, and manually mark them as complete.

The project was completed in 5 days.

## Final Product

!["Menu"](https://github.com/johnniereg/food-order-app/blob/master/docs/menu.png)
!["Shopping Cart"](https://github.com/johnniereg/food-order-app/blob/master/docs/shopping-cart.png)
!["Add-Modifty Items"](https://github.com/johnniereg/food-order-app/blob/master/docs/add-modify-dish.png)

## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Run migrations: `npm run knex migrate:latest`
6. Run the seed: `npm run knex seed:run`
7. Run the server: `npm run local`
8. Visit `http://localhost:8080/`

## Dependencies

- Node 5.10.x or above
- NPM 3.8.x or above
- bcrypt: 1.0.3
- body-parser: 1.18.2
- cookie-parser: 1.4.3
- cookie-session: 2.0.0-beta.3
- dotenv: 2.0.0
- ejs: 2.5.7
- express: 4.16.2
- express-fileupload: 0.3.0
- knex: 0.14.1
- knex-logger: 0.1.0
- morgan: 1.9.0
- node-sass-middleware: 0.11.0
- pg: 7.4.0
- twilio: 3.10.0

Logo by: [Juraj Sedlák](https://thenounproject.com/yumminky/)
