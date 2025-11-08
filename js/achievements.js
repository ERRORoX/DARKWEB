// Профессиональная система достижений для DARKWEB

// Определение достижений
const achievements = {
    first_login: {
        id: 'first_login',
        name: 'Первый вход',
        description: 'Выполнен первый вход в систему',
        icon: '🔐',
        requirement: 1,
        type: 'login'
    },
    chat_master: {
        id: 'chat_master',
        name: 'Мастер общения',
        description: 'Отправлено 50 сообщений в чат',
        icon: '💬',
        requirement: 50,
        type: 'chat'
    },
    buyer: {
        id: 'buyer',
        name: 'Покупатель',
        description: 'Совершена первая покупка',
        icon: '🛒',
        requirement: 1,
        type: 'purchase'
    },
    big_spender: {
        id: 'big_spender',
        name: 'Большой покупатель',
        description: 'Совершено 10 покупок',
        icon: '💰',
        requirement: 10,
        type: 'purchase'
    },
    active_user: {
        id: 'active_user',
        name: 'Активный пользователь',
        description: 'Выполнено 100 действий',
        icon: '⭐',
        requirement: 100,
        type: 'activity'
    },
    profile_complete: {
        id: 'profile_complete',
        name: 'Завершенный профиль',
        description: 'Профиль полностью заполнен',
        icon: '👤',
        requirement: 1,
        type: 'profile'
    },
    explorer: {
        id: 'explorer',
        name: 'Исследователь',
        description: 'Посещено 10 различных страниц',
        icon: '🔍',
        requirement: 10,
        type: 'navigation'
    },
    night_owl: {
        id: 'night_owl',
        name: 'Ночная сова',
        description: 'Активность в ночное время',
        icon: '🦉',
        requirement: 1,
        type: 'time'
    },
    collector: {
        id: 'collector',
        name: 'Коллекционер',
        description: 'Разблокировано 5 достижений',
        icon: '🏆',
        requirement: 5,
        type: 'achievement'
    },
    legend: {
        id: 'legend',
        name: 'Легенда',
        description: 'Разблокировано все достижения',
        icon: '👑',
        requirement: 10,
        type: 'achievement'
    }
};

// Инициализация системы достижений
function initAchievements() {
    checkAchievements();
    createAchievementsDisplay();
}

// Проверка достижений
function checkAchievements() {
    const user = getCurrentUser();
    if (!user.username) return;
    
    const userAchievements = getUserAchievements();
    const stats = getUserStats();
    
    // Проверяем каждое достижение
    Object.values(achievements).forEach(achievement => {
        if (!userAchievements.find(a => a.id === achievement.id && a.unlocked)) {
            let progress = 0;
            let unlocked = false;
            
            switch (achievement.type) {
                case 'login':
                    progress = stats.loginCount || 0;
                    unlocked = progress >= achievement.requirement;
                    break;
                case 'chat':
                    progress = stats.messageCount || 0;
                    unlocked = progress >= achievement.requirement;
                    break;
                case 'purchase':
                    progress = stats.purchaseCount || 0;
                    unlocked = progress >= achievement.requirement;
                    break;
                case 'activity':
                    progress = stats.activityCount || 0;
                    unlocked = progress >= achievement.requirement;
                    break;
                case 'profile':
                    progress = user.profileComplete ? 1 : 0;
                    unlocked = progress >= achievement.requirement;
                    break;
                case 'navigation':
                    progress = stats.visitedPages?.length || 0;
                    unlocked = progress >= achievement.requirement;
                    break;
                case 'time':
                    const hour = new Date().getHours();
                    progress = (hour >= 22 || hour <= 6) ? 1 : 0;
                    unlocked = progress >= achievement.requirement;
                    break;
                case 'achievement':
                    const unlockedCount = userAchievements.filter(a => a.unlocked).length;
                    progress = unlockedCount;
                    unlocked = progress >= achievement.requirement;
                    break;
            }
            
            // Обновляем прогресс
            updateAchievementProgress(achievement.id, progress, unlocked);
            
            // Разблокируем достижение, если выполнено
            if (unlocked && !userAchievements.find(a => a.id === achievement.id && a.unlocked)) {
                unlockAchievement(achievement.id);
            }
        }
    });
}

// Получение статистики пользователя
function getUserStats() {
    const user = getCurrentUser();
    if (!user.username) return {};
    
    const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
    const userMessages = messages.filter(m => m.author === user.username);
    
    const purchases = JSON.parse(localStorage.getItem('user_purchases') || '[]');
    const userPurchases = purchases.filter(p => p.buyer === user.username);
    
    const activities = JSON.parse(localStorage.getItem('user_activity') || '[]');
    
    const loginCount = activities.filter(a => a.type === 'login').length;
    
    // Получаем посещенные страницы
    const visitedPages = JSON.parse(localStorage.getItem('user_visited_pages') || '[]');
    
    return {
        loginCount: loginCount,
        messageCount: userMessages.length,
        purchaseCount: userPurchases.length,
        activityCount: activities.length,
        visitedPages: visitedPages
    };
}

