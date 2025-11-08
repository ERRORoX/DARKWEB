// Marketplace functionality
document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.getElementById('productsGrid');
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Примеры товаров
    const products = [
        {
            id: 1,
            title: 'VPN Premium',
            description: 'Высококачественный VPN сервис с полной анонимностью и защитой данных',
            price: '0.05 BTC',
            seller: 'SecureVPN',
            rating: '4.9/5',
            category: 'services'
        },
        {
            id: 2,
            title: 'Hacking Tools Pack',
            description: 'Полный набор инструментов для пентестинга и анализа безопасности',
            price: '0.15 BTC',
            seller: 'HackerTools',
            rating: '4.7/5',
            category: 'tools'
        },
        {
            id: 3,
            title: 'Database Leak 2024',
            description: 'База данных с утечками информации за 2024 год',
            price: '0.10 BTC',
            seller: 'DataLeaks',
            rating: '4.8/5',
            category: 'data'
        },
        {
            id: 4,
            title: 'Custom Malware',
            description: 'Изготовление вредоносного ПО под заказ с гарантией анонимности',
            price: '0.25 BTC',
            seller: 'MalwarePro',
            rating: '4.6/5',
            category: 'tools'
        },
        {
            id: 5,
            title: 'Identity Protection',
            description: 'Услуги по защите личности и созданию новых идентичностей',
            price: '0.20 BTC',
            seller: 'IdentityGuard',
            rating: '4.9/5',
            category: 'services'
        },
        {
            id: 6,
            title: 'Credit Cards Database',
            description: 'База данных кредитных карт с проверенными данными',
            price: '0.30 BTC',
            seller: 'CardMaster',
            rating: '4.5/5',
            category: 'data'
        },
        {
            id: 7,
            title: 'DDoS Service',
            description: 'Услуги по DDoS атакам с гарантией результата',
            price: '0.12 BTC',
            seller: 'DDoSAttack',
            rating: '4.7/5',
            category: 'services'
        },
        {
            id: 8,
            title: 'Exploit Framework',
            description: 'Фреймворк для поиска и эксплуатации уязвимостей',
            price: '0.18 BTC',
            seller: 'ExploitDev',
            rating: '4.8/5',
            category: 'tools'
        }
    ];
    
    let currentFilter = 'all';
    let filteredProducts = products;
    
    // Отображение товаров
    function displayProducts(productsToShow) {
        productsGrid.innerHTML = '';
        
        productsToShow.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-header">
                    <h3 class="product-title">${escapeHtml(product.title)}</h3>
                    <span class="product-price">${escapeHtml(product.price)}</span>
                </div>
                <p class="product-description">${escapeHtml(product.description)}</p>
                <div class="product-footer">
                    <div>
                        <div class="product-seller">Продавец: ${escapeHtml(product.seller)}</div>
                        <div class="product-rating">⭐ ${escapeHtml(product.rating)}</div>
                    </div>
                    <button class="buy-btn" onclick="buyProduct(${product.id})">Купить</button>
                </div>
            `;
            productsGrid.appendChild(productCard);
        });
    }
    
    // Функция экранирования HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Фильтрация товаров
    function filterProducts() {
        let filtered = products;
        
        // Фильтр по категории
        if (currentFilter !== 'all') {
            filtered = filtered.filter(product => product.category === currentFilter);
        }
        
        // Поиск
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filtered = filtered.filter(product => 
                product.title.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.seller.toLowerCase().includes(searchTerm)
            );
        }
        
        filteredProducts = filtered;
        displayProducts(filteredProducts);
    }
    
    // Обработчики событий для фильтров
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            filterProducts();
        });
    });
    
    // Обработчик поиска
    searchInput.addEventListener('input', filterProducts);
    
    // Функция покупки товара
    window.buyProduct = function(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        // Получаем текущего пользователя
        const currentUser = JSON.parse(localStorage.getItem('darknet_user') || '{}');
        
        if (!currentUser.username) {
            if (confirm('Для покупки товаров необходимо войти в систему. Перейти на страницу входа?')) {
                window.location.href = 'register.html';
            }
            return;
        }
        
        // Сохраняем покупку
        const purchases = JSON.parse(localStorage.getItem('darkweb_purchases') || '[]');
        purchases.push({
            productId: product.id,
            productTitle: product.title,
            price: product.price,
            date: new Date().toISOString(),
            buyer: currentUser.username
        });
        localStorage.setItem('darkweb_purchases', JSON.stringify(purchases));
        
        // Добавляем активность
        addActivity('purchase', `Покупка: ${product.title} за ${product.price}`);
        
        // Показываем уведомление
        alert(`Товар "${product.title}" добавлен в корзину!\nЦена: ${product.price}`);
    };
    
    // Функция addActivity теперь в common.js
    
    // Сортировка
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            sortProducts();
            filterProducts();
        });
    }
    
    // Функция сортировки
    function sortProducts() {
        const sortValue = sortSelect ? sortSelect.value : 'price-asc';
        
        filteredProducts.sort((a, b) => {
            if (sortValue === 'price-asc') {
                const priceA = parseFloat(a.price.replace(' BTC', ''));
                const priceB = parseFloat(b.price.replace(' BTC', ''));
                return priceA - priceB;
            } else if (sortValue === 'price-desc') {
                const priceA = parseFloat(a.price.replace(' BTC', ''));
                const priceB = parseFloat(b.price.replace(' BTC', ''));
                return priceB - priceA;
            } else if (sortValue === 'rating-desc') {
                const ratingA = parseFloat(a.rating.split('/')[0]);
                const ratingB = parseFloat(b.rating.split('/')[0]);
                return ratingB - ratingA;
            } else if (sortValue === 'rating-asc') {
                const ratingA = parseFloat(a.rating.split('/')[0]);
                const ratingB = parseFloat(b.rating.split('/')[0]);
                return ratingA - ratingB;
            }
            return 0;
        });
    }
    
    // Обновление счетчика корзины
    function updateCartCount() {
        const purchases = JSON.parse(localStorage.getItem('darkweb_purchases') || '[]');
        const currentUser = JSON.parse(localStorage.getItem('darknet_user') || '{}');
        const userPurchases = purchases.filter(p => p.buyer === currentUser.username);
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = userPurchases.length;
        }
    }
    
    // Кнопка корзины
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            const purchases = JSON.parse(localStorage.getItem('darkweb_purchases') || '[]');
            const currentUser = JSON.parse(localStorage.getItem('darknet_user') || '{}');
            const userPurchases = purchases.filter(p => p.buyer === currentUser.username);
            
            if (userPurchases.length === 0) {
                alert('Корзина пуста');
            } else {
                let cartText = 'Ваши покупки:\n\n';
                userPurchases.forEach((purchase, index) => {
                    cartText += `${index + 1}. ${purchase.productTitle} - ${purchase.price}\n`;
                });
                alert(cartText);
            }
        });
    }
    
    // Инициализация
    updateCartCount();
    sortProducts();
    displayProducts(filteredProducts);
    
    // Обновляем счетчик корзины при покупке
    const originalBuyProduct = window.buyProduct;
    window.buyProduct = function(productId) {
        originalBuyProduct(productId);
        updateCartCount();
    };
});

