var express = require('express');
var router = express.Router();
const { key } = require('../data.js')
const stripe = require('stripe')(key);



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Chase and Co.' });
});

/* GET bags page. */
router.get('/bags', function (req, res, next) {
  // Set your secret key. Remember to switch to your live secret key in production!
  // See your keys here: https://dashboard.stripe.com/account/apikeys

  // return all products for viewing on bags page
  stripe.products.list(
    {limit: 3},
    function(err, bags) {
      if (err) {
        res.render('bags', {title: 'Purses', err})
      } else {
        res.render('bags', { title: 'Purses', bags });
      }
    }
  );
});

router.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd"
  });
  res.send({
    clientSecret: paymentIntent.client_secret
  });
});

const calculateOrderAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

module.exports = router;
