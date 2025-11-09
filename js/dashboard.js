// Профессиональный дашборд для DARKWEB

// Инициализация дашборда
function initDashboard() {
    loadStats();
    loadActivityWidget();
    loadMessagesWidget();
    loadPurchasesWidget();
    initReputationChart();
    initActivityChart();
    setupEventListeners();
}

// Загрузка статистики
function loadStats() {
    const user = getCurrentUser();
    
    // Репутация
    const reputation = user.reputation || 0;
    const reputationValue = document.getElementById('reputationValue');
    if (reputationValue) {
        reputationValue.textContent = reputation + '%';
    }
    const reputationProgress = document.getElementById('reputationProgress');
    if (reputationProgress) {
        reputationProgress.style.width = reputation + '%';
    }
    
    // Сообщения
    const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
    const userMessages = messages.filter(m => m.author === user.username);
    const todayMessages = userMessages.filter(m => {
        const msgDate = new Date(m.timestamp);
        const today = new Date();
        return msgDate.toDateString() === today.toDateString();
    });
    const messagesCount = document.getElementById('messagesCount');
    if (messagesCount) {
        messagesCount.textContent = userMessages.length;
    }
    const messagesCountParent = document.querySelector('#messagesCount')?.parentElement;
    const messagesChange = messagesCountParent?.querySelector('.stat-change');
    if (messagesChange) {
        messagesChange.textContent = `+${todayMessages.length} сегодня`;
    }
    
    // Покупки
    const purchases = JSON.parse(localStorage.getItem('user_purchases') || '[]');
    const todayPurchases = purchases.filter(p => {
        const purchaseDate = new Date(p.timestamp);
        const today = new Date();
        return purchaseDate.toDateString() === today.toDateString();
    });
    const purchasesCount = document.getElementById('purchasesCount');
    if (purchasesCount) {
        purchasesCount.textContent = purchases.length;
    }
    const purchasesCountParent = document.querySelector('#purchasesCount')?.parentElement;
    const purchasesChange = purchasesCountParent?.querySelector('.stat-change');
    if (purchasesChange) {
        purchasesChange.textContent = `+${todayPurchases.length} сегодня`;
    }
    
    // Достижения
    const achievements = JSON.parse(localStorage.getItem('user_achievements') || '[]');
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const achievementsCount = document.getElementById('achievementsCount');
    if (achievementsCount) {
        achievementsCount.textContent = unlockedCount;
    }
    const achievementsCountParent = document.querySelector('#achievementsCount')?.parentElement;
    const achievementsChange = achievementsCountParent?.querySelector('.stat-change');
    if (achievementsChange) {
        achievementsChange.textContent = `${unlockedCount}/10 разблокировано`;
    }
}

