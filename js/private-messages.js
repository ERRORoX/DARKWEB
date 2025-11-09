// Система личных сообщений (PM) для DARKWEB

let pmWindows = [];
let currentPMWindow = null;

// Инициализация системы личных сообщений
function initPrivateMessages() {
    createPMContainer();
    loadPMHistory();
    setupPMEventListeners();
}

// Создание контейнера для PM окон
function createPMContainer() {
    if (document.getElementById('pmContainer')) return;
    
    const container = document.createElement('div');
    container.id = 'pmContainer';
    container.className = 'pm-container';
    document.body.appendChild(container);
}

// Открытие окна личного сообщения
function openPMWindow(username) {
    const user = getCurrentUser();
    if (!user.username) {
        if (typeof showNotification === 'function') {
            showNotification('Необходимо войти в систему', 'error');
        }
        return;
    }
    
    // Проверяем, не открыто ли уже окно с этим пользователем
    const existingWindow = pmWindows.find(w => w.username === username);
    if (existingWindow) {
        existingWindow.element.style.display = 'block';
        existingWindow.element.style.zIndex = Math.max(...pmWindows.map(w => parseInt(w.element.style.zIndex) || 1000)) + 1;
        focusPMWindow(existingWindow.element);
        return;
    }
    
    // Создаем новое окно
    const pmWindow = document.createElement('div');
    pmWindow.className = 'pm-window';
    pmWindow.dataset.username = username;
    
    const zIndex = 1000 + pmWindows.length;
    pmWindow.style.zIndex = zIndex;
    
    pmWindow.innerHTML = `
        <div class="pm-window-header">
            <div class="pm-window-title">
                <span class="pm-window-avatar">${username.charAt(0).toUpperCase()}</span>
                <span class="pm-window-name">${escapeHtml(username)}</span>
                ${isFriendOnline(username) ? '<span class="pm-online-indicator"></span>' : ''}
            </div>
            <div class="pm-window-actions">
                <button class="pm-window-btn" onclick="minimizePMWindow('${escapeHtml(username)}')" title="Свернуть">−</button>
                <button class="pm-window-btn" onclick="closePMWindow('${escapeHtml(username)}')" title="Закрыть">×</button>
            </div>
        </div>
        <div class="pm-window-messages" id="pmMessages_${escapeHtml(username)}">
            <!-- Сообщения будут загружены здесь -->
        </div>
        <div class="pm-window-input-container">
            <input type="text" class="pm-window-input" id="pmInput_${escapeHtml(username)}" placeholder="Введите сообщение..." autocomplete="off">
            <button class="pm-window-send-btn" onclick="sendPM('${escapeHtml(username)}')">Отправить</button>
        </div>
    `;
    
    const pmContainer = document.getElementById('pmContainer');
    if (!pmContainer) {
        createPMContainer();
        const newContainer = document.getElementById('pmContainer');
        if (newContainer) {
            newContainer.appendChild(pmWindow);
        } else {
            console.error('Не удалось создать контейнер для PM окон');
            return;
        }
    } else {
        pmContainer.appendChild(pmWindow);
    }
    
    // Добавляем в массив окон
    const windowObj = {
        username: username,
        element: pmWindow
    };
    pmWindows.push(windowObj);
    
    // Загружаем сообщения
    loadPMMessages(username);
    
    // Фокус на окно
    focusPMWindow(pmWindow);
    
    // Обработчик отправки сообщения по Enter
    const input = pmWindow.querySelector('.pm-window-input');
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendPM(username);
        }
    });
    
    // Перетаскивание окна
    makePMWindowDraggable(pmWindow);
}

