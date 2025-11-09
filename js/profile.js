// Profile page functionality - Hacker Terminal Style
document.addEventListener('DOMContentLoaded', () => {
    // Загрузка данных пользователя
    loadUserProfile();
    
    // Загрузка ASCII арта
    loadAsciiArt();
    
    // Инициализация статистики
    loadStatistics();
    loadHackerStats();
    
    // Загрузка системных логов
    loadSystemLogs();
    
    // Навигация
    initializeNavigation();
    
    // Редактирование профиля
    initializeEditProfile();
    
    // Очистка логов
    initializeClearLogs();
    
    // Обновление системной информации
    updateSystemInfo();
    setInterval(updateSystemInfo, 60000); // Каждую минуту
    
    // Анимация терминала
    startTerminalAnimation();
});

// Загрузка профиля пользователя
function loadUserProfile() {
    const user = JSON.parse(localStorage.getItem('darknet_user') || '{}');
    
    if (!user.username) {
        // Если пользователь не залогинен, перенаправляем на регистрацию
        window.location.href = 'register.html';
        return;
    }
    
    // Заполняем данные профиля в терминале
    const terminalUsername = document.getElementById('terminalUsername');
    if (terminalUsername) {
        terminalUsername.textContent = user.username || 'user';
    }
    
    // Генерируем IP адрес (псевдо-случайный для безопасности)
    generateIPAddress();
}

// Генерация IP адреса
function generateIPAddress() {
    const userIP = document.getElementById('userIP');
    if (userIP) {
        // Генерируем псевдо-случайный IP для демонстрации
        const storedIP = localStorage.getItem('user_ip_address');
        if (storedIP) {
            userIP.textContent = storedIP;
        } else {
            // Генерируем случайный IP в формате 192.168.x.x
            const ip = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
            localStorage.setItem('user_ip_address', ip);
            userIP.textContent = ip;
        }
    }
}

// Обновление системной информации
function updateSystemInfo() {
    // Обновляем время последнего входа
    const lastLogin = document.getElementById('lastLogin');
    if (lastLogin) {
        const activities = JSON.parse(localStorage.getItem('user_activity') || '[]');
        if (activities.length > 0) {
            const lastActivity = activities[activities.length - 1];
            const time = formatTime(lastActivity.time);
            lastLogin.textContent = time + ' ago';
        } else {
            lastLogin.textContent = 'Just now';
        }
    }
    
    // Обновляем uptime (симуляция)
    const systemUptime = document.getElementById('systemUptime');
    if (systemUptime) {
        const storedUptime = localStorage.getItem('system_uptime');
        if (storedUptime) {
            systemUptime.textContent = storedUptime;
        } else {
            // Генерируем случайное время работы
            const days = Math.floor(Math.random() * 365);
            const hours = Math.floor(Math.random() * 24);
            const minutes = Math.floor(Math.random() * 60);
            const uptime = `${days}d ${hours}h ${minutes}m`;
            localStorage.setItem('system_uptime', uptime);
            systemUptime.textContent = uptime;
        }
    }
}

// Загрузка статистики
function loadStatistics() {
    // Сообщения из чата
    const messages = JSON.parse(localStorage.getItem('darkweb_chat_messages') || '[]');
    const userMessages = messages.filter(msg => {
        const user = JSON.parse(localStorage.getItem('darknet_user') || '{}');
        return msg.author === user.username;
    }).length;
    
    // Покупки
    const purchases = JSON.parse(localStorage.getItem('darkweb_purchases') || '[]');
    const userPurchases = purchases.filter(p => {
        const user = JSON.parse(localStorage.getItem('darknet_user') || '{}');
        return p.buyer === user.username;
    }).length;
    
    // Репутация уже загружена в loadUserProfile
}

