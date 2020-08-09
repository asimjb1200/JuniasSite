// const form = document.querySelector('form')

let cart = JSON.parse(localStorage.getItem('products')) || [];
let myStorage = window.localStorage;


document.addEventListener('click', event => {
    if (event.target.id === 'goToCheckout') {
        let url = window.location.href;

        let lineItems = JSON.stringify(cart)

        window.location.pathname = `/checkout/${lineItems}`;
    } else if (event.target.id === 'submit-cart') {
        let url = window.location.href;

        let lineItems = JSON.stringify(cart)

        window.location.pathname = `/submit-cart/${lineItems}`;
    }
})

if (window.location.pathname.includes('submit-cart')) {
    let stripe = Stripe('pk_test_UtttavKVQLal6BPjzpFhAXZy00h8H6P8XV')
    let checkoutButton = document.getElementById('checkout-button');

    var sessionId = checkoutButton.getAttribute("data-secret")

    checkoutButton.addEventListener('click', function () {
        stripe.redirectToCheckout({
            // Make the id field from the Checkout Session creation API response
            // available to this file, so you can provide it as argument here
            // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
            sessionId
        }).then(function (result) {
            // If `redirectToCheckout` fails due to a browser or network
            // error, display the localized error message to your customer
            // using `result.error.message`.
        });
    });
}


let addToCart = (productId, qty) => {
    cart.push({ productId, qty })
    myStorage.setItem('products', JSON.stringify(cart))
}

let isDuplicate = (productId, qty) => {
    let unique = false;
    let custCart = JSON.parse(myStorage.getItem('products'));
    custCart.map(item => {
        if (item.productId === productId) {
            unique = true
            item.qty = qty
        }
    });
    myStorage.setItem('products', JSON.stringify(custCart))
    return unique
}

if (window.location.pathname.includes('details')) {
    let productBtn = document.getElementsByClassName('productBtn')[0];

    productBtn.addEventListener('click', event => {
        const qty = document.querySelector('input').value
        let item = event.srcElement.id;
        if (cart.length > 0) {
            if (isDuplicate(item, qty)) {
                alert('Item updated')
                return
            } else {
                addToCart(item, qty);
                alert('Item Added')
            }
        } else {
            addToCart(item, qty);
            alert('Item Added')
        }
    })
}

if (window.location.pathname === '/checkout') {
    console.log(cart)
}



// form.addEventListener('submit', event => {
//     // submit event detected
//     event.preventDefault()
//     let formData = new FormData(form);
//     let request = new XMLHttpRequest();

//     formData.append('lineItems', lineItems)

//     console.log(event)

//     console.log(form.elements)
// })