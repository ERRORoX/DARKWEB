// Функция загрузки сайдбара из отдельного файла
async function loadSidebar(activePage = '') {
    // Проверяем, существует ли уже сайдбар на странице
    const existingSidebar = document.querySelector('.sidebar');
    if (existingSidebar) {
        console.log('Сайдбар уже загружен на странице');
        // Просто обновляем активную страницу
        if (activePage) {
            const allLinks = existingSidebar.querySelectorAll('.nav-link, .quick-link');
            allLinks.forEach(link => link.classList.remove('active'));
            const activeLink = existingSidebar.querySelector(`[data-page="${activePage}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
        initSidebar();
        return;
    }
    
    // Пытаемся загрузить сайдбар из файла
    try {
        // Определяем путь к sidebar.html в зависимости от текущего расположения
        let sidebarPath = 'html/sidebar.html';
        const currentPath = window.location.pathname;
        if (currentPath.includes('/html/')) {
            sidebarPath = 'sidebar.html';
        }
        
        console.log('Загрузка сайдбара из:', sidebarPath);
        
        // Пробуем загрузить через fetch
        const response = await fetch(sidebarPath);
        if (!response.ok) {
            throw new Error(`Не удалось загрузить сайдбар: ${response.status} ${response.statusText}`);
        }
        const sidebarHTML = await response.text();
        
        if (!sidebarHTML || sidebarHTML.trim().length === 0) {
            throw new Error('Получен пустой HTML для сайдбара');
        }
        
        console.log('Сайдбар загружен из файла, размер:', sidebarHTML.length, 'символов');
        
        // Создаем контейнер для сайдбара
        const sidebarContainer = document.createElement('div');
        sidebarContainer.innerHTML = sidebarHTML;
        const sidebar = sidebarContainer.querySelector('.sidebar');
        
        if (!sidebar) {
            throw new Error('Сайдбар не найден в загруженном HTML');
        }
        
        // Устанавливаем активную страницу
        if (activePage) {
            const activeLink = sidebar.querySelector(`[data-page="${activePage}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
        
        // Вставляем сайдбар
        insertSidebar(sidebar);
        
        // Инициализируем сайдбар
        initSidebar();
        
        // Инициализируем анимацию паука после небольшой задержки
        setTimeout(() => {
            if (typeof initSidebarSpiderAnimation === 'function') {
                initSidebarSpiderAnimation();
            }
        }, 100);
        
        console.log('Сайдбар успешно загружен из файла');
    } catch (error) {
        console.warn('Ошибка загрузки сайдбара из файла:', error.message);
        console.log('Используется встроенный сайдбар');
        // Fallback - создаем полный сайдбар встроенный
        createFallbackSidebar(activePage);
    }
}

// Функция вставки сайдбара в DOM
function insertSidebar(sidebar) {
    // Ищем контейнер страницы
    const container = document.querySelector('.page-container') || 
                     document.querySelector('.profile-container') || 
                     document.querySelector('.register-page-wrapper');
    
    if (container) {
        // Для register-page-wrapper вставляем в начало
        if (container.classList.contains('register-page-wrapper')) {
            container.insertBefore(sidebar, container.firstChild);
        } else {
            // Для других страниц вставляем перед основным контентом
            const firstChild = container.querySelector('main') || container.querySelector('.main-content');
            if (firstChild) {
                container.insertBefore(sidebar, firstChild);
            } else {
                container.insertBefore(sidebar, container.firstChild);
            }
        }
    } else {
        // Если контейнер не найден, вставляем в body
        const bodyFirstChild = document.body.querySelector('.sidebar-toggle-btn');
        if (bodyFirstChild && bodyFirstChild.nextSibling) {
            document.body.insertBefore(sidebar, bodyFirstChild.nextSibling);
        } else {
            document.body.insertBefore(sidebar, document.body.firstChild);
        }
    }
}

// Резервный сайдбар с полным содержимым, если не удалось загрузить файл
function createFallbackSidebar(activePage = '') {
    console.warn('Используется встроенный сайдбар. Проверьте путь к sidebar.html');
    
    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';
    
    // Новый HTML сайдбара (копия из sidebar.html)
    sidebar.innerHTML = `<!-- Sidebar Navigation -->
    <div class="sidebar-header">
        <div class="sidebar-brand">
            <div class="brand-logo">
                <img class="planet-img" src="../images/planet.png" alt="Planet" draggable="false">
                <div class="spider-container">
                    <div class="spider-swinger">
                        <div class="spider-thread"></div>
                        <img class="spider-img" src="../images/spider.png" alt="Spider" draggable="false">
                    </div>
                </div>
            </div>
            <div class="brand-title">
                <span class="brand-name">DARKWEB</span>
                <span class="brand-status">[ONLINE]</span>
            </div>
        </div>
    </div>
    
    <!-- Quick Access -->
    <div class="sidebar-quick-access">
        <a href="profile.html" class="quick-link" data-page="profile">
            <span class="quick-icon">👤</span>
            <span class="quick-text">Профиль</span>
        </a>
        <a href="chat.html" class="quick-link" data-page="chat">
            <span class="quick-icon">💬</span>
            <span class="quick-text">Чат</span>
        </a>
        <a href="marketplace.html" class="quick-link" data-page="marketplace">
            <span class="quick-icon">🛒</span>
            <span class="quick-text">Маркетплейс</span>
        </a>
    </div>
    
    <!-- Navigation Menu -->
    <nav class="nav-menu">
        <!-- Сообщество -->
        <div class="nav-section">
            <div class="section-header">
                <span class="section-icon">◢</span>
                <span class="section-title">Сообщество</span>
            </div>
            <ul class="nav-list">
                <li class="nav-item">
                    <a href="groups.html" class="nav-link" data-page="groups">
                        <span class="nav-icon">🔗</span>
                        <span class="nav-text">Группы</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="forum.html" class="nav-link" data-page="forum">
                        <span class="nav-icon">💬</span>
                        <span class="nav-text">Форум</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="news.html" class="nav-link" data-page="news">
                        <span class="nav-icon">📰</span>
                        <span class="nav-text">Новости</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="wiki.html" class="nav-link" data-page="wiki">
                        <span class="nav-icon">📚</span>
                        <span class="nav-text">Wiki</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="reputation.html" class="nav-link" data-page="reputation">
                        <span class="nav-icon">⭐</span>
                        <span class="nav-text">Репутация</span>
                    </a>
                </li>
            </ul>
        </div>
        
        <!-- Платформы -->
        <div class="nav-section">
            <div class="section-header">
                <span class="section-icon">◢</span>
                <span class="section-title">Платформы</span>
            </div>
            <ul class="nav-list">
                <li class="nav-item">
                    <a href="trojans.html" class="nav-link" data-page="trojans">
                        <span class="nav-icon">🐴</span>
                        <span class="nav-text">Трояны</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="email-lists.html" class="nav-link" data-page="email-lists">
                        <span class="nav-icon">📧</span>
                        <span class="nav-text">Email списки</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="carding.html" class="nav-link" data-page="carding">
                        <span class="nav-icon">💳</span>
                        <span class="nav-text">Кардочесание</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="spam.html" class="nav-link" data-page="spam">
                        <span class="nav-icon">📮</span>
                        <span class="nav-text">Спам</span>
                    </a>
                </li>
            </ul>
        </div>
        
        <!-- Инструменты -->
        <div class="nav-section">
            <div class="section-header">
                <span class="section-icon">◢</span>
                <span class="section-title">Инструменты</span>
            </div>
            <ul class="nav-list">
                <li class="nav-item">
                    <a href="hacking.html" class="nav-link" data-page="hacking">
                        <span class="nav-icon">⚡</span>
                        <span class="nav-text">Взлом</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="cracking.html" class="nav-link" data-page="cracking">
                        <span class="nav-icon">🔓</span>
                        <span class="nav-text">Трещины</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="phreaking.html" class="nav-link" data-page="phreaking">
                        <span class="nav-icon">📞</span>
                        <span class="nav-text">Фрикинг</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="viruses.html" class="nav-link" data-page="viruses">
                        <span class="nav-icon">🦠</span>
                        <span class="nav-text">Вирусы</span>
                    </a>
                </li>
            </ul>
        </div>
        
        <!-- Услуги -->
        <div class="nav-section">
            <div class="section-header">
                <span class="section-icon">◢</span>
                <span class="section-title">Услуги</span>
            </div>
            <ul class="nav-list">
                <li class="nav-item">
                    <a href="counterfeit.html" class="nav-link" data-page="counterfeit">
                        <span class="nav-icon">🖨️</span>
                        <span class="nav-text">Подделка</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="forgery.html" class="nav-link" data-page="forgery">
                        <span class="nav-icon">✍️</span>
                        <span class="nav-text">Фальсификация</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="laundering.html" class="nav-link" data-page="laundering">
                        <span class="nav-icon">💰</span>
                        <span class="nav-text">Отмывание</span>
                    </a>
                </li>
            </ul>
        </div>
        
        <!-- Система -->
        <div class="nav-section">
            <div class="section-header">
                <span class="section-icon">◢</span>
                <span class="section-title">Система</span>
            </div>
            <ul class="nav-list">
                <li class="nav-item">
                    <a href="settings.html" class="nav-link" data-page="settings">
                        <span class="nav-icon">⚙️</span>
                        <span class="nav-text">Настройки</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="support.html" class="nav-link" data-page="support">
                        <span class="nav-icon">🆘</span>
                        <span class="nav-text">Поддержка</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="rules.html" class="nav-link" data-page="rules">
                        <span class="nav-icon">📜</span>
                        <span class="nav-text">Правила</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="blacklist.html" class="nav-link" data-page="blacklist">
                        <span class="nav-icon">🚫</span>
                        <span class="nav-text">Блэклист</span>
                    </a>
                </li>
            </ul>
        </div>
    </nav>
    
    <!-- Sidebar Footer -->
    <div class="sidebar-footer">
        <div class="footer-status">
            <span class="status-dot"></span>
            <span class="status-text">SYSTEM ONLINE</span>
        </div>
    </div>`;
    
    // Вставляем сайдбар
    insertSidebar(sidebar);
    
    // Устанавливаем активную страницу
    if (activePage) {
        const activeLink = sidebar.querySelector(`[data-page="${activePage}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    // Инициализируем сайдбар
    initSidebar();
    
    // Инициализируем анимацию паука после небольшой задержки
    setTimeout(() => {
        if (typeof initSidebarSpiderAnimation === 'function') {
            initSidebarSpiderAnimation();
        }
    }, 100);
    
    console.log('Встроенный сайдбар успешно создан');
}
