require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twiPhone = process.env.TWILIOPHONE;

const twilio = require('twilio')(accountSid, authToken);
const send_message = (toNumber, fromNumber, body) => {
  return twilio.messages.create({
    to: toNumber,
    from: fromNumber,
    body: body,
  });
};


/**
 * send_order - Sends a text message to the restaurantOwner with the order details.
 * 
 * @param {object} order An individual order object.
 * @param {string} restaurantNumber The number of the restraunt to whom the text should be sent.
 * @returns {promise} The promise of a sent text message.
 */
const send_order = (order, restaurantNumber) => {
  const {order_id, phone_number, cost, dishes } = order;
  let textMessage = [`Order #: ${order_id}`, `Order for: ${phone_number}`,`Price: ${cost}`];
  // collect the dishes and dish amounts
  const dishList = {};
  dishes.forEach((item) => (item in dishList) ? dishList[item]++ : dishList[item] = 1);
  for(let dish in dishList){
    textMessage.push(`${dish} x ${dishList[dish]}`);
  }
  return send_message(restaurantNumber, twiPhone, textMessage.join('\n'));
};



/**
 * send_confirmation - Sends a confirmation text to the phone associated with a given order.
 *
 * @param {object} order An object representing the order you'd like to confirm.
 * @return {object} Returns a promise of a sent text message.
 */
const send_confirmation = (order) => {
  if(order){
    const {phone_number} = order;
    const textMessage = [
      'Your order has been confirmed!',
      `Estimated eta ${order.order_time} mins.`,
      `For up-to-date order details, please visit https://serene-ridge-47454.herokuapp.com/orders/${order.order_id}`
    ];
    return send_message(phone_number, twiPhone, textMessage.join('\n'));
  }
};

module.exports = {
  send_order,
  send_confirmation,
  send_message,
  twiPhone
};
