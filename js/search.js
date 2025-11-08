// Профессиональная система глобального поиска для DARKWEB

// Инициализация глобального поиска
function initGlobalSearch() {
    createSearchBar();
    loadSearchHistory();
}

// Создание поисковой строки
function createSearchBar() {
    // Добавляем поисковую строку в сайдбар
    const sidebar = document.querySelector('.sidebar');
    if (sidebar && !document.getElementById('globalSearchBar')) {
        const searchContainer = document.createElement('div');
        searchContainer.id = 'globalSearchBar';
        searchContainer.className = 'global-search-bar';
        searchContainer.innerHTML = `
            <div class="search-input-wrapper">
                <input type="text" 
                       id="globalSearchInput" 
                       class="search-input-field" 
                       placeholder="Поиск по сайту..." 
                       autocomplete="off">
                <span class="search-icon">🔍</span>
                <button class="search-clear-btn" id="searchClearBtn" style="display: none;">×</button>
            </div>
            <div class="search-results" id="searchResults" style="display: none;"></div>
        `;
        
        // Вставляем после quick-access
        const quickAccess = sidebar.querySelector('.sidebar-quick-access');
        if (quickAccess) {
            quickAccess.after(searchContainer);
        } else {
            const sidebarHeader = sidebar.querySelector('.sidebar-header');
            if (sidebarHeader) {
                sidebarHeader.after(searchContainer);
            }
        }
        
        // Обработчики событий
        const searchInput = document.getElementById('globalSearchInput');
        const searchResults = document.getElementById('searchResults');
        const clearBtn = document.getElementById('searchClearBtn');
        
        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            
            if (query.length === 0) {
                searchResults.style.display = 'none';
                clearBtn.style.display = 'none';
                showSearchSuggestions();
                return;
            }
            
            clearBtn.style.display = 'flex';
            
            // Показываем автозаполнение при первом символе
            if (query.length === 1) {
                showSearchAutocomplete(query);
            }
            
            // Задержка для оптимизации
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
        });
        
        searchInput.addEventListener('focus', () => {
            const query = searchInput.value.trim();
            if (query.length > 0) {
                searchResults.style.display = 'block';
            }
        });
        
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = searchInput.value.trim();
                if (query.length > 0) {
                    performFullSearch(query);
                }
            } else if (e.key === 'Escape') {
                searchResults.style.display = 'none';
                searchInput.blur();
            }
        });
        
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchResults.style.display = 'none';
            clearBtn.style.display = 'none';
            searchInput.focus();
        });
        
        // Закрытие при клике вне
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
}

// Выполнение поиска
function performSearch(query) {
    const results = searchAll(query);
    displaySearchResults(results, query);
    
    // Сохраняем в историю
    saveToSearchHistory(query);
}

