// Chat functionality
document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const onlineCount = document.getElementById('onlineCount');
    const clearChatBtn = document.getElementById('clearChatBtn');
    const refreshChatBtn = document.getElementById('refreshChatBtn');
    
    // Проверка наличия необходимых элементов
    if (!chatMessages || !chatInput || !sendBtn) {
        console.error('Необходимые элементы чата не найдены');
        return;
    }
    
    // Проверка авторизации
    const currentUser = JSON.parse(localStorage.getItem('darknet_user') || '{}');
    if (!currentUser.username) {
        alert('Необходимо войти в систему для доступа к чату');
        window.location.href = 'register.html';
        return;
    }
    
    const username = currentUser.username;
    
    // Загружаем сообщения из localStorage
    let messages = JSON.parse(localStorage.getItem('darkweb_chat_messages') || '[]');
    
    // Отображаем сохраненные сообщения
    messages.forEach(msg => {
        displayMessage(msg.author, msg.content, msg.time, msg.author === 'System');
    });
    
    // Обновляем время
    if (typeof updateTime === 'function') {
        updateTime();
        setInterval(updateTime, 1000);
    }
    
    // Обновляем счетчик онлайн (симуляция)
    if (typeof updateOnlineCount === 'function') {
        updateOnlineCount();
        setInterval(updateOnlineCount, 5000);
    }
    
    // Функция отправки сообщения
    function sendMessage() {
        if (!chatInput) return;
        const message = chatInput.value.trim();
        if (!message) return;
        
        const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        
        // Сохраняем сообщение
        const messageData = {
            author: username,
            content: message,
            time: time
        };
        
        messages.push(messageData);
        
        // Ограничиваем количество сообщений (последние 100)
        if (messages.length > 100) {
            messages = messages.slice(-100);
        }
        
        localStorage.setItem('darkweb_chat_messages', JSON.stringify(messages));
        
        // Отображаем сообщение
        displayMessage(username, message, time);
        
        // Добавляем активность
        addActivity('chat', `Отправлено сообщение в чат: ${message.substring(0, 30)}...`);
        
        // Очищаем поле ввода
        chatInput.value = '';
        
        // Прокручиваем вниз
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Функция addActivity теперь в common.js
    // Используем общую функцию из common.js
    
    // Функция отображения сообщения
    function displayMessage(author, content, time, isSystem = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        
        // Добавляем класс в зависимости от типа сообщения
        if (author === username) {
            messageDiv.classList.add('user-message');
        } else if (isSystem || author === 'System') {
            messageDiv.classList.add('system-message');
        }
        
        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="message-author">${escapeHtml(author)}</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-content">${escapeHtml(content)}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Функция экранирования HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Обновление времени
    function updateTime() {
        const timeElements = document.querySelectorAll('.message-time');
        if (timeElements.length > 0) {
            const lastTime = timeElements[timeElements.length - 1];
            if (lastTime.id === 'currentTime') {
                lastTime.textContent = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
            }
        }
    }
    
    // Обновление счетчика онлайн
    function updateOnlineCount() {
        const count = Math.floor(Math.random() * 50) + 10; // Симуляция 10-60 пользователей
        onlineCount.textContent = count;
    }
    
    // Обработчики событий
    sendBtn.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Автопрокрутка при загрузке
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Симуляция получения сообщений от других пользователей
    setInterval(() => {
        if (Math.random() > 0.95) { // 5% шанс каждые 5 секунд
            const botNames = ['Hacker_1337', 'DarkUser', 'Anon_User', 'CyberGhost', 'Shadow'];
            const botMessages = [
                'Кто-нибудь знает хороший VPN?',
                'Есть новости о последних обновлениях?',
                'Кто готов к новой операции?',
                'Проверяю безопасность...',
                'Остаемся анонимными!'
            ];
            
            const botName = botNames[Math.floor(Math.random() * botNames.length)];
            const botMessage = botMessages[Math.floor(Math.random() * botMessages.length)];
            const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
            
            const messageData = {
                author: botName,
                content: botMessage,
                time: time
            };
            
            messages.push(messageData);
            if (messages.length > 100) {
                messages = messages.slice(-100);
            }
            localStorage.setItem('darkweb_chat_messages', JSON.stringify(messages));
            
            displayMessage(botName, botMessage, time, false);
        }
    }, 5000);
    
    // Очистка чата
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите очистить весь чат?')) {
                localStorage.setItem('darkweb_chat_messages', JSON.stringify([]));
                chatMessages.innerHTML = '<div class="message system-message"><div class="message-header"><span class="message-author">System</span><span class="message-time"></span></div><div class="message-content">Чат очищен. Начните новую беседу.</div></div>';
                addActivity('chat', 'Чат очищен');
            }
        });
    }
    
    // Обновление чата
    if (refreshChatBtn) {
        refreshChatBtn.addEventListener('click', () => {
            chatMessages.innerHTML = '';
            const allMessages = JSON.parse(localStorage.getItem('darkweb_chat_messages') || '[]');
            allMessages.forEach(msg => {
                displayMessage(msg.author, msg.content, msg.time, msg.author === 'System');
            });
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    }
});

