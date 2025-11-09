// Профессиональный улучшенный маркетплейс для DARKWEB

// Инициализация улучшенного маркетплейса
function initEnhancedMarketplace() {
    initCart();
    initFavorites();
    initPurchaseHistory();
    updateCartBadge();
    updateFavoritesBadge();
}

// ========== КОРЗИНА ==========

// Инициализация корзины
function initCart() {
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', openCartModal);
    }
}

// Открытие модального окна корзины
function openCartModal() {
    const user = getCurrentUser();
    if (!user.username) {
        if (typeof showNotification === 'function') {
            showNotification('Необходимо войти в систему', 'error');
        }
        return;
    }
    
    const cart = getCart();
    
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.id = 'cartModal';
    modal.className = 'marketplace-modal';
    modal.innerHTML = `
        <div class="marketplace-modal-content">
            <div class="marketplace-modal-header">
                <h3 class="marketplace-modal-title">Корзина</h3>
                <button class="marketplace-modal-close" onclick="closeCartModal()">×</button>
            </div>
            <div class="marketplace-modal-body" id="cartModalBody">
                ${cart.length === 0 ? '<div class="marketplace-empty">Корзина пуста</div>' : ''}
            </div>
            <div class="marketplace-modal-footer">
                <div class="cart-total">
                    <span class="cart-total-label">Итого:</span>
                    <span class="cart-total-value" id="cartTotal">0 BTC</span>
                </div>
                <button class="marketplace-btn marketplace-btn-primary" onclick="checkoutCart()" ${cart.length === 0 ? 'disabled' : ''}>Оформить заказ</button>
                <button class="marketplace-btn" onclick="clearCart()" ${cart.length === 0 ? 'disabled' : ''}>Очистить корзину</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Отображаем товары в корзине
    if (cart.length > 0) {
        displayCartItems(cart);
        calculateCartTotal();
    }
    
    // Закрытие при клике вне модального окна
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeCartModal();
        }
    });
}

// Отображение товаров в корзине
function displayCartItems(cart) {
    const container = document.getElementById('cartModalBody');
    if (!container) return;
    
    container.innerHTML = cart.map((item, index) => {
        const product = getProductById(item.productId);
        if (!product) return '';
        
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-title">${escapeHtml(product.title)}</div>
                    <div class="cart-item-seller">${escapeHtml(product.seller)}</div>
                </div>
                <div class="cart-item-price">${escapeHtml(product.price)}</div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.productId})" title="Удалить">×</button>
            </div>
        `;
    }).join('');
}

// Получение корзины
function getCart() {
    const user = getCurrentUser();
    if (!user.username) return [];
    
    const cart = JSON.parse(localStorage.getItem('darkweb_cart') || '{}');
    return cart[user.username] || [];
}

// Добавление в корзину
function addToCart(productId) {
    const user = getCurrentUser();
    if (!user.username) {
        if (typeof showNotification === 'function') {
            showNotification('Необходимо войти в систему', 'error');
        }
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('darkweb_cart') || '{}');
    if (!cart[user.username]) {
        cart[user.username] = [];
    }
    
    // Проверяем, нет ли уже этого товара
    if (!cart[user.username].find(item => item.productId === productId)) {
        cart[user.username].push({
            productId: productId,
            addedAt: new Date().toISOString()
        });
        localStorage.setItem('darkweb_cart', JSON.stringify(cart));
        
        updateCartBadge();
        
        if (typeof showNotification === 'function') {
            showNotification('Товар добавлен в корзину', 'success');
        }
        
        if (typeof addNotification === 'function') {
            const product = getProductById(productId);
            if (product) {
                addNotification('purchase', 'Товар в корзине', `${product.title} добавлен в корзину`, {
                    type: 'navigate',
                    url: 'marketplace.html'
                });
            }
        }
    } else {
        if (typeof showNotification === 'function') {
            showNotification('Товар уже в корзине', 'info');
        }
    }
}