// Загрузка виджета активности
function loadActivityWidget() {
    const activities = JSON.parse(localStorage.getItem('user_activity') || '[]');
    const recentActivities = activities.slice(-5).reverse();
    const container = document.getElementById('activityWidget');
    
    if (!container) return;
    
    if (recentActivities.length === 0) {
        container.innerHTML = '<div class="widget-empty">Нет активности</div>';
        return;
    }
    
    container.innerHTML = recentActivities.map(activity => {
        const timeAgo = formatTime(activity.time);
        const icon = getActivityIcon(activity.type);
        
        return `
            <div class="activity-item">
                <div class="activity-icon">${icon}</div>
                <div class="activity-content">
                    <div class="activity-text">${escapeHtml(activity.text)}</div>
                    <div class="activity-time">${timeAgo}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Загрузка виджета сообщений
function loadMessagesWidget() {
    const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
    const recentMessages = messages.slice(-5).reverse();
    const container = document.getElementById('messagesWidget');
    
    if (!container) return;
    
    if (recentMessages.length === 0) {
        container.innerHTML = '<div class="widget-empty">Нет сообщений</div>';
        return;
    }
    
    container.innerHTML = recentMessages.map(message => {
        const timeAgo = formatTime(message.timestamp);
        
        return `
            <div class="message-item">
                <div class="message-icon">💬</div>
                <div class="message-content">
                    <div class="message-text">
                        <strong>${escapeHtml(message.author)}</strong>: ${escapeHtml(message.text.substring(0, 50))}${message.text.length > 50 ? '...' : ''}
                    </div>
                    <div class="message-time">${timeAgo}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Получение иконки активности
function getActivityIcon(type) {
    const icons = {
        'login': '🔐',
        'logout': '🚪',
        'profile': '👤',
        'chat': '💬',
        'purchase': '🛒',
        'achievement': '⭐',
        'settings': '⚙️'
    };
    return icons[type] || '📊';
}

// Инициализация графика репутации
function initReputationChart() {
    const canvas = document.getElementById('reputationChart');
    if (!canvas) return;
    
    // Устанавливаем правильный размер canvas
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    
    const ctx = canvas.getContext('2d');
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const period = parseInt(document.getElementById('reputationPeriod')?.value || '30');
    
    // Генерируем данные (в реальности брать из localStorage)
    const data = generateReputationData(period);
    drawReputationChart(ctx, canvas, data);
    
    // Обновляем при изменении размера окна
    window.addEventListener('resize', () => {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        const ctx = canvas.getContext('2d');
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        drawReputationChart(ctx, canvas, data);
    });
}

// Генерация данных репутации
function generateReputationData(days) {
    const data = [];
    const user = getCurrentUser();
    const baseReputation = user.reputation || 0;
    
    for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        data.push({
            date: date,
            value: baseReputation + Math.random() * 20 - 10 // Симуляция изменений
        });
    }
    
    return data;
}

// Отрисовка графика репутации
function drawReputationChart(ctx, canvas, data) {
    // Используем реальный размер canvas с учетом devicePixelRatio
    const scale = window.devicePixelRatio || 1;
    const width = canvas.width / scale;
    const height = canvas.height / scale;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // Очистка
    ctx.clearRect(0, 0, width, height);
    
    // Фон градиент
    const bgGradient = ctx.createLinearGradient(padding, padding, padding + chartWidth, padding + chartHeight);
    bgGradient.addColorStop(0, 'rgba(0, 255, 255, 0.05)');
    bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(padding, padding, chartWidth, chartHeight);
    
    // Сетка
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();
    }
    
    // Вертикальные линии сетки
    for (let i = 0; i <= 10; i++) {
        const x = padding + (chartWidth / 10) * i;
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, padding + chartHeight);
        ctx.stroke();
    }
    
    // График
    if (data.length > 0) {
        const maxValue = Math.max(...data.map(d => d.value), 100);
        const minValue = Math.min(...data.map(d => d.value), 0);
        const range = maxValue - minValue || 1;
        
        // Градиент для линии
        const lineGradient = ctx.createLinearGradient(padding, padding, padding, padding + chartHeight);
        lineGradient.addColorStop(0, '#00ffff');
        lineGradient.addColorStop(1, '#0088ff');
        
        // Область под графиком
        ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.moveTo(padding, padding + chartHeight);
        
        data.forEach((point, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - ((point.value - minValue) / range) * chartHeight;
            ctx.lineTo(x, y);
        });
        
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.closePath();
        ctx.fill();
        
        // Линия графика
        ctx.strokeStyle = lineGradient;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        
        data.forEach((point, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - ((point.value - minValue) / range) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Точки
        ctx.fillStyle = '#00ffff';
        data.forEach((point, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - ((point.value - minValue) / range) * chartHeight;
            
            // Внешний круг
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
            ctx.fill();
            
            // Внутренний круг
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#00ffff';
            ctx.fill();
        });
    }
    
    // Подписи осей
    ctx.fillStyle = '#00ffff';
    ctx.font = '11px JetBrains Mono';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    // Y-ось (проценты)
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        const value = minValue + (maxValue - minValue) * (1 - i / 5);
        ctx.fillText(Math.round(value) + '%', padding - 10, y);
    }
    
    // X-ось (даты)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    if (data.length > 0) {
        const step = Math.max(1, Math.floor(data.length / 5));
        for (let i = 0; i < data.length; i += step) {
            const x = padding + (chartWidth / (data.length - 1)) * i;
            const date = new Date(data[i].date);
            const dateStr = `${date.getDate()}.${date.getMonth() + 1}`;
            ctx.fillText(dateStr, x, padding + chartHeight + 5);
        }
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Обновление дашборда
    const refreshBtn = document.getElementById('refreshDashboard');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            initDashboard();
            if (typeof showNotification === 'function') {
                showNotification('Дашборд обновлен', 'success');
            }
        });
    }
    
    // Экспорт данных
    const exportBtn = document.getElementById('exportData');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportDashboardData);
    }
    
    // Период репутации
    const reputationPeriod = document.getElementById('reputationPeriod');
    if (reputationPeriod) {
        reputationPeriod.addEventListener('change', () => {
            initReputationChart();
        });
    }
    
    // Просмотр всей активности
    const viewAllActivity = document.getElementById('viewAllActivity');
    if (viewAllActivity) {
        viewAllActivity.addEventListener('click', () => {
            window.location.href = 'profile.html';
        });
    }
    
    // Просмотр всех сообщений
    const viewAllMessages = document.getElementById('viewAllMessages');
    if (viewAllMessages) {
        viewAllMessages.addEventListener('click', () => {
            window.location.href = 'chat.html';
        });
    }
    
    // Период активности
    const activityPeriod = document.getElementById('activityPeriod');
    if (activityPeriod) {
        activityPeriod.addEventListener('change', () => {
            initActivityChart();
        });
    }
    
    // Просмотр всех покупок
    const viewAllPurchases = document.getElementById('viewAllPurchases');
    if (viewAllPurchases) {
        viewAllPurchases.addEventListener('click', () => {
            window.location.href = 'marketplace.html';
        });
    }
}

