// Профессиональная система уведомлений для DARKWEB

// Инициализация системы уведомлений
function initNotifications() {
    createNotificationCenter();
    loadNotifications();
    updateNotificationBadge();
}

// Создание центра уведомлений
function createNotificationCenter() {
    // Кнопка уведомлений в сайдбаре (если есть)
    const sidebar = document.querySelector('.sidebar');
    if (sidebar && !document.getElementById('notificationBtn')) {
        const notificationBtn = document.createElement('button');
        notificationBtn.id = 'notificationBtn';
        notificationBtn.className = 'notification-btn';
        notificationBtn.innerHTML = `
            <span class="notification-icon">🔔</span>
            <span class="notification-badge" id="notificationBadge">0</span>
        `;
        notificationBtn.title = 'Уведомления';
        notificationBtn.addEventListener('click', toggleNotificationCenter);
        
        // Вставляем в сайдбар после quick-access
        const quickAccess = sidebar.querySelector('.sidebar-quick-access');
        if (quickAccess) {
            quickAccess.after(notificationBtn);
        } else {
            const sidebarHeader = sidebar.querySelector('.sidebar-header');
            if (sidebarHeader) {
                sidebarHeader.after(notificationBtn);
            }
        }
    }
    
    // Создаем модальное окно центра уведомлений
    if (!document.getElementById('notificationCenter')) {
        const center = document.createElement('div');
        center.id = 'notificationCenter';
        center.className = 'notification-center';
        center.innerHTML = `
            <div class="notification-center-header">
                <h3 class="notification-center-title">УВЕДОМЛЕНИЯ</h3>
                <div class="notification-center-actions">
                    <button class="notification-action-btn" id="markAllReadBtn" title="Отметить все как прочитанные">✓</button>
                    <button class="notification-action-btn" id="clearAllBtn" title="Очистить все">🗑️</button>
                    <button class="notification-action-btn" id="closeNotificationCenter" title="Закрыть">×</button>
                </div>
            </div>
            <div class="notification-center-filters">
                <button class="filter-btn active" data-filter="all">Все</button>
                <button class="filter-btn" data-filter="unread">Непрочитанные</button>
                <button class="filter-btn" data-filter="system">Система</button>
                <button class="filter-btn" data-filter="message">Сообщения</button>
                <button class="filter-btn" data-filter="purchase">Покупки</button>
                <button class="filter-btn" data-filter="achievement">Достижения</button>
            </div>
            <div class="notification-center-content" id="notificationCenterContent">
                <div class="notification-empty">Нет уведомлений</div>
            </div>
        `;
        document.body.appendChild(center);
        
        // Обработчики событий
        document.getElementById('closeNotificationCenter').addEventListener('click', toggleNotificationCenter);
        document.getElementById('markAllReadBtn').addEventListener('click', markAllAsRead);
        document.getElementById('clearAllBtn').addEventListener('click', clearAllNotifications);
        
        // Фильтры
        document.querySelectorAll('.notification-center-filters .filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.notification-center-filters .filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const filter = e.target.getAttribute('data-filter');
                filterNotifications(filter);
            });
        });
        
        // Закрытие по клику вне окна
        center.addEventListener('click', (e) => {
            if (e.target === center) {
                toggleNotificationCenter();
            }
        });
    }
}

// Добавление уведомления
function addNotification(type, title, message, action = null) {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const notification = {
        id: Date.now() + Math.random(),
        type: type, // 'system', 'message', 'purchase', 'achievement', 'warning', 'error'
        title: title,
        message: message,
        action: action,
        read: false,
        timestamp: new Date().toISOString()
    };
    
    notifications.unshift(notification);
    
    // Ограничиваем до 100 уведомлений
    if (notifications.length > 100) {
        notifications.pop();
    }
    
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    // Обновляем UI
    loadNotifications();
    updateNotificationBadge();
    
    // Показываем toast уведомление
    showNotificationToast(notification);
    
    // Звуковое уведомление (опционально)
    playNotificationSound(type);
    
    return notification.id;
}