// Поиск по всему сайту
function searchAll(query) {
    const lowerQuery = query.toLowerCase();
    const results = {
        pages: [],
        products: [],
        messages: [],
        users: [],
        activities: []
    };
    
    // Поиск по страницам
    const pages = [
        { name: 'Профиль', url: 'profile.html', icon: '👤', category: 'Страницы' },
        { name: 'Чат', url: 'chat.html', icon: '💬', category: 'Страницы' },
        { name: 'Маркетплейс', url: 'marketplace.html', icon: '🛒', category: 'Страницы' },
        { name: 'Группы', url: 'groups.html', icon: '🔗', category: 'Страницы' },
        { name: 'Форум', url: 'forum.html', icon: '💬', category: 'Страницы' },
        { name: 'Новости', url: 'news.html', icon: '📰', category: 'Страницы' },
        { name: 'Wiki', url: 'wiki.html', icon: '📚', category: 'Страницы' },
        { name: 'Настройки', url: 'settings.html', icon: '⚙️', category: 'Страницы' },
        { name: 'Взлом', url: 'hacking.html', icon: '⚡', category: 'Инструменты' },
        { name: 'Трояны', url: 'trojans.html', icon: '🐴', category: 'Платформы' },
        { name: 'Вирусы', url: 'viruses.html', icon: '🦠', category: 'Инструменты' }
    ];
    
    pages.forEach(page => {
        if (page.name.toLowerCase().includes(lowerQuery) || 
            page.category.toLowerCase().includes(lowerQuery)) {
            results.pages.push(page);
        }
    });
    
    // Поиск по товарам маркетплейса
    try {
        const products = JSON.parse(localStorage.getItem('marketplace_products') || '[]');
        products.forEach(product => {
            if ((product.title || product.name || '').toLowerCase().includes(lowerQuery) ||
                (product.description || '').toLowerCase().includes(lowerQuery) ||
                (product.category || '').toLowerCase().includes(lowerQuery)) {
                results.products.push(product);
            }
        });
    } catch (e) {
        // Игнорируем ошибки
    }
    
    // Поиск по сообщениям чата
    try {
        const messages = JSON.parse(localStorage.getItem('chat_messages') || '[]');
        messages.forEach(message => {
            if (message.text.toLowerCase().includes(lowerQuery) ||
                message.author.toLowerCase().includes(lowerQuery)) {
                results.messages.push(message);
            }
        });
    } catch (e) {
        // Игнорируем ошибки
    }
    
    // Поиск по активности
    try {
        const activities = JSON.parse(localStorage.getItem('user_activity') || '[]');
        activities.forEach(activity => {
            if (activity.text.toLowerCase().includes(lowerQuery) ||
                activity.type.toLowerCase().includes(lowerQuery)) {
                results.activities.push(activity);
            }
        });
    } catch (e) {
        // Игнорируем ошибки
    }
    
    return results;
}

// Отображение результатов поиска
function displaySearchResults(results, query) {
    const container = document.getElementById('searchResults');
    if (!container) return;
    
    const totalResults = results.pages.length + results.products.length + 
                        results.messages.length + results.activities.length;
    
    if (totalResults === 0) {
        container.innerHTML = `
            <div class="search-results-empty">
                <div class="search-empty-icon">🔍</div>
                <div class="search-empty-text">Ничего не найдено</div>
                <div class="search-empty-hint">Попробуйте другой запрос</div>
            </div>
        `;
        container.style.display = 'block';
        return;
    }
    
    let html = `<div class="search-results-header">Найдено: ${totalResults}</div>`;
    
    // Страницы
    if (results.pages.length > 0) {
        html += `
            <div class="search-results-section">
                <div class="search-section-title">Страницы (${results.pages.length})</div>
                ${results.pages.slice(0, 5).map(page => `
                    <a href="${page.url}" class="search-result-item">
                        <span class="search-result-icon">${page.icon}</span>
                        <div class="search-result-content">
                            <div class="search-result-title">${highlightQuery(page.name, query)}</div>
                            <div class="search-result-category">${page.category}</div>
                        </div>
                    </a>
                `).join('')}
            </div>
        `;
    }
    
    // Товары
    if (results.products.length > 0) {
        html += `
            <div class="search-results-section">
                <div class="search-section-title">Товары (${results.products.length})</div>
                ${results.products.slice(0, 5).map(product => `
                    <a href="marketplace.html" class="search-result-item">
                        <span class="search-result-icon">🛒</span>
                        <div class="search-result-content">
                            <div class="search-result-title">${highlightQuery(product.title || product.name || '', query)}</div>
                            <div class="search-result-category">${product.price || ''} ${product.price ? 'BTC' : ''}</div>
                        </div>
                    </a>
                `).join('')}
            </div>
        `;
    }
    
    // Сообщения
    if (results.messages.length > 0) {
        html += `
            <div class="search-results-section">
                <div class="search-section-title">Сообщения (${results.messages.length})</div>
                ${results.messages.slice(0, 5).map(message => `
                    <a href="chat.html" class="search-result-item">
                        <span class="search-result-icon">💬</span>
                        <div class="search-result-content">
                            <div class="search-result-title">${escapeHtml(message.author)}</div>
                            <div class="search-result-category">${highlightQuery(message.text.substring(0, 50), query)}...</div>
                        </div>
                    </a>
                `).join('')}
            </div>
        `;
    }
    
    // Активность
    if (results.activities.length > 0) {
        html += `
            <div class="search-results-section">
                <div class="search-section-title">Активность (${results.activities.length})</div>
                ${results.activities.slice(0, 5).map(activity => `
                    <a href="profile.html" class="search-result-item">
                        <span class="search-result-icon">📊</span>
                        <div class="search-result-content">
                            <div class="search-result-title">${highlightQuery(activity.text, query)}</div>
                            <div class="search-result-category">${formatTime(activity.time)}</div>
                        </div>
                    </a>
                `).join('')}
            </div>
        `;
    }
    
    // Кнопка "Показать все результаты"
    if (totalResults > 15) {
        html += `
            <div class="search-results-footer">
                <button class="search-show-all-btn" onclick="performFullSearch('${escapeHtml(query)}')">
                    Показать все результаты (${totalResults})
                </button>
            </div>
        `;
    }
    
    container.innerHTML = html;
    container.style.display = 'block';
}

