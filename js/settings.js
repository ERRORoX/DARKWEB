// Settings functionality
document.addEventListener('DOMContentLoaded', () => {
    // Проверка авторизации
    const currentUser = JSON.parse(localStorage.getItem('darknet_user') || '{}');
    if (!currentUser.username) {
        alert('Необходимо войти в систему для доступа к настройкам');
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
    const theme = document.getElementById('theme');
    const saveBtn = document.getElementById('saveBtn');
    const exportDataBtn = document.getElementById('exportDataBtn');
    const clearDataBtn = document.getElementById('clearDataBtn');
    
    // Загружаем настройки из localStorage
    const settings = JSON.parse(localStorage.getItem('darkweb_settings') || '{}');
    
    // Применяем сохраненные настройки
    if (settings.emailNotifications !== undefined) emailNotifications.classList.toggle('active', settings.emailNotifications);
    if (settings.pushNotifications !== undefined) pushNotifications.classList.toggle('active', settings.pushNotifications);
    if (settings.showProfile !== undefined) showProfile.classList.toggle('active', settings.showProfile);
    if (settings.anonymousMode !== undefined) anonymousMode.classList.toggle('active', settings.anonymousMode);
    if (settings.twoFactorAuth !== undefined) twoFactorAuth.classList.toggle('active', settings.twoFactorAuth);
    if (settings.autoLogout !== undefined) autoLogout.classList.toggle('active', settings.autoLogout);
    if (settings.language) language.value = settings.language;
    if (settings.theme) theme.value = settings.theme;
    
    // Обработчики для переключателей
    [emailNotifications, pushNotifications, showProfile, anonymousMode, twoFactorAuth, autoLogout].forEach(toggle => {
        if (toggle) {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
            });
        }
    });
    
    // Сохранение настроек
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const newSettings = {
                emailNotifications: emailNotifications.classList.contains('active'),
                pushNotifications: pushNotifications.classList.contains('active'),
                showProfile: showProfile.classList.contains('active'),
                anonymousMode: anonymousMode.classList.contains('active'),
                twoFactorAuth: twoFactorAuth ? twoFactorAuth.classList.contains('active') : false,
                autoLogout: autoLogout ? autoLogout.classList.contains('active') : false,
                language: language.value,
                theme: theme.value
            };
            
            localStorage.setItem('darkweb_settings', JSON.stringify(newSettings));
            
            // Применяем тему
            if (newSettings.theme === 'light') {
                document.body.classList.add('light-theme');
            } else {
                document.body.classList.remove('light-theme');
            }
            
            // Обновляем тему в localStorage для других страниц
            localStorage.setItem('theme', newSettings.theme);
            
            // Добавляем активность
            addActivity('settings', 'Настройки обновлены');
            
            // Показываем уведомление
            alert('Настройки сохранены!');
        });
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
            
            addActivity('settings', 'Данные экспортированы');
            alert('Данные успешно экспортированы!');
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
                    const messages = JSON.parse(localStorage.getItem('darkweb_chat_messages') || '[]');
                    const filteredMessages = messages.filter(m => m.author !== user.username);
                    localStorage.setItem('darkweb_chat_messages', JSON.stringify(filteredMessages));
                    
                    // Очищаем покупки
                    const purchases = JSON.parse(localStorage.getItem('darkweb_purchases') || '[]');
                    const filteredPurchases = purchases.filter(p => p.buyer !== user.username);
                    localStorage.setItem('darkweb_purchases', JSON.stringify(filteredPurchases));
                    
                    // Очищаем активность
                    localStorage.setItem('user_activity', JSON.stringify([]));
                    
                    alert('Данные успешно очищены!');
                    addActivity('settings', 'Данные очищены');
                }
            }
        });
    }
    
    // Функция addActivity теперь в common.js
});