// Загрузка сообщений PM
function loadPMMessages(username) {
    const user = getCurrentUser();
    if (!user.username) return;
    
    const messages = JSON.parse(localStorage.getItem('darkweb_pm_messages') || '[]');
    const conversationMessages = messages.filter(m => 
        (m.from === user.username && m.to === username) ||
        (m.from === username && m.to === user.username)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    const container = document.getElementById(`pmMessages_${username}`);
    if (!container) return;
    
    if (conversationMessages.length === 0) {
        container.innerHTML = '<div class="pm-empty">Нет сообщений</div>';
        return;
    }
    
    container.innerHTML = conversationMessages.map(msg => {
        const isOwn = msg.from === user.username;
        const time = new Date(msg.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        
        return `
            <div class="pm-message ${isOwn ? 'pm-message-own' : 'pm-message-other'}">
                <div class="pm-message-content">${escapeHtml(msg.content)}</div>
                <div class="pm-message-time">${time}</div>
            </div>
        `;
    }).join('');
    
    // Прокрутка вниз
    container.scrollTop = container.scrollHeight;
}

// Отправка PM
function sendPM(username) {
    const user = getCurrentUser();
    if (!user.username) return;
    
    const input = document.getElementById(`pmInput_${username}`);
    if (!input) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    // Сохраняем сообщение
    const messages = JSON.parse(localStorage.getItem('darkweb_pm_messages') || '[]');
    messages.push({
        from: user.username,
        to: username,
        content: message,
        timestamp: new Date().toISOString(),
        read: false
    });
    localStorage.setItem('darkweb_pm_messages', JSON.stringify(messages));
    
    // Очищаем поле ввода
    input.value = '';
    
    // Обновляем отображение
    loadPMMessages(username);
    
    // Воспроизводим звук (для получателя)
    if (typeof playNotificationSound === 'function') {
        // Это будет обработано при получении сообщения
    }
    
    // Добавляем активность
    if (typeof addActivity === 'function') {
        addActivity('pm', `Отправлено PM: ${username}`);
    }
}

// Закрытие PM окна
function closePMWindow(username) {
    const windowObj = pmWindows.find(w => w.username === username);
    if (windowObj) {
        windowObj.element.remove();
        pmWindows = pmWindows.filter(w => w.username !== username);
    }
}

// Сворачивание PM окна
function minimizePMWindow(username) {
    const windowObj = pmWindows.find(w => w.username === username);
    if (windowObj) {
        const messagesContainer = windowObj.element.querySelector('.pm-window-messages');
        const inputContainer = windowObj.element.querySelector('.pm-window-input-container');
        
        if (messagesContainer.style.display === 'none') {
            messagesContainer.style.display = 'block';
            inputContainer.style.display = 'flex';
            windowObj.element.classList.remove('pm-window-minimized');
        } else {
            messagesContainer.style.display = 'none';
            inputContainer.style.display = 'none';
            windowObj.element.classList.add('pm-window-minimized');
        }
    }
}

// Фокус на PM окно
function focusPMWindow(element) {
    pmWindows.forEach(w => {
        w.element.style.opacity = '0.9';
    });
    element.style.opacity = '1';
    element.style.zIndex = Math.max(...pmWindows.map(w => parseInt(w.element.style.zIndex) || 1000)) + 1;
}

// Перетаскивание PM окна
function makePMWindowDraggable(element) {
    const header = element.querySelector('.pm-window-header');
    if (!header) return;
    
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    
    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    
    function dragStart(e) {
        if (e.target.closest('.pm-window-btn')) return;
        
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        
        if (e.target === header || header.contains(e.target)) {
            isDragging = true;
            focusPMWindow(element);
        }
    }
    
    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            xOffset = currentX;
            yOffset = currentY;
            
            element.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
    }
    
    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }
}

// Загрузка истории PM
function loadPMHistory() {
    const user = getCurrentUser();
    if (!user.username) return;
    
    const messages = JSON.parse(localStorage.getItem('darkweb_pm_messages') || '[]');
    const conversations = {};
    
    messages.forEach(msg => {
        const otherUser = msg.from === user.username ? msg.to : msg.from;
        if (!conversations[otherUser]) {
            conversations[otherUser] = {
                username: otherUser,
                lastMessage: msg,
                unread: msg.to === user.username && !msg.read ? 1 : 0
            };
        } else {
            if (new Date(msg.timestamp) > new Date(conversations[otherUser].lastMessage.timestamp)) {
                conversations[otherUser].lastMessage = msg;
            }
            if (msg.to === user.username && !msg.read) {
                conversations[otherUser].unread++;
            }
        }
    });
    
    return Object.values(conversations);
}

// Настройка обработчиков событий
function setupPMEventListeners() {
    // Проверка новых сообщений каждые 5 секунд
    setInterval(() => {
        const user = getCurrentUser();
        if (!user.username) return;
        
        const messages = JSON.parse(localStorage.getItem('darkweb_pm_messages') || '[]');
        const unreadMessages = messages.filter(m => m.to === user.username && !m.read);
        
        if (unreadMessages.length > 0) {
            // Обновляем открытые окна
            pmWindows.forEach(windowObj => {
                loadPMMessages(windowObj.username);
            });
            
            // Воспроизводим звук
            if (typeof playNotificationSound === 'function') {
                playNotificationSound('message');
            }
            
            // Показываем уведомление
            if (typeof showNotification === 'function') {
                showNotification(`У вас ${unreadMessages.length} новых сообщений`, 'info');
            }
        }
    }, 5000);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initPrivateMessages();
});

// Экспорт функций
window.openPMWindow = openPMWindow;
window.sendPM = sendPM;
window.closePMWindow = closePMWindow;
window.minimizePMWindow = minimizePMWindow;
window.initPrivateMessages = initPrivateMessages;

