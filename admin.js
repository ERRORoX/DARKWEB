// Статическая демо-версия админ-панели без авторизации
(function () {
    // Демо-данные
    const DEMO_STATS = {
        total_orders: 127,
        orders_today: 8,
        orders_by_status: {
            new: 5,
            awaiting_payment: 12,
            receipt_received: 3,
            paid: 15,
            shipped: 92
        },
        low_stock_count: 3,
        out_of_stock_count: 1,
        total_products: 24
    };

    const DEMO_ORDERS = [
        {
            id: 1,
            order_number: "ORD-20260220-143022",
            full_name: "Алиев Али Алиевич",
            phone: "+992901234567",
            city: "Душанбе",
            address: "ул. Рудаки, д. 15, кв. 42",
            product_title: "ASUS ROG Strix G15",
            price: 4500,
            status: "new",
            created_at: "2026-02-20 14:30:22",
            receipt_file_id: null
        },
        {
            id: 2,
            order_number: "ORD-20260220-120515",
            full_name: "Рахимова Мария",
            phone: "+992987654321",
            city: "Худжанд",
            address: "пр. Ленина, д. 8",
            product_title: "Lenovo Legion 5",
            price: 4200,
            status: "awaiting_payment",
            created_at: "2026-02-20 12:05:15",
            receipt_file_id: null
        },
        {
            id: 3,
            order_number: "ORD-20260219-165430",
            full_name: "Каримов Фарход",
            phone: "+992901111222",
            city: "Душанбе",
            address: "ул. Айни, д. 25",
            product_title: "HP Pavilion 15",
            price: 3200,
            status: "paid",
            created_at: "2026-02-19 16:54:30",
            receipt_file_id: "demo_receipt_1"
        }
    ];

    const DEMO_PRODUCTS = [
        {
            id: 1,
            title: "ASUS ROG Strix G15",
            description: "Игровой ноутбук с RTX 3060, 16GB RAM, AMD Ryzen 7",
            price: 4500,
            category: "gaming",
            category_label: "Игровые",
            stock: 5,
            image_file_id: null
        },
        {
            id: 2,
            title: "Lenovo Legion 5",
            description: "Игровой ноутбук для работы и игр",
            price: 4200,
            category: "gaming",
            category_label: "Игровые",
            stock: 3,
            image_file_id: null
        },
        {
            id: 3,
            title: "HP Pavilion 15",
            description: "Ноутбук для учёбы и работы",
            price: 3200,
            category: "study",
            category_label: "Учёба",
            stock: 8,
            image_file_id: null
        },
        {
            id: 4,
            title: "MacBook Air M2",
            description: "Премиум ноутбук для работы",
            price: 8500,
            category: "work",
            category_label: "Работа",
            stock: 2,
            image_file_id: null
        },
        {
            id: 5,
            title: "Acer Aspire 5",
            description: "Бюджетный ноутбук для учёбы",
            price: 2800,
            category: "study",
            category_label: "Учёба",
            stock: 0,
            image_file_id: null
        }
    ];

    // Утилиты
    function notify(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        // Можно добавить визуальные уведомления если нужно
    }

    function setLastUpdated() {
        var el = document.getElementById('lastUpdated');
        if (el) el.textContent = 'Обновлено: ' + new Date().toLocaleTimeString('ru-RU');
    }

    function formatBytes(bytes) {
        if (!bytes) return '0 Б';
        const k = 1024;
        const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    // Загрузка статистики
    function loadStats() {
        const stats = DEMO_STATS;
        const set = function(id, val) {
            const el = document.getElementById(id);
            if (el) el.textContent = val ?? '—';
        };
        set('statOrders', stats.total_orders);
        set('statOrdersToday', stats.orders_today);
        set('statNew', stats.orders_by_status && stats.orders_by_status.new);
        set('statShipped', stats.orders_by_status && stats.orders_by_status.shipped);
        set('statLowStock', stats.low_stock_count);
        set('statOutOfStock', stats.out_of_stock_count);
        set('statProducts', stats.total_products);
        
        // Обновляем уведомления
        updateNotificationsButton();
        setLastUpdated();
    }

    // Уведомления
    var notificationsData = {
        newOrders: DEMO_STATS.orders_by_status.new || 0,
        lowStock: DEMO_STATS.low_stock_count || 0,
        outOfStock: DEMO_STATS.out_of_stock_count || 0,
        total: 0
    };
    
    notificationsData.total = notificationsData.newOrders + notificationsData.lowStock + notificationsData.outOfStock;

    function updateNotificationsButton() {
        const btn = document.getElementById('notificationsButton');
        const countEl = document.getElementById('notificationsCount');
        if (!btn || !countEl) return;
        
        const total = notificationsData.total;
        
        if (total > 0) {
            countEl.textContent = total > 99 ? '99+' : total.toString();
            countEl.style.display = 'flex';
            btn.classList.add('has-notifications');
            btn.title = 'Уведомления (' + total + ')';
        } else {
            countEl.style.display = 'none';
            btn.classList.remove('has-notifications');
            btn.title = 'Уведомлений нет';
        }
        updateNotificationsDropdown();
    }

    function updateNotificationsDropdown() {
        const list = document.getElementById('notificationsList');
        if (!list) return;
        
        const items = [];
        
        if (notificationsData.newOrders > 0) {
            items.push({
                type: 'new-orders',
                icon: '🆕',
                title: 'Новые заказы',
                description: notificationsData.newOrders === 1 
                    ? '1 новый заказ требует внимания'
                    : notificationsData.newOrders + ' новых заказов требуют внимания',
                count: notificationsData.newOrders
            });
        }
        
        if (notificationsData.lowStock > 0) {
            items.push({
                type: 'low-stock',
                icon: '⚠️',
                title: 'Низкий остаток товаров',
                description: notificationsData.lowStock === 1
                    ? '1 товар с остатком ≤ 2 шт.'
                    : notificationsData.lowStock + ' товаров с остатком ≤ 2 шт.',
                count: notificationsData.lowStock
            });
        }
        
        if (notificationsData.outOfStock > 0) {
            items.push({
                type: 'out-of-stock',
                icon: '📦',
                title: 'Товары закончились',
                description: notificationsData.outOfStock === 1
                    ? '1 товар отсутствует в наличии'
                    : notificationsData.outOfStock + ' товаров отсутствуют в наличии',
                count: notificationsData.outOfStock
            });
        }
        
        if (items.length === 0) {
            list.innerHTML = '<div class="notification-item-empty">Нет уведомлений</div>';
        } else {
            list.innerHTML = items.map(function(item) {
                return '<div class="notification-item ' + item.type + '">' +
                    '<span class="notification-icon">' + item.icon + '</span>' +
                    '<div class="notification-content">' +
                    '<div class="notification-title">' + item.title + ' <strong>(' + item.count + ')</strong></div>' +
                    '<div class="notification-description">' + item.description + '</div>' +
                    '</div>' +
                    '</div>';
            }).join('');
        }
    }

    function toggleNotificationsDropdown() {
        const dropdown = document.getElementById('notificationsDropdown');
        const overlay = document.getElementById('notificationsOverlay');
        if (!dropdown) return;
        
        if (dropdown.style.display === 'none' || !dropdown.style.display) {
            dropdown.style.display = 'flex';
            if (overlay) overlay.classList.add('active');
        } else {
            closeNotificationsDropdown();
        }
    }

    function closeNotificationsDropdown() {
        const dropdown = document.getElementById('notificationsDropdown');
        const overlay = document.getElementById('notificationsOverlay');
        if (dropdown) dropdown.style.display = 'none';
        if (overlay) overlay.classList.remove('active');
    }

    // Загрузка заказов
    function loadOrders() {
        const tbody = document.getElementById('ordersTableBody');
        if (!tbody) return;
        
        const orders = DEMO_ORDERS;
        if (!orders || !orders.length) {
            tbody.innerHTML = '<tr><td colspan="9">Нет заказов</td></tr>';
            return;
        }
        
        const statusLabels = {
            new: 'Новый',
            awaiting_payment: 'Ожидает оплату',
            receipt_received: 'Чек получен',
            paid: 'Оплачен',
            shipped: 'Отправлен'
        };
        
        tbody.innerHTML = orders.map(function(o) {
            const statusLabel = statusLabels[o.status] || o.status;
            const receiptBtn = o.receipt_file_id
                ? '<button class="action-btn view" data-order-id="' + o.id + '" data-receipt>📷 Чек</button>'
                : '<span class="text-muted">—</span>';
            
            return '<tr>' +
                '<td>' + (o.order_number || '—') + '</td>' +
                '<td>' + (o.full_name || '—') + '</td>' +
                '<td>' + (o.phone || '—') + '</td>' +
                '<td>' + (o.city || '—') + '</td>' +
                '<td>' + (o.address || '—') + '</td>' +
                '<td>' + (o.product_title || '—') + '</td>' +
                '<td><span class="status-badge status-' + o.status + '">' + statusLabel + '</span></td>' +
                '<td>' + receiptBtn + '</td>' +
                '<td><button class="action-btn edit" data-order-id="' + o.id + '">✏️</button></td>' +
                '</tr>';
        }).join('');
        
        setLastUpdated();
    }

    // Загрузка товаров
    function loadProducts() {
        const tbody = document.getElementById('productsTableBody');
        if (!tbody) return;
        
        const products = DEMO_PRODUCTS;
        if (!products || !products.length) {
            tbody.innerHTML = '<tr><td colspan="6">Нет товаров</td></tr>';
            return;
        }
        
        tbody.innerHTML = products.map(function(p) {
            const stock = p.stock != null ? p.stock : 0;
            const stockText = stock === 0 ? 'Нет в наличии' : stock + ' шт.';
            const stockClass = stock === 0 ? 'out' : (stock <= 2 ? 'low' : '');
            
            return '<tr>' +
                '<td>' + p.id + '</td>' +
                '<td>' + (p.title || '—') + '</td>' +
                '<td>' + (p.category_label || p.category || '—') + '</td>' +
                '<td>' + (p.price || 0) + ' сом.</td>' +
                '<td><span class="stock-badge stock-' + stockClass + '">' + stockText + '</span></td>' +
                '<td>' +
                '<button class="action-btn edit edit-product" data-id="' + p.id + '">✏️</button> ' +
                '<button class="action-btn ban delete-product" data-id="' + p.id + '">🗑️</button>' +
                '</td>' +
                '</tr>';
        }).join('');
        
        setLastUpdated();
    }

    // Переключение вкладок
    function switchToTab(tabId) {
        document.querySelectorAll('.admin-tab').forEach(function(tab) {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.nav-link').forEach(function(link) {
            link.classList.remove('active');
        });
        
        const tab = document.getElementById(tabId);
        const link = document.querySelector('[data-tab="' + tabId + '"]');
        
        if (tab) tab.classList.add('active');
        if (link) link.classList.add('active');
        
        // Загружаем данные для активной вкладки
        if (tabId === 'dashboard') {
            loadStats();
        } else if (tabId === 'orders') {
            loadOrders();
        } else if (tabId === 'products') {
            loadProducts();
        }
    }

    // Инициализация
    document.addEventListener('DOMContentLoaded', function() {
        // Скрываем экран входа, показываем панель
        const loginScreen = document.getElementById('loginScreen');
        const appPanel = document.getElementById('appPanel');
        if (loginScreen) loginScreen.style.display = 'none';
        if (appPanel) appPanel.style.display = 'flex';
        
        // Устанавливаем имя пользователя
        const usernameEl = document.getElementById('currentUsername');
        if (usernameEl) usernameEl.textContent = 'Демо-режим';
        
        // Навигация
        document.querySelectorAll('.nav-link').forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const tabId = this.getAttribute('data-tab');
                if (tabId) switchToTab(tabId);
            });
        });
        
        // Кнопка обновления
        const refreshBtn = document.getElementById('refreshData');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                loadStats();
                const tab = document.querySelector('.admin-tab.active');
                if (tab) {
                    if (tab.id === 'orders') loadOrders();
                    if (tab.id === 'products') loadProducts();
                }
                notify('Данные обновлены', 'success');
            });
        }
        
        // Кнопка уведомлений
        const notificationsBtn = document.getElementById('notificationsButton');
        const closeBtn = document.getElementById('closeNotificationsDropdown');
        const overlay = document.getElementById('notificationsOverlay');
        
        if (notificationsBtn) {
            notificationsBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleNotificationsDropdown();
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                closeNotificationsDropdown();
            });
        }
        
        if (overlay) {
            overlay.addEventListener('click', function() {
                closeNotificationsDropdown();
            });
        }
        
        // Закрываем меню при клике вне его
        document.addEventListener('click', function(e) {
            const dropdown = document.getElementById('notificationsDropdown');
            const wrapper = document.querySelector('.notifications-wrapper');
            if (dropdown && wrapper && !wrapper.contains(e.target)) {
                closeNotificationsDropdown();
            }
        });
        
        // Загружаем начальные данные
        loadStats();
        loadOrders();
        loadProducts();
        
        // Обработчики для кнопок действий (заглушки)
        document.body.addEventListener('click', function(e) {
            if (e.target.closest('.edit-product')) {
                notify('Редактирование товара (демо-режим)', 'info');
            }
            if (e.target.closest('.delete-product')) {
                if (confirm('Удалить товар? (демо-режим)')) {
                    notify('Товар удалён (демо-режим)', 'success');
                }
            }
            if (e.target.closest('[data-receipt]')) {
                notify('Просмотр чека (демо-режим)', 'info');
            }
        });
        
        // Убираем кнопку выхода или делаем заглушку
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                notify('В демо-режиме выход недоступен', 'info');
            });
        }
    });
})();