// Загрузка хакерской статистики
function loadHackerStats() {
    // Получаем или создаем хакерскую статистику
    let hackerStats = JSON.parse(localStorage.getItem('hacker_stats') || '{}');
    
    // Инициализируем значения, если их нет
    if (!hackerStats.exploits) hackerStats.exploits = Math.floor(Math.random() * 100) + 10;
    if (!hackerStats.servers) hackerStats.servers = Math.floor(Math.random() * 50) + 5;
    if (!hackerStats.databases) hackerStats.databases = Math.floor(Math.random() * 30) + 3;
    if (!hackerStats.zeroDays) hackerStats.zeroDays = Math.floor(Math.random() * 5) + 1;
    
    localStorage.setItem('hacker_stats', JSON.stringify(hackerStats));
    
    // Обновляем отображение
    updateHackerStat('statExploits', 'exploitsBar', hackerStats.exploits, 200);
    updateHackerStat('statServers', 'serversBar', hackerStats.servers, 100);
    updateHackerStat('statDatabases', 'databasesBar', hackerStats.databases, 50);
    updateHackerStat('statZeroDays', 'zeroDaysBar', hackerStats.zeroDays, 10);
}

// Обновление хакерской статистики
function updateHackerStat(statId, barId, value, max) {
    const statElement = document.getElementById(statId);
    const barElement = document.getElementById(barId);
    
    if (statElement) {
        statElement.textContent = value;
    }
    
    if (barElement) {
        const percentage = Math.min((value / max) * 100, 100);
        barElement.style.width = percentage + '%';
        
        // Анимация заполнения
        setTimeout(() => {
            barElement.style.transition = 'width 1s ease';
        }, 100);
    }
}

// Загрузка системных логов
function loadSystemLogs() {
    const systemLogs = document.getElementById('systemLogs');
    if (!systemLogs) return;
    
    // Получаем логи из localStorage или создаем начальные
    let logs = JSON.parse(localStorage.getItem('system_logs') || '[]');
    
    // Получаем имя пользователя (может быть изменено в настройках)
    const userAscii = localStorage.getItem('user_ascii_name') || 'ERRORoX';
    const user = JSON.parse(localStorage.getItem('darknet_user') || '{}');
    
    // Если логов нет, создаем начальные
    if (logs.length === 0) {
        logs = [
            {
                time: new Date().toISOString(),
                level: 'info',
                message: `Система инициализирована. Добро пожаловать, ${userAscii}.`
            },
            {
                time: new Date().toISOString(),
                level: 'success',
                message: 'VPN соединение установлено. IP: ' + (localStorage.getItem('user_ip_address') || '192.168.1.xxx')
            },
            {
                time: new Date().toISOString(),
                level: 'warning',
                message: 'Обнаружено множество попыток входа с неизвестного IP.'
            },
            {
                time: new Date().toISOString(),
                level: 'info',
                message: 'Протоколы безопасности активированы. Все системы защищены.'
            }
        ];
        localStorage.setItem('system_logs', JSON.stringify(logs));
    }
    
    // Отображаем логи
    displayLogs(logs);
}

