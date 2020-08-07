var express = require('express');
var router = express.Router();
const { key } = require('../stripekey/data.js')
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
    {limit: 6},
    function(err, bags) {
      if (err) {
        res.render('bags', {title: 'Purses', err})
      } else {
        res.render('bags', { title: 'Purses', bags });
      }
    }
  );
});

router.get('/checkout', function(req, res, next) {
  res.render('checkout')
});

router.get('/details/:productId', function(req, res, next) {
  let productId = req.params.productId;

  // fetch that products details
  stripe.products.retrieve(
    productId,
    function(err, product) {
      // res.render('itemDetail', {product})
      stripe.prices.list(
        {limit: 1, product: productId},
        function(err, price) {
          // asynchronously called
          res.render('itemDetail', {product, price: (price.data[0].unit_amount)/100, })
        }
      );
    }
  );
}) 

router.post('/submit-order', (req, res) => {
  console.log(req.body)
  res.end()
  // extract customer data
  const {firstName, lastName, email, street, city, state, postal_code} = req.body;

  // create a session for the customer
  // const session = await stripe.checkout.sessions.create({
  //   payment_method_types: ['card'],
  //   line_items: [{
  //     price_data: {
  //       currency: 'usd',
  //       product_data: {
  //         name: 'T-shirt',
  //       },
  //       unit_amount: 2000,
  //     },
  //     quantity: 1,
  //   }],
  //   mode: 'payment',
  //   success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
  //   cancel_url: 'https://example.com/cancel',
  // });

  // create the customer in stripe
  // stripe.customers.create(  
  //   {
  //     name: `${firstName} ${lastName}`,
  //     email,
  //     shipping: {
  //         address: {
  //           name: `${firstName} ${lastName}`,
  //           line1: street,
  //           city,
  //           state,
  //           postal_code
  //       }
  //     },
  //     description: 'My First Test Customer (created for API docs)',
  //   },
  //   function(err, customer) {
  //     // asynchronously called
  //     res.end()
  //   }
  // );
})

// router.post("/create-payment-intent", async (req, res) => {
//   const { items } = req.body;
//   // Create a PaymentIntent with the order amount and currency
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: calculateOrderAmount(items),
//     currency: "usd"
//   });
//   res.send({
//     clientSecret: paymentIntent.client_secret
//   });
// });

const calculateOrderAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

module.exports = router;
