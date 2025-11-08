// Settings functionality
document.addEventListener('DOMContentLoaded', () => {
    // Проверка авторизации
    const currentUser = JSON.parse(localStorage.getItem('darknet_user') || '{}');
    if (!currentUser.username) {
        if (typeof showNotification === 'function') {
            showNotification('Необходимо войти в систему', 'error');
        } else {
            alert('Необходимо войти в систему для доступа к настройкам');
        }
        window.location.href = 'register.html';
        return;
    }
    
    const emailNotifications = document.getElementById('emailNotifications');
    const pushNotifications = document.getElementById('pushNotifications');
    const showProfile = document.getElementById('showProfile');
    const anonymousMode = document.getElementById('anonymousMode');
    const twoFactorAuth = document.getElementById('twoFactorAuth');
    const autoLogout = document.getElementById('autoLogout');
    const language = document.getElementById('language');
    const fontSize = document.getElementById('fontSize');
    const animationsEnabled = document.getElementById('animationsEnabled');
    const particlesEnabled = document.getElementById('particlesEnabled');
    const glowEffects = document.getElementById('glowEffects');
    const pageTransitions = document.getElementById('pageTransitions');
    const compactMode = document.getElementById('compactMode');
    const saveBtn = document.getElementById('saveBtn');
    const exportDataBtn = document.getElementById('exportDataBtn');
    const clearDataBtn = document.getElementById('clearDataBtn');
    
    // Загружаем настройки из localStorage
    const settings = JSON.parse(localStorage.getItem('darkweb_settings') || '{}');
    
    // Применяем сохраненные настройки
    if (settings.emailNotifications !== undefined && emailNotifications) emailNotifications.classList.toggle('active', settings.emailNotifications);
    if (settings.pushNotifications !== undefined && pushNotifications) pushNotifications.classList.toggle('active', settings.pushNotifications);
    if (settings.showProfile !== undefined && showProfile) showProfile.classList.toggle('active', settings.showProfile);
    if (settings.anonymousMode !== undefined && anonymousMode) anonymousMode.classList.toggle('active', settings.anonymousMode);
    if (settings.twoFactorAuth !== undefined && twoFactorAuth) twoFactorAuth.classList.toggle('active', settings.twoFactorAuth);
    if (settings.autoLogout !== undefined && autoLogout) autoLogout.classList.toggle('active', settings.autoLogout);
    if (settings.language && language) language.value = settings.language;
    if (settings.fontSize && fontSize) fontSize.value = settings.fontSize;
    if (settings.animationsEnabled !== undefined && animationsEnabled) animationsEnabled.classList.toggle('active', settings.animationsEnabled !== false);
    if (settings.particlesEnabled !== undefined && particlesEnabled) particlesEnabled.classList.toggle('active', settings.particlesEnabled !== false);
    if (settings.glowEffects !== undefined && glowEffects) glowEffects.classList.toggle('active', settings.glowEffects !== false);
    if (settings.pageTransitions !== undefined && pageTransitions) pageTransitions.classList.toggle('active', settings.pageTransitions !== false);
    if (settings.compactMode !== undefined && compactMode) compactMode.classList.toggle('active', settings.compactMode);
    
    // Применяем настройки оформления
    applyDisplaySettings(settings);
    
    // Обработчики для переключателей
    [emailNotifications, pushNotifications, showProfile, anonymousMode, twoFactorAuth, autoLogout, animationsEnabled, particlesEnabled, glowEffects, pageTransitions, compactMode].forEach(toggle => {
        if (toggle) {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                // Автосохранение при изменении
                saveSettings();
            });
        }
    });
    
    // Обработчики для select
    if (language) {
        language.addEventListener('change', () => {
            saveSettings();
        });
    }
    
    if (fontSize) {
        fontSize.addEventListener('change', () => {
            applyFontSize(fontSize.value);
            saveSettings();
        });
    }
    
    // Сохранение настроек
    function saveSettings() {
        const newSettings = {
            emailNotifications: emailNotifications?.classList.contains('active') || false,
            pushNotifications: pushNotifications?.classList.contains('active') || false,
            showProfile: showProfile?.classList.contains('active') !== false,
            anonymousMode: anonymousMode?.classList.contains('active') || false,
            twoFactorAuth: twoFactorAuth?.classList.contains('active') || false,
            autoLogout: autoLogout?.classList.contains('active') || false,
            language: language?.value || 'ru',
            fontSize: fontSize?.value || 'medium',
            animationsEnabled: animationsEnabled?.classList.contains('active') !== false,
            particlesEnabled: particlesEnabled?.classList.contains('active') !== false,
            glowEffects: glowEffects?.classList.contains('active') !== false,
            pageTransitions: pageTransitions?.classList.contains('active') !== false,
            compactMode: compactMode?.classList.contains('active') || false,
            theme: localStorage.getItem('darkweb_theme') || 'classic'
        };
        
        localStorage.setItem('darkweb_settings', JSON.stringify(newSettings));
        
        // Применяем настройки оформления
        applyDisplaySettings(newSettings);
        
        // Добавляем активность
        if (typeof addActivity === 'function') {
            addActivity('settings', 'Настройки обновлены');
        }
        
        // Показываем уведомление
        if (typeof showNotification === 'function') {
            showNotification('Настройки сохранены', 'success');
        }
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveSettings);
    }
    
    // Экспорт данных
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', () => {
            const user = JSON.parse(localStorage.getItem('darknet_user') || '{}');
            const messages = JSON.parse(localStorage.getItem('darkweb_chat_messages') || '[]');
            const purchases = JSON.parse(localStorage.getItem('darkweb_purchases') || '[]');
            const activities = JSON.parse(localStorage.getItem('user_activity') || '[]');
            const settings = JSON.parse(localStorage.getItem('darkweb_settings') || '{}');
            
            const exportData = {
                user: user,
                messages: messages.filter(m => m.author === user.username),
                purchases: purchases.filter(p => p.buyer === user.username),
                activities: activities,
                settings: settings,
                exportDate: new Date().toISOString()
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `darkweb_export_${user.username}_${Date.now()}.json`;
            link.click();
            URL.revokeObjectURL(url);
            
            if (typeof addActivity === 'function') {
                addActivity('settings', 'Данные экспортированы');
            }
            if (typeof showNotification === 'function') {
                showNotification('Данные успешно экспортированы', 'success');
            } else {
                alert('Данные успешно экспортированы!');
            }
        });
    }
    
    // Очистка данных
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', () => {
            if (confirm('ВНИМАНИЕ! Это действие удалит ВСЕ ваши данные. Вы уверены?')) {
                if (confirm('Это действие необратимо! Продолжить?')) {
                    // Удаляем только данные текущего пользователя
                    const user = JSON.parse(localStorage.getItem('darknet_user') || '{}');
                    
                    // Очищаем сообщения пользователя
                    const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
                    const filteredMessages = messages.filter(m => m.author !== user.username);
                    localStorage.setItem('chat_messages', JSON.stringify(filteredMessages));
                    
                    // Очищаем покупки
                    const purchases = JSON.parse(localStorage.getItem('user_purchases') || '[]');
                    const filteredPurchases = purchases.filter(p => p.buyer !== user.username);
                    localStorage.setItem('user_purchases', JSON.stringify(filteredPurchases));
                    
                    // Очищаем активность
                    localStorage.setItem('user_activity', JSON.stringify([]));
                    
                    if (typeof showNotification === 'function') {
                        showNotification('Данные успешно очищены', 'success');
                    } else {
                        alert('Данные успешно очищены!');
                    }
                    if (typeof addActivity === 'function') {
                        addActivity('settings', 'Данные очищены');
                    }
                }
            }
        });
    }
});