// Отображение логов
function displayLogs(logs) {
    const systemLogs = document.getElementById('systemLogs');
    if (!systemLogs) return;
    
    systemLogs.innerHTML = '';
    
    // Переводы уровней логов
    const levelTranslations = {
        'info': 'ИНФО',
        'success': 'УСПЕХ',
        'warning': 'ПРЕДУПРЕЖДЕНИЕ',
        'error': 'ОШИБКА'
    };
    
    // Показываем последние 20 логов
    logs.slice(-20).reverse().forEach(log => {
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry log-${log.level}`;
        
        const time = new Date(log.time);
        const timeStr = time.toISOString().replace('T', ' ').substring(0, 19);
        const levelText = levelTranslations[log.level] || log.level.toUpperCase();
        
        logEntry.innerHTML = `
            <span class="log-time">[${timeStr}]</span>
            <span class="log-level">[${levelText}]</span>
            <span class="log-message">${escapeHtml(log.message)}</span>
        `;
        
        systemLogs.appendChild(logEntry);
    });
    
    // Прокрутка вниз
    systemLogs.scrollTop = systemLogs.scrollHeight;
}

// Добавление нового лога
function addSystemLog(level, message) {
    const logs = JSON.parse(localStorage.getItem('system_logs') || '[]');
    logs.push({
        time: new Date().toISOString(),
        level: level,
        message: message
    });
    
    // Ограничиваем количество логов до 100
    if (logs.length > 100) {
        logs.shift();
    }
    
    localStorage.setItem('system_logs', JSON.stringify(logs));
    loadSystemLogs();
}

// Загрузка ASCII арта из настроек
function loadAsciiArt() {
    const asciiArt = document.getElementById('asciiArt');
    if (!asciiArt) return;
    
    const userAscii = localStorage.getItem('user_ascii_name') || 'ERRORoX';
    
    // Создаем новый ASCII арт с именем пользователя
    const newAsciiArt = createCustomAsciiArt(userAscii);
    asciiArt.textContent = newAsciiArt;
}

// Создание кастомного ASCII арта
function createCustomAsciiArt(name) {
    // Простой ASCII арт для имени
    const nameUpper = name.toUpperCase() || 'ERRORoX';
    const border = '═'.repeat(55);
    
    // Вычисляем отступ для имени (центрирование)
    const namePadding = Math.max(0, Math.floor((55 - nameUpper.length) / 2));
    
    // Вычисляем отступ для системной информации
    const systemInfo = 'SYSTEM PROFILE v2.4.7 - [ACCESS GRANTED]';
    const systemPadding = Math.max(0, Math.floor((55 - systemInfo.length) / 2));
    
    return `╔${border}╗
║${' '.repeat(55)}║
║${' '.repeat(namePadding)}${nameUpper}${' '.repeat(55 - namePadding - nameUpper.length)}║
║${' '.repeat(55)}║
║${' '.repeat(systemPadding)}${systemInfo}${' '.repeat(55 - systemPadding - systemInfo.length)}║
║${' '.repeat(55)}║
╚${border}╝`;
}

// Инициализация очистки логов
function initializeClearLogs() {
    const clearLogsBtn = document.getElementById('clearLogsBtn');
    
    if (clearLogsBtn) {
        clearLogsBtn.addEventListener('click', () => {
            if (confirm('Очистить все системные логи? Это действие нельзя отменить.')) {
                localStorage.setItem('system_logs', JSON.stringify([]));
                loadSystemLogs();
                addSystemLog('info', 'Системные логи очищены пользователем.');
            }
        });
    }
}

// Инициализация навигации
function initializeNavigation() {
    // Навигация теперь обрабатывается через сайдбар
}

// Инициализация редактирования профиля
function initializeEditProfile() {
    const modal = document.getElementById('editProfileModal');
    const closeBtn = document.getElementById('closeEditModal');
    const form = document.getElementById('editProfileForm');
    
    // Модальное окно скрыто по умолчанию, можно открыть через консоль команду
    // или добавить кнопку редактирования
    
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // Закрытие по клику вне модального окна
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Обработка формы
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const user = JSON.parse(localStorage.getItem('darknet_user') || '{}');
            
            const editUsername = document.getElementById('editUsername');
            const editEmail = document.getElementById('editEmail');
            const editRank = document.getElementById('editRank');
            
            if (editUsername) user.username = editUsername.value;
            if (editEmail) user.email = editEmail.value;
            if (editRank) user.rank = editRank.value;
            
            // Сохраняем ASCII арт имя, если указано
            const asciiArtInput = document.getElementById('editAsciiArt');
            if (asciiArtInput) {
                const asciiName = asciiArtInput.value.trim() || 'ERRORoX';
                localStorage.setItem('user_ascii_name', asciiName);
                loadAsciiArt();
            }
            
            // Обновляем всех пользователей
            const allUsers = JSON.parse(localStorage.getItem('darknet_users') || '[]');
            const userIndex = allUsers.findIndex(u => u.id === user.id);
            if (userIndex !== -1) {
                allUsers[userIndex].username = user.username;
                allUsers[userIndex].email = user.email;
                allUsers[userIndex].rank = user.rank;
                localStorage.setItem('darknet_users', JSON.stringify(allUsers));
            }
            
            localStorage.setItem('darknet_user', JSON.stringify(user));
            
            // Обновляем отображение
            loadUserProfile();
            
            // Добавляем активность и лог
            addActivity('profile', 'Профиль обновлен');
            addSystemLog('info', 'Профиль пользователя успешно обновлен.');
            
            // Закрываем модальное окно
            modal.style.display = 'none';
            
            // Показываем уведомление
            showNotification('Профиль успешно обновлен', 'success');
        });
    }
}

// Анимация терминала
function startTerminalAnimation() {
    // Анимация курсора
    const cursor = document.querySelector('.terminal-cursor');
    if (cursor) {
        // Курсор уже анимируется через CSS
    }
    
    // Периодическое обновление системных логов
    setInterval(() => {
        // Можно добавить автоматические логи (например, каждые 5 минут)
    }, 300000); // 5 минут
}

// Добавление кнопки редактирования профиля (скрытая в терминале, можно добавить через консоль)
function addEditButton() {
    // Можно добавить кнопку редактирования в терминале
    const terminalHeader = document.querySelector('.terminal-header');
    if (terminalHeader && !document.getElementById('editProfileBtnTerminal')) {
        const editBtn = document.createElement('button');
        editBtn.id = 'editProfileBtnTerminal';
        editBtn.className = 'terminal-edit-btn';
        editBtn.textContent = 'EDIT';
        editBtn.style.cssText = 'background: transparent; border: 1px solid #00ff41; color: #00ff41; padding: 5px 15px; margin-left: 10px; cursor: pointer; font-family: "JetBrains Mono", monospace; font-size: 11px;';
        editBtn.addEventListener('click', () => {
            const modal = document.getElementById('editProfileModal');
            if (modal) {
                const user = JSON.parse(localStorage.getItem('darknet_user') || '{}');
                const editUsername = document.getElementById('editUsername');
                const editEmail = document.getElementById('editEmail');
                const editRank = document.getElementById('editRank');
                const editAsciiArt = document.getElementById('editAsciiArt');
                
                if (editUsername) editUsername.value = user.username || '';
                if (editEmail) editEmail.value = user.email || '';
                if (editRank) editRank.value = user.rank || 'НОВИЧОК';
                if (editAsciiArt) {
                    const asciiName = localStorage.getItem('user_ascii_name') || 'ERRORoX';
                    editAsciiArt.value = asciiName;
                }
                modal.style.display = 'flex';
            }
        });
        terminalHeader.appendChild(editBtn);
    }
}

// Инициализация при загрузке страницы
addActivity('login', 'Вход в систему выполнен успешно');
addSystemLog('success', 'Аутентификация пользователя прошла успешно. Доступ предоставлен.');

// Добавляем кнопку редактирования после загрузки
setTimeout(() => {
    addEditButton();
}, 500);

// Интерактивный терминал
function initInteractiveTerminal() {
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');
    const clearTerminalBtn = document.getElementById('clearTerminalBtn');
    
    if (!terminalInput || !terminalOutput) return;
    
    // История команд
    let commandHistory = JSON.parse(localStorage.getItem('terminal_history') || '[]');
    let historyIndex = -1;
    
    // Команды терминала
    const commands = {
        'help': () => {
            return `Available commands:
  help              - Show this help message
  clear             - Clear terminal output
  whoami            - Show current user
  ls                - List files
  pwd               - Show current directory
  date              - Show current date and time
  uptime            - Show system uptime
  stats             - Show hacker statistics
  edit              - Edit profile
  exit              - Exit terminal`;
        },
        'clear': () => {
            terminalOutput.innerHTML = '';
            return '';
        },
        'whoami': () => {
            const user = JSON.parse(localStorage.getItem('darknet_user') || '{}');
            return user.username || 'anonymous';
        },
        'ls': () => {
            return `total 48
drwxr-xr-x  2 root root 4096 Jan 15 14:23 exploits/
drwxr-xr-x  2 root root 4096 Jan 15 14:23 scripts/
drwxr-xr-x  2 root root 4096 Jan 15 14:23 tools/
-rw-r--r--  1 root root 2048 Jan 15 14:23 config.txt
-rw-r--r--  1 root root 1024 Jan 15 14:23 keys.txt`;
        },
        'pwd': () => {
            return '/home/darkuser';
        },
        'date': () => {
            return new Date().toLocaleString('ru-RU');
        },
        'uptime': () => {
            const uptime = localStorage.getItem('system_uptime') || '0d 0h 0m';
            return `System uptime: ${uptime}`;
        },
        'stats': () => {
            const stats = JSON.parse(localStorage.getItem('hacker_stats') || '{}');
            return `Hacker Statistics:
  Exploits: ${stats.exploits || 0}
  Servers: ${stats.servers || 0}
  Databases: ${stats.databases || 0}
  Zero-Days: ${stats.zeroDays || 0}`;
        },
        'edit': () => {
            const modal = document.getElementById('editProfileModal');
            if (modal) {
                const user = JSON.parse(localStorage.getItem('darknet_user') || '{}');
                const editUsername = document.getElementById('editUsername');
                const editEmail = document.getElementById('editEmail');
                const editRank = document.getElementById('editRank');
                const editAsciiArt = document.getElementById('editAsciiArt');
                
                if (editUsername) editUsername.value = user.username || '';
                if (editEmail) editEmail.value = user.email || '';
                if (editRank) editRank.value = user.rank || 'НОВИЧОК';
                if (editAsciiArt) {
                    const asciiName = localStorage.getItem('user_ascii_name') || 'ERRORoX';
                    editAsciiArt.value = asciiName;
                }
                modal.style.display = 'flex';
            }
            return 'Profile edit modal opened';
        },
        'exit': () => {
            return 'Terminal closed';
        }
    };
    
    // Обработка ввода команды
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = terminalInput.value.trim();
            if (command === '') return;
            
            // Добавляем команду в историю
            commandHistory.push(command);
            if (commandHistory.length > 50) commandHistory.shift();
            localStorage.setItem('terminal_history', JSON.stringify(commandHistory));
            historyIndex = -1;
            
            // Отображаем команду
            const commandLine = document.createElement('div');
            commandLine.className = 'terminal-output-line';
            commandLine.innerHTML = `<span class="prompt">root@darkweb:~$</span> <span class="command">${escapeHtml(command)}</span>`;
            terminalOutput.appendChild(commandLine);
            
            // Выполняем команду
            const cmd = command.split(' ')[0];
            const args = command.split(' ').slice(1).join(' ');
            let output = '';
            
            if (commands[cmd]) {
                output = commands[cmd](args);
            } else {
                output = `Command not found: ${cmd}. Type 'help' for available commands.`;
            }
            
            if (output) {
                const outputLine = document.createElement('div');
                outputLine.className = 'terminal-output-line';
                outputLine.innerHTML = `<span class="output">${escapeHtml(output)}</span>`;
                terminalOutput.appendChild(outputLine);
            }
            
            // Очищаем ввод
            terminalInput.value = '';
            
            // Прокрутка вниз
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
            
            // Добавляем логи
            addSystemLog('info', `Command executed: ${command}`);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                if (historyIndex === -1) {
                    historyIndex = commandHistory.length - 1;
                } else if (historyIndex > 0) {
                    historyIndex--;
                }
                terminalInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex !== -1) {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = commandHistory[historyIndex];
                } else {
                    historyIndex = -1;
                    terminalInput.value = '';
                }
            }
        }
    });
    
    // Очистка терминала
    if (clearTerminalBtn) {
        clearTerminalBtn.addEventListener('click', () => {
            terminalOutput.innerHTML = '';
            addSystemLog('info', 'Terminal cleared');
        });
    }
    
    // Начальное сообщение
    const welcomeMsg = document.createElement('div');
    welcomeMsg.className = 'terminal-output-line';
    welcomeMsg.innerHTML = `<span class="output">Welcome to DARKWEB Terminal. Type 'help' for available commands.</span>`;
    terminalOutput.appendChild(welcomeMsg);
}


