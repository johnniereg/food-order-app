require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twiPhone = process.env.TWILIOPHONE;

const twilio = require('twilio')(accountSid, authToken);
const sendMessage = (toNumber, fromNumber, body) => {
  return twilio.messages.create({
    to: toNumber,
    from: fromNumber,
    body: body,
  });
};


/**
 * Sends a text message to the restaurantOwner with the order details.
 * @param {object} order An individual order object.
 * @param {string} restaurantNumber The number of the restraunt to whom the text should be sent.
 * @returns {promise} The promise of a sent text message.
 */
const send_order = (order, restaurantNumber) => {
  const {order_id, phone_number, cost, dishes } = order;
  let textMessage = [`Order #: ${order_id}`, `Order for: ${phone_number}`,`Price: ${cost/100}`];
  // collect the dishes and dish amounts
  const dishList = {};
  dishes.forEach((item) => (item in dishList) ? dishList[item]++ : dishList[item] = 1);
  for(let dish in dishList){
    textMessage.push(`${dish} x ${dishList[dish]}`);
  }
  return sendMessage(restaurantNumber, twiPhone, textMessage.join('\n'));
};

const send_confirmation = (order) => {
  if(order){
    const {phone_number} = order;
    const textMessage = [
      'Your order has been confirmed!',
      `Estimated eta ${order.order_time} mins.`,
      `For up-to-date order details, please visit http://localhost:8080/orders/${order.order_id}`
    ];
    return sendMessage(phone_number, twiPhone, textMessage.join('\n'));
  }
};

module.exports = {
  send_order,
  send_confirmation
};
