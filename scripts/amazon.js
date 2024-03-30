import {addToCart, totalCartQuantity, updateCartQuantity} from '../data/cart.js'
import {products} from '../data/products.js'
import { formatCurrency } from './utils/money.js';

let productHtml = '';

products.forEach( (product) => {
    productHtml += `
    <div class="product-container">
        <div class="product-image-container">
        <img class="product-image"
            src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
        ${product.name}
        </div>

        <div class="product-rating-container">
        <img class="product-rating-stars"
            src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
            ${product.rating.count}
        </div>
        </div>

        <div class="product-price">
        $${formatCurrency(product.priceCents)}
        </div>

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart" 
        data-product-id = "${product.id}">
        <img src="images/icons/checkmark.png">
        Added
        </div>

        <button class="add-to-cart-button button-primary js-addtocart" data-product-id = "${product.id}">
        Add to Cart
        </button>
    </div>
    `
})

document.querySelector('.js-product-grid').innerHTML = productHtml;


// Interactive Search Bar
const category = [... new Set(products.map((item) => {
    return item;
}))]

document.getElementById('searchBar').addEventListener('keyup', (e)=>{
    const searchData = e.target.value.toLowerCase();
    const filterData = category.filter((item) => {
        return(
            item.name.toLocaleLowerCase().includes(searchData)
        )
    })
    displayItem(filterData);
    
})

const displayItem = (items) => {
    document.getElementById('productsGrid').innerHTML = items.map((product) => {
        return(
            `
            <div class="product-container">
                <div class="product-image-container">
                <img class="product-image"
                    src="${product.image}">
                </div>

                <div class="product-name limit-text-to-2-lines">
                ${product.name}
                </div>

                <div class="product-rating-container">
                <img class="product-rating-stars"
                    src="images/ratings/rating-${product.rating.stars * 10}.png">
                <div class="product-rating-count link-primary">
                    ${product.rating.count}
                </div>
                </div>

                <div class="product-price">
                $${formatCurrency(product.priceCents)}
                </div>

                <div class="product-spacer"></div>

                <div class="added-to-cart js-added-to-cart" 
                data-product-id = "${product.id}">
                <img src="images/icons/checkmark.png">
                Added
                </div>

                <button class="add-to-cart-button button-primary js-addtocart" data-product-id = "${product.id}">
                Add to Cart
                </button>
            </div>
            `
        )
    }).join('')
};


document.querySelectorAll('.js-addtocart').forEach( (button)=>{
    button.addEventListener('click', ()=>{
        const productId = button.dataset.productId;

        // Added will be displayed when button clicked.
        document.querySelector(`[data-product-id="${productId}"]`).classList.remove('.added-to-cart');
        // console.log(`[data-product-id="${productId}"]`);
        document.querySelector(`[data-product-id="${productId}"]`).classList.add('added-to-cart-visible');
        setTimeout( ()=> {
            document.querySelector(`[data-product-id="${productId}"]`).classList.remove('added-to-cart-visible');
        }, 600)

        addToCart(productId);
        totalCartQuantity();
    });
});

updateCartQuantity();
document.querySelector('.js-cart-quantity').innerHTML = JSON.parse(localStorage.getItem('cartquantity'));