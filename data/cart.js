export let cart = JSON.parse(localStorage.getItem('cart'));

if(!cart){
    cart = [{
        productId: '83d4ca15-0f35-48f5-b7a3-1ea210004f2e',
        quantity: 1,
        deliveryOptionId: '3'
    },{
        productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity: 2,
        deliveryOptionId: '2'
    }]
}

export function saveToStorage(){
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId){
    let matchingItem;
    cart.forEach( (cartItem)=>{
        if(productId === cartItem.productId){
            matchingItem = cartItem;
        }
    });

    if(matchingItem){
        matchingItem.quantity += 1;
    }else{
        cart.push({
            productId: productId,
            quantity: 1,
            deliveryOptionId: '1'
        });
    }

    saveToStorage();
}

export function totalCartQuantity(){
    let cartQuantity = 0;
    cart.forEach((item)=>{
        cartQuantity += item.quantity;
    })
    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
    return cartQuantity;
}

export function updateCartQuantity(){
    const cartquantity = totalCartQuantity();
    localStorage.setItem('cartquantity', JSON.stringify(cartquantity))
}

export function removeFromCart(productId){
    const newCart = [];
    cart.forEach((product)=>{
        if(product.productId !== productId) {
            newCart.push(product);
        }
    })
    cart = newCart;
    saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId){
    let matchingItem;

    cart.forEach((cartItem)=>{
        if (cartItem.productId === productId) {
            matchingItem = cartItem;
        }
    });

    matchingItem.deliveryOptionId = deliveryOptionId;

    saveToStorage();
}