// Получение достижений пользователя
function getUserAchievements() {
    const user = getCurrentUser();
    if (!user.username) return [];
    
    const userAchievements = JSON.parse(localStorage.getItem('user_achievements') || '[]');
    const userAchievementsData = userAchievements.find(u => u.username === user.username);
    
    if (!userAchievementsData) {
        return Object.values(achievements).map(achievement => ({
            id: achievement.id,
            unlocked: false,
            progress: 0,
            unlockedAt: null
        }));
    }
    
    return userAchievementsData.achievements;
}

// Обновление прогресса достижения
function updateAchievementProgress(achievementId, progress, unlocked) {
    const user = getCurrentUser();
    if (!user.username) return;
    
    let userAchievements = JSON.parse(localStorage.getItem('user_achievements') || '[]');
    let userData = userAchievements.find(u => u.username === user.username);
    
    if (!userData) {
        userData = {
            username: user.username,
            achievements: Object.values(achievements).map(a => ({
                id: a.id,
                unlocked: false,
                progress: 0,
                unlockedAt: null
            }))
        };
        userAchievements.push(userData);
    }
    
    const achievement = userData.achievements.find(a => a.id === achievementId);
    if (achievement) {
        achievement.progress = progress;
        if (unlocked && !achievement.unlocked) {
            achievement.unlocked = true;
            achievement.unlockedAt = new Date().toISOString();
        }
    }
    
    localStorage.setItem('user_achievements', JSON.stringify(userAchievements));
}

// Разблокировка достижения
function unlockAchievement(achievementId) {
    const user = getCurrentUser();
    if (!user.username) return;
    
    const achievement = achievements[achievementId];
    if (!achievement) return;
    
    // Обновляем прогресс
    updateAchievementProgress(achievementId, achievement.requirement, true);
    
    // Показываем уведомление
    if (typeof showNotification === 'function') {
        showNotification(`Достижение разблокировано: ${achievement.name}`, 'achievement');
    }
    
    if (typeof addNotification === 'function') {
        addNotification('achievement', 'Достижение разблокировано!', `${achievement.icon} ${achievement.name}: ${achievement.description}`, {
            type: 'navigate',
            url: 'profile.html'
        });
    }
    
    // Добавляем активность
    if (typeof addActivity === 'function') {
        addActivity('achievement', `Достижение: ${achievement.name}`);
    }
    
    // Проверяем достижения, зависящие от других достижений
    checkAchievements();
}

// Создание отображения достижений
function createAchievementsDisplay() {
    // Добавляем секцию достижений в профиль, если страница существует
    const profilePage = document.querySelector('.profile-container, .main-content');
    if (profilePage && !document.getElementById('achievementsSection')) {
        const achievementsSection = document.createElement('div');
        achievementsSection.id = 'achievementsSection';
        achievementsSection.className = 'achievements-section';
        achievementsSection.innerHTML = `
            <div class="achievements-header">
                <h3 class="achievements-title">Достижения</h3>
                <div class="achievements-progress">
                    <span id="achievementsProgress">0/10</span>
                </div>
            </div>
            <div class="achievements-grid" id="achievementsGrid"></div>
        `;
        
        // Вставляем в профиль
        const mainContent = profilePage.querySelector('.main-content') || profilePage;
        mainContent.appendChild(achievementsSection);
        
        displayAchievements();
    }
}

// Отображение достижений
function displayAchievements() {
    const container = document.getElementById('achievementsGrid');
    if (!container) return;
    
    const userAchievements = getUserAchievements();
    const unlockedCount = userAchievements.filter(a => a.unlocked).length;
    
    // Обновляем прогресс
    const progressElement = document.getElementById('achievementsProgress');
    if (progressElement) {
        progressElement.textContent = `${unlockedCount}/${Object.keys(achievements).length}`;
    }
    
    container.innerHTML = Object.values(achievements).map(achievement => {
        const userAchievement = userAchievements.find(a => a.id === achievement.id);
        const unlocked = userAchievement?.unlocked || false;
        const progress = userAchievement?.progress || 0;
        const progressPercent = Math.min((progress / achievement.requirement) * 100, 100);
        
        return `
            <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}" data-achievement="${achievement.id}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-description">${achievement.description}</div>
                    <div class="achievement-progress">
                        <div class="achievement-progress-bar">
                            <div class="achievement-progress-fill" style="width: ${progressPercent}%"></div>
                        </div>
                        <div class="achievement-progress-text">${progress}/${achievement.requirement}</div>
                    </div>
                </div>
                ${unlocked ? '<div class="achievement-check">✓</div>' : ''}
            </div>
        `;
    }).join('');
}

// Получение информации о достижении
function getAchievementInfo(achievementId) {
    return achievements[achievementId] || null;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initAchievements();
});

// Отслеживание посещенных страниц
function trackPageVisit(pageName) {
    const user = getCurrentUser();
    if (!user.username) return;
    
    let visitedPages = JSON.parse(localStorage.getItem('user_visited_pages') || '[]');
    if (!visitedPages.includes(pageName)) {
        visitedPages.push(pageName);
        localStorage.setItem('user_visited_pages', JSON.stringify(visitedPages));
        checkAchievements();
    }
}

// Экспорт функций
window.initAchievements = initAchievements;
window.checkAchievements = checkAchievements;
window.unlockAchievement = unlockAchievement;
window.getAchievementInfo = getAchievementInfo;
window.trackPageVisit = trackPageVisit;
window.achievements = achievements;



