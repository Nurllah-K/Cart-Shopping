let iconCart = document.querySelector('.icon-cart');
// console.log(iconCart);

let body = document.querySelector('body');
// console.log(body);

let cartBag = document.querySelector('#cart-bag');
// console.log(cartBag);

let cartTab = document.querySelector('.cart-tab');
// console.log(cartTab);

let closeBtn = document.querySelector('.close');
// console.log(closeBtn);

let listProductHTML = document.querySelector('.list-product');
// console.log(listProduct);

let listCartHTML = document.querySelector('.list-cart');
// console.log(listCartHTML);

let iconCartSpan = document.querySelector('.icon-cart span')
// console.log(iconCartSpan);

let listProducts = [];
let carts = [];

iconCart.addEventListener('click', () => {
   body.classList.toggle('show-cart')
})

closeBtn.addEventListener('click', () => {
   body.classList.remove('show-cart')
})

const addDataToHTML = () => {
   listProductHTML.innerHTML = "";
   if (listProducts.length > 0) {
      listProducts.forEach(product => {
         let newProduct = document.createElement('div');
         newProduct.classList.add('item');
         newProduct.dataset.id = product.id;
         newProduct.innerHTML = `<img src="${product.image}" alt="koltuk1">
<h2>${product.name}</h2>
<div class="price">$ ${product.price}</div>
<button class="add-cart">+</button>`;
         listProductHTML.appendChild(newProduct);
      })
   }

}

const inTheBag = () => {
   fetch('products.json').
      then(response => response.json()).
      then(data => {
         listProducts = data;
         // console.log(listProducts);
         addDataToHTML();
         if (localStorage.getItem('cart')) {
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
         }
      })

}
inTheBag();

listProductHTML.addEventListener('click', (e) => {
   let positionClick = e.target;
   if (positionClick.classList.contains('add-cart')) {
      let productId = positionClick.parentElement.dataset.id;
      addToCart(productId);

   }
})

const addToCart = (productId) => {
   let positionThisProductInCart = carts.findIndex((value) => value.productId == productId)
   if (carts.length <= 0) {
      carts = [{
         productId: productId,
         quantity: 1
      }];
   } else if (positionThisProductInCart < 0) {
      carts.push({
         productId: productId,
         quantity: 1
      });

   } else {
      carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1;
   }
   addCartToHTML();
   addCartToMemory();

}
const addCartToMemory = () => {
   localStorage.setItem('cart', JSON.stringify(carts));
}

const addCartToHTML = () => {
   listCartHTML.innerHTML = '';

   let totalQuantity = 0;
   if (carts.length > 0) {
      carts.forEach(cart => {
         totalQuantity = totalQuantity + cart.quantity;
         let newCart = document.createElement('div');
         newCart.classList.add('item');
         newCart.dataset.id = cart.productId;
         let positionProduct = listProducts.findIndex((value) => value.id == cart.productId);
         let info = listProducts[positionProduct];
         newCart.innerHTML = ` <div class="image">
   <img src="${info.image}" alt="">
  </div>
  <div class="name">
   ${info.name}
  </div>
  <div class="total-price">
   $ ${info.price * cart.quantity}
  </div>
  <div class="quantity">
   <span class="minus">
    < </span>
     <span>${cart.quantity}</span>
     <span class="plus"> > </span>
  </div>`;
         listCartHTML.appendChild(newCart);
      });

   }
   iconCartSpan.innerText = totalQuantity;
};

listCartHTML.addEventListener('click', (e) => {
   let positionClick = e.target;
   if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
      let productId = positionClick.parentElement.parentElement.dataset.id;
      let type = 'minus';
      if (positionClick.classList.contains('plus')) {
         type = 'plus';
      }
      changeQuantity(productId, type);
   }
})

const changeQuantity = (productId, type) => {
   let positionItemCart = carts.findIndex((value) => value.productId == productId);
   if (positionItemCart >= 0) {
      switch (type) {
         case 'plus':
            carts[positionItemCart].quantity = carts[positionItemCart].quantity + 1;
            break;

         default:
            let valueChange = carts[positionItemCart].quantity - 1;
            if (valueChange > 0) {
               carts[positionItemCart].quantity = valueChange;

            }
            else {
               carts.splice(positionItemCart, 1);
            }
            break;
      }
   }
   addCartToMemory();
   addCartToHTML();

}