// Инициализация селектора тем в настройках
function initSettingsThemes() {
    const themeSelector = document.getElementById('themeSelector');
    if (!themeSelector || typeof themes === 'undefined') return;
    
    const currentTheme = localStorage.getItem('darkweb_theme') || 'classic';
    
    themeSelector.innerHTML = Object.entries(themes).map(([key, theme]) => {
        const isActive = key === currentTheme;
        return `
            <div class="theme-option ${isActive ? 'active' : ''}" 
                 data-theme="${key}" 
                 onclick="selectTheme('${key}')"
                 title="${theme.name}">
                <div class="theme-option-preview" style="background: ${theme.colors['--bg-primary']}; border-color: ${theme.colors['--accent-cyan']};">
                    <div class="theme-preview-accent" style="background: ${theme.colors['--accent-cyan']};"></div>
                </div>
                <div class="theme-option-info">
                    <span class="theme-option-icon">${theme.icon}</span>
                    <span class="theme-option-name">${theme.name}</span>
                    ${isActive ? '<span class="theme-option-check">✓</span>' : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Выбор темы
function selectTheme(themeName) {
    if (typeof applyTheme === 'function') {
        applyTheme(themeName);
        initSettingsThemes(); // Обновляем отображение
        saveSettings(); // Сохраняем настройки
    }
}

// Применение настроек оформления
function applyDisplaySettings(settings) {
    // Размер шрифта
    if (settings.fontSize) {
        applyFontSize(settings.fontSize);
    }
    
    // Анимации
    if (settings.animationsEnabled === false) {
        document.body.classList.add('no-animations');
    } else {
        document.body.classList.remove('no-animations');
    }
    
    // Частицы
    const particleCanvas = document.getElementById('particleCanvas');
    if (particleCanvas) {
        particleCanvas.style.display = settings.particlesEnabled === false ? 'none' : 'block';
    }
    
    // Эффекты свечения
    if (settings.glowEffects === false) {
        document.documentElement.style.setProperty('--shadow-glow', 'none');
    } else {
        document.documentElement.style.setProperty('--shadow-glow', '0 0 20px rgba(0, 255, 255, 0.5)');
    }
    
    // Компактный режим
    if (settings.compactMode) {
        document.body.classList.add('compact-mode');
    } else {
        document.body.classList.remove('compact-mode');
    }
}

// Применение размера шрифта
function applyFontSize(size) {
    const root = document.documentElement;
    switch (size) {
        case 'small':
            root.style.fontSize = '12px';
            break;
        case 'medium':
            root.style.fontSize = '14px';
            break;
        case 'large':
            root.style.fontSize = '16px';
            break;
    }
}

// Экспорт функций
window.selectTheme = selectTheme;
window.initSettingsThemes = initSettingsThemes;


