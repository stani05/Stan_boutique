// ===============================
// STAN Boutique - script.js
// ===============================

const cart = [];
const freeShippingThreshold = 10000;

// Calcul des frais de livraison
function calculateShipping(subtotal) {
    if (subtotal >= freeShippingThreshold) return 0;
    const min = 1000;
    const max = 5000;
    const cost = Math.round(subtotal * 0.1);
    return Math.max(min, Math.min(max, cost));
}

// Mise à jour du panier
function updateCart() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');

    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = calculateShipping(subtotal);
    const total = subtotal + shipping;

    subtotalEl.textContent = `${subtotal.toLocaleString('fr-FR')} FCFA`;
    shippingEl.textContent = `${shipping.toLocaleString('fr-FR')} FCFA`;
    totalEl.textContent = `${total.toLocaleString('fr-FR')} FCFA`;

    if (cart.length > 0) {
        cartItems.innerHTML = cart.map(item => `
            <div class="flex justify-between items-center mb-4 pb-4 border-b">
                <div class="flex items-center">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover">
                    <div class="ml-3">
                        <h4 class="font-medium">${item.name}</h4>
                        <p class="text-gray-500 text-sm">${item.price.toLocaleString('fr-FR')} FCFA × ${item.quantity}</p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button class="quantity-btn px-2 py-1 border rounded" data-id="${item.id}" data-action="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn px-2 py-1 border rounded" data-id="${item.id}" data-action="increase">+</button>
                    <button class="remove-btn text-red-500" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>`).join('');
        attachCartEventListeners();
    } else {
        cartItems.innerHTML = '<p class="text-center text-gray-500">Votre panier est vide</p>';
    }
}

// Écouteurs pour les boutons du panier
function attachCartEventListeners() {
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = this.dataset.id;
            const action = this.dataset.action;
            const item = cart.find(i => i.id === id);
            if (item) {
                if (action === 'increase') {
                    item.quantity++;
                } else if (action === 'decrease' && item.quantity > 1) {
                    item.quantity--;
                } else if (action === 'decrease' && item.quantity === 1) {
                    cart.splice(cart.indexOf(item), 1);
                }
                updateCart();
            }
        });
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = this.dataset.id;
            const index = cart.findIndex(i => i.id === id);
            if (index !== -1) {
                cart.splice(index, 1);
                updateCart();
            }
        });
    });
}

// Ajouter un produit
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
        const productCard = this.closest('.product-card');
        const product = {
            id: productCard.dataset.id,
            name: productCard.dataset.name,
            price: parseInt(productCard.dataset.price),
            image: productCard.dataset.image,
            quantity: 1
        };

        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push(product);
        }
        updateCart();
    });
});

// Ouvrir et fermer le panier
document.getElementById('cart-button').addEventListener('click', () => {
    document.getElementById('cart-overlay').classList.remove('hidden');
    document.getElementById('cart-sidebar').classList.remove('translate-x-full');
});

document.getElementById('close-cart').addEventListener('click', closeCart);
document.getElementById('cart-overlay').addEventListener('click', closeCart);

function closeCart() {
    document.getElementById('cart-overlay').classList.add('hidden');
    document.getElementById('cart-sidebar').classList.add('translate-x-full');
}

// Commander via WhatsApp
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Votre panier est vide');
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = calculateShipping(subtotal);
    const total = subtotal + shipping;

    let message = "Bonjour! Je souhaite commander les articles suivants:%0A%0A";
    cart.forEach(item => {
        message += `- ${item.name} (${item.quantity} × ${item.price.toLocaleString('fr-FR')} FCFA)%0A`;
    });

    message += `%0ASous-total: ${subtotal.toLocaleString('fr-FR')} FCFA%0A`;
    message += `Livraison: ${shipping.toLocaleString('fr-FR')} FCFA%0A`;
    message += `*Total: ${total.toLocaleString('fr-FR')} FCFA*%0A%0A`;
    message += "Merci de me recontacter pour finaliser la commande.";

    const whatsappNumber = "22654557847";
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
});

// Initialisation
updateCart();