// Полноценный поиск (открывает страницу результатов)
function performFullSearch(query) {
    // Сохраняем запрос для страницы результатов
    sessionStorage.setItem('search_query', query);
    window.location.href = 'html/search.html';
}

// Подсветка запроса в тексте
function highlightQuery(text, query) {
    if (!query) return escapeHtml(text);
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return escapeHtml(text).replace(regex, '<mark>$1</mark>');
}

// Экранирование для regex
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Сохранение в историю поиска
function saveToSearchHistory(query) {
    const history = JSON.parse(localStorage.getItem('search_history') || '[]');
    if (!history.includes(query) && query.length > 0) {
        history.unshift(query);
        if (history.length > 10) {
            history.pop();
        }
        localStorage.setItem('search_history', JSON.stringify(history));
    }
}

// Загрузка истории поиска
function loadSearchHistory() {
    const history = JSON.parse(localStorage.getItem('search_history') || '[]');
    return history;
}

// Показ автозаполнения
function showSearchAutocomplete(query) {
    const history = loadSearchHistory();
    const suggestions = history.filter(item => 
        item.toLowerCase().startsWith(query.toLowerCase())
    ).slice(0, 5);
    
    const container = document.getElementById('searchResults');
    if (!container) return;
    
    if (suggestions.length > 0) {
        container.innerHTML = `
            <div class="search-results-section">
                <div class="search-section-title">История поиска</div>
                ${suggestions.map(suggestion => `
                    <div class="search-result-item search-suggestion" onclick="useSearchSuggestion('${escapeHtml(suggestion)}')">
                        <span class="search-result-icon">🕒</span>
                        <div class="search-result-content">
                            <div class="search-result-title">${escapeHtml(suggestion)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        container.style.display = 'block';
    }
}

// Показ подсказок поиска
function showSearchSuggestions() {
    const container = document.getElementById('searchResults');
    if (!container) return;
    
    const suggestions = [
        { text: 'Поиск по товарам', icon: '🛒' },
        { text: 'Поиск по сообщениям', icon: '💬' },
        { text: 'Поиск по страницам', icon: '📄' },
        { text: 'Поиск по активности', icon: '📊' }
    ];
    
    container.innerHTML = `
        <div class="search-results-section">
            <div class="search-section-title">Популярные запросы</div>
            ${suggestions.map(suggestion => `
                <div class="search-result-item search-suggestion" onclick="useSearchSuggestion('${suggestion.text}')">
                    <span class="search-result-icon">${suggestion.icon}</span>
                    <div class="search-result-content">
                        <div class="search-result-title">${suggestion.text}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    container.style.display = 'block';
}

// Использование подсказки поиска
function useSearchSuggestion(suggestion) {
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
        searchInput.value = suggestion;
        performSearch(suggestion);
        searchInput.focus();
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Ждем загрузки сайдбара
    setTimeout(() => {
        initGlobalSearch();
    }, 500);
});

// Экспорт функций
window.initGlobalSearch = initGlobalSearch;
window.performFullSearch = performFullSearch;
window.useSearchSuggestion = useSearchSuggestion;



