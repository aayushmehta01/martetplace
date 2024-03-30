import { cart } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";
import formatCurrency from "../utils/money.js";

export function renderPaymentSummary(){
    let productPriceCents = 0;
    let shippingPriceCents = 0;

    cart.forEach((cartItem)=>{
        let matchingProduct;
        products.forEach((product)=>{
            if(product.id === cartItem.productId){
                matchingProduct = product;
            }
        });

        let deliveryOption;
        deliveryOptions.forEach((option)=>{
            if(option.id == cartItem.deliveryOptionId) {
                deliveryOption= option;
            }
        })

        productPriceCents += (matchingProduct.priceCents * cartItem.quantity);
        shippingPriceCents += (deliveryOption.priceCents);
    });

    const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
    const taxCents = (totalBeforeTaxCents * 0.1);
    const totalAfterTaxCents = totalBeforeTaxCents + taxCents;

    const paymentSummaryHtml = `
        <div class="payment-summary-title">
        Order Summary
        </div>

        <div class="payment-summary-row">
        <div>Items:</div>
        <div class="payment-summary-money js-total-payment">$${formatCurrency(productPriceCents)}</div>
        </div>

        <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
        </div>

        <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
        </div>

        <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
        </div>

        <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">$${formatCurrency(totalAfterTaxCents)}</div>
        </div>

        <button class="place-order-button button-primary js-place-order-button">
        Place your order
    `;

    document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHtml;

    let placeorderbutton = document.querySelector('.js-place-order-button');
    placeorderbutton.addEventListener('click',()=>{
        document.querySelector('.js-payment-form').classList.remove("display-none");
    })

    document.querySelector('.cross').addEventListener('click', () => {
        document.querySelector('.js-payment-form').classList.add("display-none");
    })

    document.querySelector('.js-payment-form').classList.add("display-none");

}

renderPaymentSummary();