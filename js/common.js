// Общие функции для всех страниц

// Функция добавления активности пользователя
function addActivity(type, text) {
    const activities = JSON.parse(localStorage.getItem('user_activity') || '[]');
    activities.push({
        type: type,
        text: text,
        time: new Date().toISOString()
    });
    
    // Ограничиваем до 50 записей
    if (activities.length > 50) {
        activities.shift();
    }
    
    localStorage.setItem('user_activity', JSON.stringify(activities));
    
    // Обновляем активность на странице профиля, если функция loadActivity доступна
    if (typeof loadActivity === 'function') {
        loadActivity();
    }
}

// Функция форматирования времени
function formatTime(timeString) {
    const now = new Date();
    const time = new Date(timeString);
    const diff = now - time;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Только что';
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    if (days < 7) return `${days} дн назад`;
    
    return time.toLocaleDateString('ru-RU');
}

// Экранирование HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Форматирование даты
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

// Показать уведомление
function showNotification(message, type = 'info') {
    let container = document.getElementById('notificationContainer');
    
    if (!container) {
        container = document.createElement('div');
        container.id = 'notificationContainer';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        padding: 15px 20px;
        margin-bottom: 10px;
        background: ${type === 'error' ? 'rgba(255, 68, 68, 0.9)' : type === 'success' ? 'rgba(68, 255, 68, 0.9)' : 'rgba(0, 255, 255, 0.9)'};
        color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        pointer-events: auto;
        font-family: 'Roboto', Arial, sans-serif;
        font-size: 14px;
        font-weight: 500;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    container.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Автоматически скрываем через 5 секунд
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Проверка авторизации пользователя
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('darknet_user') || '{}');
    return user && user.username;
}

// Получить данные текущего пользователя
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('darknet_user') || '{}');
}

// Инициализация кнопки переключения сайдбара (если нужно)
function initSidebarToggle() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (toggleBtn && sidebar) {
        // Кнопка уже обрабатывается в sidebar.js, но можем добавить дополнительные функции
        if (!toggleBtn.innerHTML) {
            toggleBtn.innerHTML = '☰';
        }
    }
}

// Общая инициализация страницы
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация переключателя сайдбара
    initSidebarToggle();
});