// Удаление из корзины
function removeFromCart(productId) {
    const user = getCurrentUser();
    if (!user.username) return;
    
    const cart = JSON.parse(localStorage.getItem('darkweb_cart') || '{}');
    if (cart[user.username]) {
        cart[user.username] = cart[user.username].filter(item => item.productId !== productId);
        localStorage.setItem('darkweb_cart', JSON.stringify(cart));
        
        updateCartBadge();
        
        // Обновляем отображение корзины, если модальное окно открыто
        const modal = document.getElementById('cartModal');
        if (modal) {
            const currentCart = getCart();
            const cartModalBody = document.getElementById('cartModalBody');
            if (currentCart.length === 0) {
                if (cartModalBody) {
                    cartModalBody.innerHTML = '<div class="marketplace-empty">Корзина пуста</div>';
                }
                const primaryBtn = document.querySelector('#cartModal .marketplace-btn-primary');
                const clearBtn = document.querySelector('#cartModal button[onclick="clearCart()"]');
                if (primaryBtn) primaryBtn.disabled = true;
                if (clearBtn) clearBtn.disabled = true;
            } else {
                displayCartItems(currentCart);
                calculateCartTotal();
            }
        }
        
        if (typeof showNotification === 'function') {
            showNotification('Товар удален из корзины', 'info');
        }
    }
}

// Очистка корзины
function clearCart() {
    if (!confirm('Вы уверены, что хотите очистить корзину?')) return;
    
    const user = getCurrentUser();
    if (!user.username) return;
    
    const cart = JSON.parse(localStorage.getItem('darkweb_cart') || '{}');
    cart[user.username] = [];
    localStorage.setItem('darkweb_cart', JSON.stringify(cart));
    
    updateCartBadge();
    closeCartModal();
    
    if (typeof showNotification === 'function') {
        showNotification('Корзина очищена', 'success');
    }
}

// Закрытие модального окна корзины
function closeCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.remove();
    }
}

// Подсчет общей стоимости корзины
function calculateCartTotal() {
    const cart = getCart();
    let total = 0;
    
    cart.forEach(item => {
        const product = getProductById(item.productId);
        if (product) {
            const price = parseFloat(product.price.replace(' BTC', ''));
            total += price;
        }
    });
    
    const totalElement = document.getElementById('cartTotal');
    if (totalElement) {
        totalElement.textContent = total.toFixed(3) + ' BTC';
    }
}

// Обновление бейджа корзины
function updateCartBadge() {
    const cart = getCart();
    const badge = document.getElementById('cartCount');
    if (badge) {
        badge.textContent = cart.length;
        badge.style.display = cart.length > 0 ? 'flex' : 'none';
    }
}

// Оформление заказа
function checkoutCart() {
    const cart = getCart();
    if (cart.length === 0) return;
    
    const user = getCurrentUser();
    if (!user.username) return;
    
    // Сохраняем в историю покупок
    const purchases = JSON.parse(localStorage.getItem('user_purchases') || '[]');
    
    cart.forEach(item => {
        const product = getProductById(item.productId);
        if (product) {
            purchases.push({
                productId: product.id,
                productTitle: product.title,
                price: product.price,
                seller: product.seller,
                timestamp: new Date().toISOString(),
                buyer: user.username
            });
            
            if (typeof addActivity === 'function') {
                addActivity('purchase', `Покупка: ${product.title} за ${product.price}`);
            }
        }
    });
    
    localStorage.setItem('user_purchases', JSON.stringify(purchases));
    
    // Очищаем корзину
    const cartData = JSON.parse(localStorage.getItem('darkweb_cart') || '{}');
    cartData[user.username] = [];
    localStorage.setItem('darkweb_cart', JSON.stringify(cartData));
    
    updateCartBadge();
    closeCartModal();
    
    if (typeof showNotification === 'function') {
        showNotification('Заказ оформлен успешно!', 'success');
    }
    
    if (typeof addNotification === 'function') {
        addNotification('purchase', 'Заказ оформлен', `Оформлено товаров: ${cart.length}`, {
            type: 'navigate',
            url: 'marketplace.html'
        });
    }
}

// ========== ИЗБРАННОЕ ==========

// Инициализация избранного
function initFavorites() {
    // Добавляем кнопку избранного, если её нет
    if (!document.getElementById('favoritesBtn')) {
        const favoritesBtn = document.createElement('button');
        favoritesBtn.id = 'favoritesBtn';
        favoritesBtn.className = 'marketplace-action-btn';
        favoritesBtn.innerHTML = '⭐ Избранное';
        favoritesBtn.title = 'Избранное';
        favoritesBtn.addEventListener('click', openFavoritesModal);
        
        const filterBar = document.querySelector('.filter-bar');
        if (filterBar) {
            filterBar.insertBefore(favoritesBtn, filterBar.firstChild);
        }
    }
}

