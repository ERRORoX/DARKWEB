// Общая инициализация всех функций DARKWEB

// Инициализация всех модулей
function initAllModules() {
    // Инициализация обработки ошибок (первым делом)
    if (typeof initErrorHandler === 'function') {
        initErrorHandler();
    }
    
    // Инициализация системы уведомлений
    if (typeof initNotifications === 'function') {
        initNotifications();
    }
    
    // Инициализация глобального поиска
    if (typeof initGlobalSearch === 'function') {
        // Ждем загрузки сайдбара
        setTimeout(() => {
            initGlobalSearch();
        }, 500);
    }
    
    // Инициализация системы тем
    if (typeof initThemes === 'function') {
        initThemes();
    }
    
    // Инициализация системы достижений
    if (typeof initAchievements === 'function') {
        initAchievements();
    }
    
    // Инициализация анимаций
    if (typeof initAnimations === 'function') {
        initAnimations();
    }
    
    // Инициализация улучшенного маркетплейса
    if (typeof initEnhancedMarketplace === 'function') {
        initEnhancedMarketplace();
    }
    
    // Инициализация улучшенного чата
    if (typeof initEnhancedChat === 'function') {
        initEnhancedChat();
    }
    
    // Инициализация системы друзей
    if (typeof initFriendsSystem === 'function') {
        initFriendsSystem();
    }
    
    // Инициализация системы личных сообщений
    if (typeof initPrivateMessages === 'function') {
        initPrivateMessages();
    }
    
    // Инициализация переходов между страницами
    if (typeof initPageTransitions === 'function') {
        initPageTransitions();
    }
    
    // Инициализация других модулей
    if (typeof initSidebar === 'function') {
        initSidebar();
    }
    
    // Отслеживание посещенных страниц для достижений
    if (typeof trackPageVisit === 'function') {
        const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
        if (currentPage) {
            trackPageVisit(currentPage);
        }
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    initAllModules();
});

// Экспорт функций
window.initAllModules = initAllModules;