// Загрузка уведомлений
function loadNotifications(filter = 'all') {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const container = document.getElementById('notificationCenterContent');
    
    if (!container) return;
    
    // Фильтрация
    let filtered = notifications;
    if (filter !== 'all') {
        if (filter === 'unread') {
            filtered = notifications.filter(n => !n.read);
        } else {
            filtered = notifications.filter(n => n.type === filter);
        }
    }
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="notification-empty">Нет уведомлений</div>';
        return;
    }
    
    container.innerHTML = filtered.map(notif => createNotificationHTML(notif)).join('');
    
    // Обработчики для каждого уведомления
    container.querySelectorAll('.notification-item').forEach(item => {
        const id = item.getAttribute('data-id');
        const markReadBtn = item.querySelector('.notification-mark-read');
        const deleteBtn = item.querySelector('.notification-delete');
        
        if (markReadBtn) {
            markReadBtn.addEventListener('click', () => markAsRead(id));
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => deleteNotification(id));
        }
        
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.notification-actions')) {
                markAsRead(id);
                if (item.dataset.action) {
                    // Выполняем действие, если есть
                    try {
                        const action = JSON.parse(item.dataset.action);
                        if (action.type === 'navigate') {
                            window.location.href = action.url;
                        } else if (action.type === 'function' && typeof window[action.func] === 'function') {
                            window[action.func](...action.args || []);
                        }
                    } catch (e) {
                        console.error('Ошибка выполнения действия:', e);
                    }
                }
            }
        });
    });
}

// Создание HTML уведомления
function createNotificationHTML(notification) {
    const timeAgo = formatTime(notification.timestamp);
    const icon = getNotificationIcon(notification.type);
    const readClass = notification.read ? 'read' : '';
    
    return `
        <div class="notification-item ${readClass}" data-id="${notification.id}" data-action='${notification.action ? JSON.stringify(notification.action) : ''}'>
            <div class="notification-item-icon">${icon}</div>
            <div class="notification-item-content">
                <div class="notification-item-header">
                    <span class="notification-item-title">${escapeHtml(notification.title)}</span>
                    <span class="notification-item-time">${timeAgo}</span>
                </div>
                <div class="notification-item-message">${escapeHtml(notification.message)}</div>
            </div>
            <div class="notification-actions">
                ${!notification.read ? '<button class="notification-mark-read" title="Отметить как прочитанное">✓</button>' : ''}
                <button class="notification-delete" title="Удалить">×</button>
            </div>
        </div>
    `;
}

// Получение иконки по типу
function getNotificationIcon(type) {
    const icons = {
        'system': '⚙️',
        'message': '💬',
        'purchase': '🛒',
        'achievement': '⭐',
        'warning': '⚠️',
        'error': '❌',
        'success': '✅',
        'info': 'ℹ️'
    };
    return icons[type] || '🔔';
}

// Отметить как прочитанное
function markAsRead(id) {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const index = notifications.findIndex(n => n.id == id);
    if (index !== -1) {
        notifications[index].read = true;
        localStorage.setItem('notifications', JSON.stringify(notifications));
        loadNotifications();
        updateNotificationBadge();
    }
}

// Отметить все как прочитанные
function markAllAsRead() {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.forEach(n => n.read = true);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    loadNotifications();
    updateNotificationBadge();
}

// Удалить уведомление
function deleteNotification(id) {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const filtered = notifications.filter(n => n.id != id);
    localStorage.setItem('notifications', JSON.stringify(filtered));
    loadNotifications();
    updateNotificationBadge();
}

// Очистить все уведомления
function clearAllNotifications() {
    if (confirm('Вы уверены, что хотите удалить все уведомления?')) {
        localStorage.setItem('notifications', '[]');
        loadNotifications();
        updateNotificationBadge();
    }
}

// Фильтрация уведомлений
function filterNotifications(filter) {
    loadNotifications(filter);
}

// Обновление бейджа с количеством непрочитанных
function updateNotificationBadge() {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const unreadCount = notifications.filter(n => !n.read).length;
    const badge = document.getElementById('notificationBadge');
    
    if (badge) {
        badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

// Переключение центра уведомлений
function toggleNotificationCenter() {
    const center = document.getElementById('notificationCenter');
    if (center) {
        center.classList.toggle('active');
        if (center.classList.contains('active')) {
            loadNotifications();
        }
    }
}

// Показ toast уведомления
function showNotificationToast(notification) {
    const icon = getNotificationIcon(notification.type);
    const toast = document.createElement('div');
    toast.className = `notification-toast notification-toast-${notification.type}`;
    toast.innerHTML = `
        <div class="notification-toast-icon">${icon}</div>
        <div class="notification-toast-content">
            <div class="notification-toast-title">${escapeHtml(notification.title)}</div>
            <div class="notification-toast-message">${escapeHtml(notification.message)}</div>
        </div>
        <button class="notification-toast-close">×</button>
    `;
    
    document.body.appendChild(toast);
    
    // Анимация появления
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Закрытие
    toast.querySelector('.notification-toast-close').addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    });
    
    // Автоматическое закрытие через 5 секунд
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

// Звуковое уведомление
function playNotificationSound(type) {
    // Создаем простой звук через Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = type === 'error' ? 200 : type === 'warning' ? 300 : 400;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Игнорируем ошибки звука
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initNotifications();
});

// Экспорт функций для использования в других модулях
window.addNotification = addNotification;
window.initNotifications = initNotifications;
window.toggleNotificationCenter = toggleNotificationCenter;