// Открытие модального окна избранного
function openFavoritesModal() {
    const favorites = getFavorites();
    
    const modal = document.createElement('div');
    modal.id = 'favoritesModal';
    modal.className = 'marketplace-modal';
    modal.innerHTML = `
        <div class="marketplace-modal-content">
            <div class="marketplace-modal-header">
                <h3 class="marketplace-modal-title">Избранное</h3>
                <button class="marketplace-modal-close" onclick="closeFavoritesModal()">×</button>
            </div>
            <div class="marketplace-modal-body" id="favoritesModalBody">
                ${favorites.length === 0 ? '<div class="marketplace-empty">Нет избранных товаров</div>' : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    if (favorites.length > 0) {
        displayFavoritesItems(favorites);
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeFavoritesModal();
        }
    });
}

// Отображение избранных товаров
function displayFavoritesItems(favorites) {
    const container = document.getElementById('favoritesModalBody');
    if (!container) return;
    
    container.innerHTML = favorites.map(productId => {
        const product = getProductById(productId);
        if (!product) return '';
        
        return `
            <div class="favorite-item">
                <div class="favorite-item-info">
                    <div class="favorite-item-title">${escapeHtml(product.title)}</div>
                    <div class="favorite-item-seller">${escapeHtml(product.seller)}</div>
                    <div class="favorite-item-price">${escapeHtml(product.price)}</div>
                </div>
                <div class="favorite-item-actions">
                    <button class="marketplace-btn marketplace-btn-small" onclick="addToCart(${product.id})">В корзину</button>
                    <button class="marketplace-btn marketplace-btn-small marketplace-btn-danger" onclick="removeFromFavorites(${product.id})">Удалить</button>
                </div>
            </div>
        `;
    }).join('');
}

// Получение избранного
function getFavorites() {
    const user = getCurrentUser();
    if (!user.username) return [];
    
    const favorites = JSON.parse(localStorage.getItem('darkweb_favorites') || '{}');
    return favorites[user.username] || [];
}

// Добавление в избранное
function addToFavorites(productId) {
    const user = getCurrentUser();
    if (!user.username) {
        if (typeof showNotification === 'function') {
            showNotification('Необходимо войти в систему', 'error');
        }
        return;
    }
    
    const favorites = JSON.parse(localStorage.getItem('darkweb_favorites') || '{}');
    if (!favorites[user.username]) {
        favorites[user.username] = [];
    }
    
    if (!favorites[user.username].includes(productId)) {
        favorites[user.username].push(productId);
        localStorage.setItem('darkweb_favorites', JSON.stringify(favorites));
        
        updateFavoritesBadge();
        
        if (typeof showNotification === 'function') {
            showNotification('Товар добавлен в избранное', 'success');
        }
    } else {
        if (typeof showNotification === 'function') {
            showNotification('Товар уже в избранном', 'info');
        }
    }
}

// Удаление из избранного
function removeFromFavorites(productId) {
    const user = getCurrentUser();
    if (!user.username) return;
    
    const favorites = JSON.parse(localStorage.getItem('darkweb_favorites') || '{}');
    if (favorites[user.username]) {
        favorites[user.username] = favorites[user.username].filter(id => id !== productId);
        localStorage.setItem('darkweb_favorites', JSON.stringify(favorites));
        
        updateFavoritesBadge();
        
        // Обновляем отображение избранного, если модальное окно открыто
        const modal = document.getElementById('favoritesModal');
        if (modal) {
            const currentFavorites = getFavorites();
            if (currentFavorites.length === 0) {
                const favoritesModalBody = document.getElementById('favoritesModalBody');
                if (favoritesModalBody) {
                    favoritesModalBody.innerHTML = '<div class="marketplace-empty">Нет избранных товаров</div>';
                }
            } else {
                displayFavoritesItems(currentFavorites);
            }
        }
        
        if (typeof showNotification === 'function') {
            showNotification('Товар удален из избранного', 'info');
        }
    }
}

// Обновление бейджа избранного
function updateFavoritesBadge() {
    const favorites = getFavorites();
    // Можно добавить бейдж, если нужно
}

// Закрытие модального окна избранного
function closeFavoritesModal() {
    const modal = document.getElementById('favoritesModal');
    if (modal) {
        modal.remove();
    }
}

// ========== ИСТОРИЯ ПОКУПОК ==========

// Инициализация истории покупок
function initPurchaseHistory() {
    // Добавляем кнопку истории, если её нет
    if (!document.getElementById('purchaseHistoryBtn')) {
        const historyBtn = document.createElement('button');
        historyBtn.id = 'purchaseHistoryBtn';
        historyBtn.className = 'marketplace-action-btn';
        historyBtn.innerHTML = '📜 История';
        historyBtn.title = 'История покупок';
        historyBtn.addEventListener('click', openPurchaseHistoryModal);
        
        const filterBar = document.querySelector('.filter-bar');
        if (filterBar) {
            const favoritesBtn = document.getElementById('favoritesBtn');
            if (favoritesBtn) {
                favoritesBtn.after(historyBtn);
            } else {
                filterBar.insertBefore(historyBtn, filterBar.firstChild);
            }
        }
    }
}

// Открытие модального окна истории покупок
function openPurchaseHistoryModal() {
    const user = getCurrentUser();
    if (!user.username) {
        if (typeof showNotification === 'function') {
            showNotification('Необходимо войти в систему', 'error');
        }
        return;
    }
    
    const purchases = JSON.parse(localStorage.getItem('user_purchases') || '[]');
    const userPurchases = purchases.filter(p => p.buyer === user.username).reverse();
    
    const modal = document.createElement('div');
    modal.id = 'purchaseHistoryModal';
    modal.className = 'marketplace-modal';
    modal.innerHTML = `
        <div class="marketplace-modal-content">
            <div class="marketplace-modal-header">
                <h3 class="marketplace-modal-title">История покупок</h3>
                <button class="marketplace-modal-close" onclick="closePurchaseHistoryModal()">×</button>
            </div>
            <div class="marketplace-modal-body" id="purchaseHistoryModalBody">
                ${userPurchases.length === 0 ? '<div class="marketplace-empty">Нет покупок</div>' : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    if (userPurchases.length > 0) {
        displayPurchaseHistory(userPurchases);
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePurchaseHistoryModal();
        }
    });
}

