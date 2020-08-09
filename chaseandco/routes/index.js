var express = require('express');
var router = express.Router();
const { key } = require('../stripekey/data.js');
const { response } = require('express');
const stripe = require('stripe')(key);



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Chase and Co.' });
});

/* GET bags page. */
router.get('/bags', function (req, res, next) {

  // return all products for viewing on bags page
  stripe.products.list(
    { limit: 20 },
    function (err, bags) {
      if (err) {
        res.render('bags', { title: 'Purses', err })
      } else {
        res.render('bags', { title: 'Purses', bags });
      }
    }
  );
});

router.get('/checkout/:lineItems?', function (req, res, next) {
  let lineItems = JSON.parse(req.params.lineItems)
  let userCart = []

  if (lineItems.length > 0) {
    for (let index = 0; index < lineItems.length; index++) {
      const element = lineItems[index];
      stripe.products.retrieve(
        element.productId,
        function (error, product) {
          if (error) {
            console.log(error)
          } else {
            stripe.prices.list(
              { limit: 1, product: product.id },
              function (err, price) {
                // asynchronously called
                if (err) {
                  console.log(err);
                } else {
                  userCart.push({ product, price: price.data[0].unit_amount, qty: element.qty })
                  if (userCart.length === lineItems.length && !err) {
                    res.render('cart', { items: userCart })
                  }
                }
              }
            );
          }
        }
      )
    }
  } else {
    res.render('cart', { items: null })
  }
});

router.get('/details/:productId', function (req, res, next) {
  let productId = req.params.productId;

  // fetch that products details
  stripe.products.retrieve(
    productId,
    function (err, product) {
      // res.render('itemDetail', {product})
      stripe.prices.list(
        { limit: 1, product: productId },
        function (err, price) {
          // asynchronously called
          res.render('itemDetail', { product, price: (price.data[0].unit_amount) / 100, })
        }
      );
    }
  );
})

// router.get('/id')

router.get('/submit-cart/:lineItems', (req, res) => {
  // extract product data from the request
  let userCart = JSON.parse(req.params.lineItems)

  let line_items = [];

  userCart.forEach(element => {
    // retrive price data for each product
    stripe.products.retrieve(
      element.productId,
      function (err, item) {
        stripe.prices.list(
          { limit: 1, product: item.id },
          async function (err, price) {
            let name = item.name;
            console.log(name)
            // asynchronously called
            line_items.push(
              {
                price_data: {
                  currency: 'usd',
                  product_data: {
                    name
                  },
                  unit_amount: parseInt(price.data[0].unit_amount),
                },
                quantity: parseInt(element.qty)
              }
            );

            // once every line item is added, start the checkout session
            if (line_items.length === userCart.length) {
              console.log('hey')
              const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items,
                shipping_address_collection: {
                  allowed_countries: ['US'],
                },
                mode: 'payment',
                success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url: 'https://example.com/cancel',
              });

              console.log(session)

              res.render('payment', { session_id: session.id })
            }
          }
        )
      }
    );
  });
})

module.exports = router;
