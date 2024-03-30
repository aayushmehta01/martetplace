import {cart, removeFromCart, updateCartQuantity, updateDeliveryOption} from '../../data/cart.js'
import {products} from '../../data/products.js'
import {formatCurrency} from '../utils/money.js';
import {deliveryOptions } from '../../data/deliveryOptions.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { renderPaymentSummary } from './paymentSummary.js';


export function renderOrderSummary(){

    let cartSummaryHtml = '';
    cart.forEach((cartItem)=>{
        
        let matchingProduct;
        
        const productId = cartItem.productId;

        products.forEach((product)=>{
            if(product.id === productId){
                matchingProduct = product;
            }
        })

        const deliveryOptionId = cartItem.deliveryOptionId;
        let deliveryOption;

        deliveryOptions.forEach((option)=>{
            if(option.id === deliveryOptionId){
                deliveryOption = option;
            }
        });

        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
        const dateString = deliveryDate.format("dddd, MMMM D");

        cartSummaryHtml += `
        <div class="cart-item-container container-${matchingProduct.id}">
            <div class="delivery-date">
                Delivery date: ${dateString};
            </div>

            <div class="cart-item-details-grid">
                <img class="product-image"
                src="${matchingProduct.image}">

                <div class="cart-item-details">
                <div class="product-name">
                    ${matchingProduct.name}
                </div>
                <div class="product-price">
                    $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                    <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                    </span>
                    <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                    Delete
                    </span>
                </div>
                </div>

                <div class="delivery-options">
                <div class="delivery-options-title">
                    Choose a delivery option:
                </div>
                ${deliveryOptionsHtml(matchingProduct, cartItem)}
                </div>
            </div>
            </div>
        `
    });
    // Add the summary to the page and show it.
    document.querySelector('.js-order-summary').innerHTML = cartSummaryHtml;

    // used to generate html for the delivery options
    function deliveryOptionsHtml(matchingProduct, cartItem){
        let deliveryHtml = '';

        deliveryOptions.forEach((deliveryOption)=>{
            const today = dayjs();
            const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
            const dateString = deliveryDate.format("dddd, MMMM D");
            const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)}`;

            const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

            deliveryHtml +=
            `
                <div class="delivery-option js-delivery-option"
                data-product-id="${matchingProduct.id}" 
                data-delivery-option-id="${deliveryOption.id}">
                    <input type="radio"
                    ${isChecked ? 'checked' : ''}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                    <div>
                    <div class="delivery-option-date">
                        ${dateString}
                    </div>
                    <div class="delivery-option-price">
                        ${priceString} - Shipping
                    </div>
                    </div>
                </div>
            `
        });
        return deliveryHtml;
    }

    // This event listner will remove the particular container when  a user clicks on it.
    document.querySelectorAll('.js-delete-link').forEach((link)=>{
            link.addEventListener('click', ()=>{
                const productId = link.dataset.productId;
                removeFromCart(productId);
                document.querySelector(`.container-${productId}`).remove();
                renderPaymentSummary();
        });
    });

    // This is used to update the cart quantity at top of checkout.html.
    updateCartQuantity();
    document.querySelector('.js-cart-quantity').innerHTML = `${JSON.parse(localStorage.getItem('cartquantity'))} items`;


    document.querySelectorAll('.js-delivery-option').forEach((element)=>{
        element.addEventListener('click', () => {

            const {productId, deliveryOptionId} = element.dataset;
            updateDeliveryOption(productId, deliveryOptionId);
            // it updates the page without refreshing it
            renderOrderSummary();
            renderPaymentSummary();
        });
    });

}

renderOrderSummary();