// Отображение истории покупок
function displayPurchaseHistory(purchases) {
    const container = document.getElementById('purchaseHistoryModalBody');
    if (!container) return;
    
    container.innerHTML = purchases.map(purchase => {
        const date = new Date(purchase.timestamp);
        return `
            <div class="purchase-history-item">
                <div class="purchase-history-info">
                    <div class="purchase-history-title">${escapeHtml(purchase.productTitle)}</div>
                    <div class="purchase-history-seller">Продавец: ${escapeHtml(purchase.seller)}</div>
                    <div class="purchase-history-date">${formatDate(purchase.timestamp)} ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div class="purchase-history-price">${escapeHtml(purchase.price)}</div>
            </div>
        `;
    }).join('');
}

// Закрытие модального окна истории покупок
function closePurchaseHistoryModal() {
    const modal = document.getElementById('purchaseHistoryModal');
    if (modal) {
        modal.remove();
    }
}

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========

// Получение товара по ID
function getProductById(productId) {
    // Получаем товары из localStorage (сохранены в marketplace.js)
    const products = JSON.parse(localStorage.getItem('marketplace_products') || '[]');
    let product = products.find(p => p.id === productId);
    
    // Если не найдено, используем дефолтный список
    if (!product) {
        const defaultProducts = [
            { id: 1, title: 'VPN Premium', seller: 'SecureVPN', price: '0.05 BTC', category: 'services' },
            { id: 2, title: 'Hacking Tools Pack', seller: 'HackerTools', price: '0.15 BTC', category: 'tools' },
            { id: 3, title: 'Database Leak 2024', seller: 'DataLeaks', price: '0.10 BTC', category: 'data' },
            { id: 4, title: 'Custom Malware', seller: 'MalwarePro', price: '0.25 BTC', category: 'tools' },
            { id: 5, title: 'Identity Protection', seller: 'IdentityGuard', price: '0.20 BTC', category: 'services' },
            { id: 6, title: 'Credit Cards Database', seller: 'CardMaster', price: '0.30 BTC', category: 'data' },
            { id: 7, title: 'DDoS Service', seller: 'DDoSAttack', price: '0.12 BTC', category: 'services' },
            { id: 8, title: 'Exploit Framework', seller: 'ExploitDev', price: '0.18 BTC', category: 'tools' }
        ];
        product = defaultProducts.find(p => p.id === productId);
    }
    
    return product;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initEnhancedMarketplace();
});

// Экспорт функций
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.closeCartModal = closeCartModal;
window.checkoutCart = checkoutCart;
window.addToFavorites = addToFavorites;
window.removeFromFavorites = removeFromFavorites;
window.closeFavoritesModal = closeFavoritesModal;
window.openPurchaseHistoryModal = openPurchaseHistoryModal;
window.closePurchaseHistoryModal = closePurchaseHistoryModal;

