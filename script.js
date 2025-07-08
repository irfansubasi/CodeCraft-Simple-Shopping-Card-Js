let userInfo = {};
let cart = [];

const availableProducts = [
  { id: 1, name: 'Webcam', price: 15000, image: 'assets/1.jpg' },
  { id: 2, name: 'Airpods', price: 150, image: 'assets/2.jpg' },
  { id: 3, name: 'Watch', price: 300, image: 'assets/3.jpg' },
  { id: 4, name: 'Sd Card', price: 2500, image: 'assets/4.jpg' },
  { id: 5, name: 'Camera', price: 450, image: 'assets/5.jpg' },
  { id: 6, name: 'Headphones', price: 8000, image: 'assets/6.jpg' },
];

function getUserInfo() {
  const name = prompt('Please enter your name:');

  let age;
  do {
    age = prompt('Please enter your age:');

    if (isNaN(age)) {
      alert('Please enter your age as a number.');
    } else if (age < 18 || age > 150) {
      alert('Please enter your age as a number between 18-150.');
    }
  } while (isNaN(age) || age < 18 || age > 150);

  const profession = prompt('Please enter your profession:');

  userInfo = {
    name: name,
    age: parseInt(age),
    profession: profession,
  };

  displayUserInfo();
}

function displayUserInfo() {
  const userInfoDiv = document.getElementById('userInfo');
  if (userInfoDiv) {
    userInfoDiv.innerHTML = `
            <h3>Hello, ${userInfo.name}!</h3>
            <p><strong>Age:</strong> ${userInfo.age} | <strong>Profession:</strong> ${userInfo.profession}</p>
        `;
  }
}

function displayProducts() {
  const productsGrid = document.getElementById('productsGrid');
  if (productsGrid) {
    productsGrid.innerHTML = availableProducts
      .map(
        (product) => `
            <div class="product-card" data-product-id="${product.id}">
                <img src="${product.image}" alt="${
          product.name
        }" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">${product.price.toLocaleString(
                      'tr-TR'
                    )} TL</p>
                    <button class="add-to-cart-btn" onclick="addToCart(${
                      product.id
                    })">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                </div>
            </div>
        `
      )
      .join('');
  }
}

function addToCart(productId) {
  const product = availableProducts.find((p) => p.id === productId);
  if (product) {
    const cartItem = {
      id: Date.now() + Math.random(),
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    };

    cart.push(cartItem);
    updateCartDisplay();
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
    console.log('nolursun ol artık ya:', cart);
  }
}

function removeFromCart(cartItemId) {
  const index = cart.findIndex((item) => item.id === cartItemId);
  if (index !== -1) {
    const removedItem = cart.splice(index, 1)[0];
    updateCartDisplay();
    updateCartCount();
    showNotification(`${removedItem.name} removed from cart!`);
  }
}

function updateCartDisplay() {
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');

  if (cartItems) {
    if (cart.length === 0) {
      cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-bag"></i>
                    <p>Your cart is empty</p>
                    <span>Click on products to add them to your cart</span>
                </div>
            `;
    } else {
      cartItems.innerHTML = cart
        .map(
          (item) => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${
            item.name
          }" class="cart-item-image">
                    <div class="cart-item-info">
                        <p class="cart-item-name">${item.name}</p>
                        <p class="cart-item-price">${item.price.toLocaleString(
                          'tr-TR'
                        )} TL</p>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${
                      item.id
                    })">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `
        )
        .join('');
    }
  }

  if (cartTotal) {
    const total = calculateTotal();
    cartTotal.textContent = `${total.toLocaleString('tr-TR')} TL`;
  }
}

function updateCartCount() {
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    cartCount.textContent = cart.length;
  }
}

function calculateTotal() {
  return cart.reduce((sum, item) => sum + item.price, 0);
}

function clearCart() {
  cart = [];
  updateCartDisplay();
  updateCartCount();
  showNotification('Cart cleared!');
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

function toggleCart() {
  const cartSidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('overlay');

  if (cartSidebar && overlay) {
    cartSidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  }
}

function closeCart() {
  const cartSidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('overlay');

  if (cartSidebar && overlay) {
    cartSidebar.classList.remove('open');
    overlay.classList.remove('active');
  }
}

function checkout() {
  if (cart.length === 0) {
    showNotification('Your cart is empty!');
    return;
  }

  const total = calculateTotal();
  const confirmed = confirm(
    `Total amount: ${total.toLocaleString(
      'en-US'
    )} TL\n\nDo you want to proceed with payment?`
  );

  if (confirmed) {
    showNotification('Payment successful! Thank you.');
    clearCart();
    closeCart();
  }
}

function showLoading() {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) {
    spinner.classList.add('active');
  }
}

function hideLoading() {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) {
    spinner.classList.remove('active');
  }
}

function initializeApp() {
  showLoading();

  getUserInfo();

  displayProducts();

  const cartToggle = document.getElementById('cartToggle');
  const closeCartBtn = document.getElementById('closeCart');
  const overlay = document.getElementById('overlay');
  const clearCartBtn = document.getElementById('clearCart');
  const checkoutBtn = document.getElementById('checkout');

  if (cartToggle) {
    cartToggle.addEventListener('click', toggleCart);
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', closeCart);
  }

  if (overlay) {
    overlay.addEventListener('click', closeCart);
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', clearCart);
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', checkout);
  }

  setTimeout(hideLoading, 1000);
}

document.addEventListener('DOMContentLoaded', initializeApp);

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.toggleCart = toggleCart;
window.closeCart = closeCart;
window.checkout = checkout;
