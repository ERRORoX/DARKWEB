// Система плавных переходов между страницами

// Инициализация переходов
function initPageTransitions() {
    // Добавляем обработчики для всех ссылок
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        if (!href) return;
        
        // Пропускаем внешние ссылки и якоря
        if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('#')) {
            return;
        }
        
        // Пропускаем если это уже текущая страница
        if (href === window.location.pathname.split('/').pop()) {
            e.preventDefault();
            return;
        }
        
        // Применяем переход
        if (href.endsWith('.html') || !href.includes('.')) {
            e.preventDefault();
            navigateWithTransition(href);
        }
    });
    
    // Обрабатываем переход назад
    window.addEventListener('popstate', () => {
        showPageTransition('out');
        setTimeout(() => {
            showPageTransition('in');
        }, 300);
    });
}

// Навигация с переходом
function navigateWithTransition(url) {
    // Показываем анимацию выхода
    showPageTransition('out');
    
    // Переходим на новую страницу после анимации
    setTimeout(() => {
        window.location.href = url;
    }, 300);
}

// Показ анимации перехода
function showPageTransition(direction) {
    const transition = document.createElement('div');
    transition.className = `page-transition page-transition-${direction}`;
    document.body.appendChild(transition);
    
    if (direction === 'out') {
        transition.style.opacity = '0';
        setTimeout(() => {
            transition.style.opacity = '1';
        }, 10);
    } else {
        transition.style.opacity = '1';
        setTimeout(() => {
            transition.style.opacity = '0';
            setTimeout(() => {
                transition.remove();
            }, 300);
        }, 300);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initPageTransitions();
    // Показываем анимацию входа
    showPageTransition('in');
});

// Экспорт функций
window.navigateWithTransition = navigateWithTransition;

