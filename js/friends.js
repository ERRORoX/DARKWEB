// Система друзей и контактов для DARKWEB

// Инициализация системы друзей
function initFriendsSystem() {
    loadFriendsList();
    loadOnlineFriends();
    setupFriendsEventListeners();
}

// Загрузка списка друзей
function loadFriendsList() {
    const user = getCurrentUser();
    if (!user.username) return;
    
    const friends = getFriendsList();
    const container = document.getElementById('friendsList');
    if (!container) return;
    
    if (friends.length === 0) {
        container.innerHTML = '<div class="friends-empty">Нет друзей</div>';
        return;
    }
    
    container.innerHTML = friends.map(friend => {
        const isOnline = isFriendOnline(friend.username);
        return `
            <div class="friend-item" data-username="${escapeHtml(friend.username)}">
                <div class="friend-avatar">
                    <span class="friend-avatar-icon">${friend.username.charAt(0).toUpperCase()}</span>
                    ${isOnline ? '<span class="friend-online-indicator"></span>' : ''}
                </div>
                <div class="friend-info">
                    <div class="friend-name">${escapeHtml(friend.username)}</div>
                    <div class="friend-status">${isOnline ? 'Онлайн' : 'Оффлайн'}</div>
                </div>
                <div class="friend-actions">
                    <button class="friend-action-btn" onclick="openPrivateMessage('${escapeHtml(friend.username)}')" title="Написать">💬</button>
                    <button class="friend-action-btn" onclick="removeFriend('${escapeHtml(friend.username)}')" title="Удалить">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

// Получение списка друзей
function getFriendsList() {
    const user = getCurrentUser();
    if (!user.username) return [];
    
    const friends = JSON.parse(localStorage.getItem('darkweb_friends') || '{}');
    return friends[user.username] || [];
}

// Добавление друга
function addFriend(username) {
    const user = getCurrentUser();
    if (!user.username) {
        if (typeof showNotification === 'function') {
            showNotification('Необходимо войти в систему', 'error');
        }
        return;
    }
    
    if (username === user.username) {
        if (typeof showNotification === 'function') {
            showNotification('Нельзя добавить себя в друзья', 'error');
        }
        return;
    }
    
    const friends = JSON.parse(localStorage.getItem('darkweb_friends') || '{}');
    if (!friends[user.username]) {
        friends[user.username] = [];
    }
    
    // Проверяем, не добавлен ли уже
    if (friends[user.username].find(f => f.username === username)) {
        if (typeof showNotification === 'function') {
            showNotification('Пользователь уже в друзьях', 'info');
        }
        return;
    }
    
    friends[user.username].push({
        username: username,
        addedAt: new Date().toISOString()
    });
    
    localStorage.setItem('darkweb_friends', JSON.stringify(friends));
    
    if (typeof showNotification === 'function') {
        showNotification(`${username} добавлен в друзья`, 'success');
    }
    
    if (typeof addActivity === 'function') {
        addActivity('friends', `Добавлен друг: ${username}`);
    }
    
    loadFriendsList();
}

// Удаление друга
function removeFriend(username) {
    if (!confirm(`Удалить ${username} из друзей?`)) return;
    
    const user = getCurrentUser();
    if (!user.username) return;
    
    const friends = JSON.parse(localStorage.getItem('darkweb_friends') || '{}');
    if (friends[user.username]) {
        friends[user.username] = friends[user.username].filter(f => f.username !== username);
        localStorage.setItem('darkweb_friends', JSON.stringify(friends));
        
        if (typeof showNotification === 'function') {
            showNotification(`${username} удален из друзей`, 'info');
        }
        
        loadFriendsList();
    }
}

// Проверка онлайн статуса друга
function isFriendOnline(username) {
    // Симуляция онлайн статуса
    const onlineUsers = JSON.parse(localStorage.getItem('darkweb_online_users') || '[]');
    return onlineUsers.includes(username);
}

// Загрузка онлайн друзей
function loadOnlineFriends() {
    const friends = getFriendsList();
    const onlineFriends = friends.filter(f => isFriendOnline(f.username));
    const container = document.getElementById('onlineFriends');
    
    if (!container) return;
    
    if (onlineFriends.length === 0) {
        container.innerHTML = '<div class="friends-empty">Нет друзей онлайн</div>';
        return;
    }
    
    container.innerHTML = onlineFriends.map(friend => {
        return `
            <div class="friend-item friend-item-online" onclick="openPrivateMessage('${escapeHtml(friend.username)}')">
                <div class="friend-avatar">
                    <span class="friend-avatar-icon">${friend.username.charAt(0).toUpperCase()}</span>
                    <span class="friend-online-indicator"></span>
                </div>
                <div class="friend-info">
                    <div class="friend-name">${escapeHtml(friend.username)}</div>
                    <div class="friend-status">Онлайн</div>
                </div>
            </div>
        `;
    }).join('');
}

// Настройка обработчиков событий
function setupFriendsEventListeners() {
    // Обновление списка друзей каждые 30 секунд
    setInterval(() => {
        loadFriendsList();
        loadOnlineFriends();
    }, 30000);
    
    // Симуляция онлайн пользователей
    const user = getCurrentUser();
    if (user.username) {
        const onlineUsers = JSON.parse(localStorage.getItem('darkweb_online_users') || '[]');
        if (!onlineUsers.includes(user.username)) {
            onlineUsers.push(user.username);
            localStorage.setItem('darkweb_online_users', JSON.stringify(onlineUsers));
        }
    }
}

// Открытие личного сообщения
function openPrivateMessage(username) {
    if (typeof initPrivateMessages === 'function') {
        initPrivateMessages();
        openPMWindow(username);
    } else {
        if (typeof showNotification === 'function') {
            showNotification('Система личных сообщений загружается...', 'info');
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initFriendsSystem();
});

// Экспорт функций
window.addFriend = addFriend;
window.removeFriend = removeFriend;
window.openPrivateMessage = openPrivateMessage;
window.initFriendsSystem = initFriendsSystem;

