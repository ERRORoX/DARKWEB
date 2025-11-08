// Профессиональная система множественных тем для DARKWEB

// Определение тем
const themes = {
    classic: {
        name: 'Классическая',
        icon: '🌙',
        colors: {
            '--bg-primary': '#0a0f1a',
            '--bg-secondary': '#1a1f2a',
            '--bg-glass': 'rgba(10, 15, 26, 0.8)',
            '--text-primary': '#ffffff',
            '--text-secondary': '#b0b0b0',
            '--accent-cyan': '#00ffff',
            '--accent-blue': '#1fc3ff',
            '--accent-glow': '#00ffff',
            '--border-color': 'rgba(0, 255, 255, 0.3)',
            '--shadow-glow': '0 0 20px rgba(0, 255, 255, 0.5)',
            '--shadow-dark': '0 8px 32px rgba(0, 0, 0, 0.8)'
        }
    },
    neon: {
        name: 'Неоновая',
        icon: '💜',
        colors: {
            '--bg-primary': '#0a0514',
            '--bg-secondary': '#1a0f2a',
            '--bg-glass': 'rgba(10, 5, 20, 0.8)',
            '--text-primary': '#ffffff',
            '--text-secondary': '#d0a0ff',
            '--accent-cyan': '#ff00ff',
            '--accent-blue': '#ff44ff',
            '--accent-glow': '#ff00ff',
            '--border-color': 'rgba(255, 0, 255, 0.4)',
            '--shadow-glow': '0 0 20px rgba(255, 0, 255, 0.6)',
            '--shadow-dark': '0 8px 32px rgba(0, 0, 0, 0.9)'
        }
    },
    matrix: {
        name: 'Матрица',
        icon: '🟢',
        colors: {
            '--bg-primary': '#000000',
            '--bg-secondary': '#0a0a0a',
            '--bg-glass': 'rgba(0, 0, 0, 0.9)',
            '--text-primary': '#00ff41',
            '--text-secondary': '#00cc33',
            '--accent-cyan': '#00ff41',
            '--accent-blue': '#00ff88',
            '--accent-glow': '#00ff41',
            '--border-color': 'rgba(0, 255, 65, 0.3)',
            '--shadow-glow': '0 0 20px rgba(0, 255, 65, 0.5)',
            '--shadow-dark': '0 8px 32px rgba(0, 0, 0, 1)'
        }
    },
    terminal: {
        name: 'Терминал',
        icon: '🖥️',
        colors: {
            '--bg-primary': '#000000',
            '--bg-secondary': '#0a0a0a',
            '--bg-glass': 'rgba(0, 0, 0, 0.95)',
            '--text-primary': '#00ff00',
            '--text-secondary': '#00aa00',
            '--accent-cyan': '#00ff00',
            '--accent-blue': '#00ff88',
            '--accent-glow': '#00ff00',
            '--border-color': 'rgba(0, 255, 0, 0.2)',
            '--shadow-glow': '0 0 15px rgba(0, 255, 0, 0.3)',
            '--shadow-dark': '0 8px 32px rgba(0, 0, 0, 1)'
        }
    },
    darkred: {
        name: 'Кровавая',
        icon: '🔴',
        colors: {
            '--bg-primary': '#1a0000',
            '--bg-secondary': '#2a0a0a',
            '--bg-glass': 'rgba(26, 0, 0, 0.8)',
            '--text-primary': '#ffffff',
            '--text-secondary': '#ffaaaa',
            '--accent-cyan': '#ff0000',
            '--accent-blue': '#ff4444',
            '--accent-glow': '#ff0000',
            '--border-color': 'rgba(255, 0, 0, 0.3)',
            '--shadow-glow': '0 0 20px rgba(255, 0, 0, 0.5)',
            '--shadow-dark': '0 8px 32px rgba(0, 0, 0, 0.8)'
        }
    }
};

// Инициализация системы тем
function initThemes() {
    loadTheme();
    createThemeSelector();
}

// Загрузка сохраненной темы
function loadTheme() {
    const savedTheme = localStorage.getItem('darkweb_theme') || 'classic';
    applyTheme(savedTheme);
}

// Применение темы
function applyTheme(themeName) {
    const theme = themes[themeName];
    if (!theme) {
        console.error('Тема не найдена:', themeName);
        return;
    }
    
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([property, value]) => {
        root.style.setProperty(property, value);
    });
    
    localStorage.setItem('darkweb_theme', themeName);
    
    // Обновляем селектор темы
    updateThemeSelector(themeName);
    
    // Уведомление
    if (typeof showNotification === 'function') {
        showNotification(`Тема "${theme.name}" применена`, 'success');
    }
}

// Создание селектора тем
function createThemeSelector() {
    // Селектор тем теперь только в настройках, не в сайдбаре
    // Инициализация происходит в settings.js через initSettingsThemes()
}

// Переключение меню тем
function toggleThemeMenu() {
    const menu = document.getElementById('themeMenu');
    if (menu) {
        menu.remove();
        return;
    }
    
    const currentTheme = localStorage.getItem('darkweb_theme') || 'classic';
    const menuElement = document.createElement('div');
    menuElement.id = 'themeMenu';
    menuElement.className = 'theme-menu';
    menuElement.innerHTML = `
        <div class="theme-menu-header">Выберите тему</div>
        <div class="theme-menu-content">
            ${Object.entries(themes).map(([key, theme]) => `
                <button class="theme-menu-option ${key === currentTheme ? 'active' : ''}" 
                        data-theme="${key}">
                    <span class="theme-menu-icon">${theme.icon}</span>
                    <span class="theme-menu-name">${theme.name}</span>
                    ${key === currentTheme ? '<span class="theme-menu-check">✓</span>' : ''}
                </button>
            `).join('')}
        </div>
    `;
    
    const toggle = document.getElementById('sidebarThemeToggle');
    if (toggle) {
        toggle.after(menuElement);
    }
    
    // Обработчики событий
    document.querySelectorAll('.theme-menu-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const themeName = btn.getAttribute('data-theme');
            applyTheme(themeName);
            menuElement.remove();
        });
    });
    
    // Закрытие при клике вне меню
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menuElement.contains(e.target) && e.target !== toggle) {
                menuElement.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 10);
}

// Обновление селектора темы
function updateThemeSelector(themeName) {
    // Обновляем активную тему в селекторе
    document.querySelectorAll('.theme-option').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-theme') === themeName) {
            btn.classList.add('active');
        }
    });
    
    // Обновляем переключатель в сайдбаре
    const toggle = document.getElementById('sidebarThemeToggle');
    if (toggle) {
        const theme = themes[themeName];
        toggle.innerHTML = `
            <span class="theme-toggle-icon">${theme.icon}</span>
            <span class="theme-toggle-text">${theme.name}</span>
        `;
    }
}

// Получение текущей темы
function getCurrentTheme() {
    return localStorage.getItem('darkweb_theme') || 'classic';
}

// Получение информации о теме
function getThemeInfo(themeName) {
    return themes[themeName] || themes.classic;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initThemes();
});

// Экспорт функций
window.initThemes = initThemes;
window.applyTheme = applyTheme;
window.getCurrentTheme = getCurrentTheme;
window.getThemeInfo = getThemeInfo;
window.themes = themes;

