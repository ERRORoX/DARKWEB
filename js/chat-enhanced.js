// Профессиональный улучшенный чат для DARKWEB

// Инициализация улучшенного чата
function initEnhancedChat() {
    initEmojiPicker();
    initFileUpload();
    initMessageReactions();
    initGroupChats();
    updateOnlineCount();
}

// ========== EMOJI PICKER ==========

// Инициализация эмодзи-пикера
function initEmojiPicker() {
    const chatInput = document.getElementById('chatInput');
    if (!chatInput) return;
    
    // Добавляем кнопку эмодзи
    const emojiBtn = document.createElement('button');
    emojiBtn.className = 'chat-emoji-btn';
    emojiBtn.innerHTML = '😊';
    emojiBtn.title = 'Эмодзи';
    emojiBtn.addEventListener('click', toggleEmojiPicker);
    
    const chatInputContainer = chatInput.parentElement;
    if (chatInputContainer) {
        chatInputContainer.insertBefore(emojiBtn, chatInput);
    }
    
    // Создаем эмодзи-пикер
    createEmojiPicker();
}

// Создание эмодзи-пикера
function createEmojiPicker() {
    if (document.getElementById('emojiPicker')) return;
    
    const emojiPicker = document.createElement('div');
    emojiPicker.id = 'emojiPicker';
    emojiPicker.className = 'emoji-picker';
    
    const emojis = ['😀', '😂', '😍', '🥰', '😎', '🤔', '😴', '🤗', '👍', '👎', '❤️', '🔥', '💯', '✨', '🎉', '🚀', '💻', '🔒', '⚡', '🎯'];
    
    emojiPicker.innerHTML = `
        <div class="emoji-picker-header">
            <span class="emoji-picker-title">Эмодзи</span>
            <button class="emoji-picker-close" onclick="toggleEmojiPicker()">×</button>
        </div>
        <div class="emoji-picker-content">
            ${emojis.map(emoji => `<span class="emoji-item" onclick="insertEmoji('${emoji}')">${emoji}</span>`).join('')}
        </div>
    `;
    
    document.body.appendChild(emojiPicker);
}

// Переключение эмодзи-пикера
function toggleEmojiPicker() {
    const emojiPicker = document.getElementById('emojiPicker');
    if (emojiPicker) {
        emojiPicker.classList.toggle('active');
    }
}

// Вставка эмодзи
function insertEmoji(emoji) {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        const cursorPos = chatInput.selectionStart;
        const textBefore = chatInput.value.substring(0, cursorPos);
        const textAfter = chatInput.value.substring(cursorPos);
        chatInput.value = textBefore + emoji + textAfter;
        chatInput.focus();
        chatInput.setSelectionRange(cursorPos + emoji.length, cursorPos + emoji.length);
    }
    toggleEmojiPicker();
}

// ========== ЗАГРУЗКА ФАЙЛОВ ==========

// Инициализация загрузки файлов
function initFileUpload() {
    const chatInput = document.getElementById('chatInput');
    if (!chatInput) return;
    
    // Добавляем кнопку загрузки файлов
    const fileBtn = document.createElement('button');
    fileBtn.className = 'chat-file-btn';
    fileBtn.innerHTML = '📎';
    fileBtn.title = 'Прикрепить файл';
    fileBtn.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.addEventListener('change', handleFileUpload);
        fileInput.click();
    });
    
    const chatInputContainer = chatInput.parentElement;
    if (chatInputContainer) {
        chatInputContainer.insertBefore(fileBtn, chatInput);
    }
}

// Обработка загрузки файлов
function handleFileUpload(event) {
    const files = event.target.files;
    if (files.length === 0) return;
    
    Array.from(files).forEach(file => {
        // Симуляция загрузки файла
        const fileName = file.name;
        const fileSize = (file.size / 1024).toFixed(2) + ' KB';
        
        // Добавляем сообщение о файле
        sendFileMessage(fileName, fileSize);
        
        if (typeof showNotification === 'function') {
            showNotification(`Файл "${fileName}" прикреплен`, 'success');
        }
    });
}

// Отправка сообщения о файле
function sendFileMessage(fileName, fileSize) {
    const user = getCurrentUser();
    if (!user.username) return;
    
    const chatMessages = document.getElementById('chatMessages');
    const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    
    const messageData = {
        author: user.username,
        content: `📎 Файл: ${fileName} (${fileSize})`,
        time: time,
        type: 'file',
        fileName: fileName,
        fileSize: fileSize
    };
    
    let messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
    messages.push(messageData);
    
    if (messages.length > 100) {
        messages = messages.slice(-100);
    }
    
    localStorage.setItem('chat_messages', JSON.stringify(messages));
    
    if (typeof displayMessage === 'function') {
        displayMessage(user.username, messageData.content, time, false, 'file');
    } else {
        displayEnhancedMessage(user.username, messageData.content, time, false, 'file');
    }
    
    if (typeof addActivity === 'function') {
        addActivity('chat', `Прикреплен файл: ${fileName}`);
    }
}

// ========== РЕАКЦИИ НА СООБЩЕНИЯ ==========

// Инициализация реакций
function initMessageReactions() {
    // Добавляем возможность добавлять реакции к сообщениям
    document.addEventListener('click', (e) => {
        if (e.target.closest('.message')) {
            const message = e.target.closest('.message');
            if (!message.querySelector('.message-reactions')) {
                showReactionMenu(message, e);
            }
        }
    });
}

