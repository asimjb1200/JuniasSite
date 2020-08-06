// const form = document.querySelector('form')
console.log(window.location.href)
let cart = [];
let myStorage = window.localStorage;

function addToCart(productId, name, qty) {
    // cart.push({productId, qty })
    myStorage.setItem('product', productId)
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