// Загрузка виджета покупок
function loadPurchasesWidget() {
    const purchases = JSON.parse(localStorage.getItem('user_purchases') || '[]');
    const user = getCurrentUser();
    const userPurchases = purchases.filter(p => p.buyer === user.username).slice(-5).reverse();
    const container = document.getElementById('purchasesWidget');
    
    if (!container) return;
    
    if (userPurchases.length === 0) {
        container.innerHTML = '<div class="widget-empty">Нет покупок</div>';
        return;
    }
    
    container.innerHTML = userPurchases.map(purchase => {
        const timeAgo = formatTime(purchase.timestamp);
        
        return `
            <div class="purchase-item">
                <div class="purchase-icon">🛒</div>
                <div class="purchase-content">
                    <div class="purchase-text">
                        <strong>${escapeHtml(purchase.productTitle)}</strong> - ${escapeHtml(purchase.price)}
                    </div>
                    <div class="purchase-time">${timeAgo}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Инициализация графика активности
function initActivityChart() {
    const canvas = document.getElementById('activityChart');
    if (!canvas) return;
    
    // Устанавливаем правильный размер canvas
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    
    const ctx = canvas.getContext('2d');
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const period = parseInt(document.getElementById('activityPeriod')?.value || '30');
    const data = generateActivityData(period);
    drawActivityChart(ctx, canvas, data);
}

// Генерация данных активности
function generateActivityData(days) {
    const activities = JSON.parse(localStorage.getItem('user_activity') || '[]');
    const data = [];
    
    for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const dayActivities = activities.filter(a => {
            const activityDate = new Date(a.time);
            activityDate.setHours(0, 0, 0, 0);
            return activityDate.getTime() === date.getTime();
        });
        
        data.push({
            date: date,
            count: dayActivities.length
        });
    }
    
    return data;
}

// Отрисовка графика активности
function drawActivityChart(ctx, canvas, data) {
    const scale = window.devicePixelRatio || 1;
    const width = canvas.width / scale;
    const height = canvas.height / scale;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    ctx.clearRect(0, 0, width, height);
    
    // Фон
    const bgGradient = ctx.createLinearGradient(padding, padding, padding + chartWidth, padding + chartHeight);
    bgGradient.addColorStop(0, 'rgba(0, 255, 136, 0.05)');
    bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(padding, padding, chartWidth, chartHeight);
    
    // Сетка
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();
    }
    
    if (data.length > 0) {
        const maxValue = Math.max(...data.map(d => d.count), 10);
        
        // Столбчатая диаграмма
        const barWidth = chartWidth / data.length * 0.8;
        const barSpacing = chartWidth / data.length * 0.2;
        
        data.forEach((point, index) => {
            const x = padding + (chartWidth / data.length) * index + barSpacing / 2;
            const barHeight = (point.count / maxValue) * chartHeight;
            const y = padding + chartHeight - barHeight;
            
            // Градиент для столбца
            const barGradient = ctx.createLinearGradient(x, y, x, padding + chartHeight);
            barGradient.addColorStop(0, 'rgba(0, 255, 136, 0.8)');
            barGradient.addColorStop(1, 'rgba(0, 255, 136, 0.3)');
            
            ctx.fillStyle = barGradient;
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // Обводка
            ctx.strokeStyle = 'rgba(0, 255, 136, 0.5)';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, barWidth, barHeight);
            
            // Значение на столбце
            if (point.count > 0) {
                ctx.fillStyle = '#00ff88';
                ctx.font = '10px JetBrains Mono';
                ctx.textAlign = 'center';
                ctx.fillText(point.count.toString(), x + barWidth / 2, y - 5);
            }
        });
    }
    
    // Подписи
    ctx.fillStyle = '#00ff88';
    ctx.font = '11px JetBrains Mono';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    if (data.length > 0) {
        const step = Math.max(1, Math.floor(data.length / 5));
        for (let i = 0; i < data.length; i += step) {
            const x = padding + (chartWidth / data.length) * i + (chartWidth / data.length) / 2;
            const date = new Date(data[i].date);
            const dateStr = `${date.getDate()}.${date.getMonth() + 1}`;
            ctx.fillText(dateStr, x, padding + chartHeight + 5);
        }
    }
}

// Экспорт данных дашборда
function exportDashboardData() {
    const user = getCurrentUser();
    const activities = JSON.parse(localStorage.getItem('user_activity') || '[]');
    const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
    const purchases = JSON.parse(localStorage.getItem('user_purchases') || '[]');
    
    const data = {
        user: user,
        stats: {
            reputation: user.reputation || 0,
            messagesCount: messages.filter(m => m.author === user.username).length,
            purchasesCount: purchases.length,
            activitiesCount: activities.length
        },
        activities: activities,
        messages: messages.filter(m => m.author === user.username),
        purchases: purchases,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `darkweb_dashboard_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    if (typeof showNotification === 'function') {
        showNotification('Данные экспортированы', 'success');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

// Экспорт функций
window.initDashboard = initDashboard;
window.exportDashboardData = exportDashboardData;