// Показ меню реакций
function showReactionMenu(message, event) {
    event.preventDefault();
    
    const reactions = ['👍', '❤️', '😂', '🔥', '🎉'];
    const menu = document.createElement('div');
    menu.className = 'reaction-menu';
    menu.innerHTML = reactions.map(reaction => 
        `<span class="reaction-item" onclick="addReaction(this, '${reaction}')">${reaction}</span>`
    ).join('');
    
    message.appendChild(menu);
    
    setTimeout(() => {
        if (!message.contains(document.activeElement)) {
            menu.remove();
        }
    }, 3000);
}

// Добавление реакции
function addReaction(element, reaction) {
    const message = element.closest('.message');
    if (!message) return;
    
    let reactionsContainer = message.querySelector('.message-reactions');
    if (!reactionsContainer) {
        reactionsContainer = document.createElement('div');
        reactionsContainer.className = 'message-reactions';
        message.appendChild(reactionsContainer);
    }
    
    const reactionElement = document.createElement('span');
    reactionElement.className = 'message-reaction';
    reactionElement.textContent = reaction;
    reactionsContainer.appendChild(reactionElement);
    
    // Удаляем меню
    const menu = message.querySelector('.reaction-menu');
    if (menu) {
        menu.remove();
    }
}

// ========== ГРУППОВЫЕ ЧАТЫ ==========

// Инициализация групповых чатов
function initGroupChats() {
    // Добавляем кнопку создания группы
    const chatHeader = document.querySelector('.chat-header');
    if (chatHeader && !document.getElementById('createGroupBtn')) {
        const createGroupBtn = document.createElement('button');
        createGroupBtn.id = 'createGroupBtn';
        createGroupBtn.className = 'chat-action-btn';
        createGroupBtn.innerHTML = '👥 Группа';
        createGroupBtn.title = 'Создать группу';
        createGroupBtn.addEventListener('click', createGroupChat);
        
        const actions = chatHeader.querySelector('.chat-header > div:last-child');
        if (actions) {
            actions.appendChild(createGroupBtn);
        }
    }
}

// Создание группового чата
function createGroupChat() {
    const groupName = prompt('Введите название группы:');
    if (!groupName) return;
    
    const groups = JSON.parse(localStorage.getItem('chat_groups') || '[]');
    const user = getCurrentUser();
    
    const group = {
        id: Date.now(),
        name: groupName,
        creator: user.username,
        members: [user.username],
        createdAt: new Date().toISOString()
    };
    
    groups.push(group);
    localStorage.setItem('chat_groups', JSON.stringify(groups));
    
    if (typeof showNotification === 'function') {
        showNotification(`Группа "${groupName}" создана`, 'success');
    }
    
    if (typeof addNotification === 'function') {
        addNotification('message', 'Группа создана', `Группа "${groupName}" успешно создана`);
    }
}

// Улучшенное отображение сообщений (переопределяет функцию из chat.js)
function displayEnhancedMessage(author, content, time, isSystem = false, type = 'text') {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const currentUser = getCurrentUser();
    const isMentioned = checkMentions(content, currentUser);
    const isOwnMessage = author === currentUser?.username;
    
    // Воспроизводим звук уведомления для новых сообщений (не своих)
    if (!isOwnMessage && !isSystem && typeof playNotificationSound === 'function') {
        if (isMentioned) {
            playNotificationSound('mention');
        } else {
            playNotificationSound('message');
        }
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    
    if (isOwnMessage) {
        messageDiv.classList.add('user-message');
    } else if (isSystem || author === 'System') {
        messageDiv.classList.add('system-message');
        if (typeof playNotificationSound === 'function') {
            playNotificationSound('system');
        }
    } else if (isMentioned) {
        messageDiv.classList.add('mentioned-message');
    }
    
    if (type === 'file') {
        messageDiv.classList.add('file-message');
    }
    
    // Обработка упоминаний в тексте
    let processedContent = escapeHtml(content);
    if (isMentioned && currentUser && currentUser.username) {
        processedContent = processedContent.replace(
            new RegExp(`@${currentUser.username}`, 'gi'),
            `<strong class="mention-highlight">@${currentUser.username}</strong>`
        );
    }
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-author">${escapeHtml(author)}</span>
            <span class="message-time">${time}</span>
        </div>
        <div class="message-content">${processedContent}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Анимация появления для новых сообщений
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(10px)';
    setTimeout(() => {
        messageDiv.style.transition = 'all 0.3s ease';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 10);
}

// Переопределяем функцию displayMessage из chat.js, если она существует
if (typeof displayMessage !== 'undefined') {
    window.displayMessage = displayEnhancedMessage;
} else {
    window.displayMessage = displayEnhancedMessage;
}

// Обновление счетчика онлайн
function updateOnlineCount() {
    const onlineCount = document.getElementById('onlineCount');
    if (onlineCount) {
        // Симуляция обновления
        setInterval(() => {
            const count = Math.floor(Math.random() * 50) + 10;
            onlineCount.textContent = count;
        }, 5000);
    }
}

// Проверка упоминаний в сообщении
function checkMentions(message, currentUser) {
    if (!currentUser || !currentUser.username) return false;
    const mentionPattern = new RegExp(`@${currentUser.username}`, 'i');
    return mentionPattern.test(message);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initEnhancedChat();
});

// Экспорт функций
window.toggleEmojiPicker = toggleEmojiPicker;
window.insertEmoji = insertEmoji;
window.addReaction = addReaction;
window.createGroupChat = createGroupChat;



