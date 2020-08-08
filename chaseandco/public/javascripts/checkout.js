// const form = document.querySelector('form')

let cart = JSON.parse(localStorage.getItem('products')) || [];
let myStorage = window.localStorage;
let checkoutButton = document.getElementById('goToCheckout');

checkoutButton.addEventListener('click', event => {
    let url = window.location.href;
    let hash = location.hash;

    let lineItems = JSON.stringify(cart)
    
    window.location.pathname = `/checkout/${lineItems}`;
})


let addToCart = (productId, qty) => {
    cart.push({productId, qty})
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