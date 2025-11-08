// Инициализация сайдбара
function initSidebar() {
    const navLinks = document.querySelectorAll('.nav-link');
    const quickLinks = document.querySelectorAll('.quick-link');
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.getElementById('sidebarToggle');
    
    // Функция закрытия сайдбара
    const closeSidebar = () => {
        if (sidebar) {
            sidebar.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        }
    };
    
    // Общая функция обработки клика по ссылке
    const handleLinkClick = (clickedLink, allLinks) => {
        allLinks.forEach(l => l.classList.remove('active'));
        clickedLink.classList.add('active');
        
        // Закрытие сайдбара на мобильных после клика
        if (window.innerWidth <= 1024 && sidebar) {
            setTimeout(() => {
                closeSidebar();
            }, 300);
        }
    };
    
    // Обработка навигационных ссылок
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            handleLinkClick(link, [...navLinks, ...quickLinks]);
        });
    });
    
    // Обработка быстрых ссылок
    quickLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            handleLinkClick(link, [...navLinks, ...quickLinks]);
        });
    });
    
    // Переключатель сайдбара
    if (toggleBtn && sidebar) {
        // Добавляем кнопку закрытия внутри сайдбара (только для мобильных)
        if (window.innerWidth <= 1024) {
            let closeBtn = sidebar.querySelector('.sidebar-close-btn');
            if (!closeBtn) {
                closeBtn = document.createElement('button');
                closeBtn.className = 'sidebar-close-btn';
                closeBtn.innerHTML = '✕';
                closeBtn.setAttribute('aria-label', 'Закрыть сайдбар');
                const sidebarHeader = sidebar.querySelector('.sidebar-header');
                if (sidebarHeader) {
                    sidebarHeader.style.position = 'relative';
                    sidebarHeader.appendChild(closeBtn);
                }
            }
            
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeSidebar();
            });
        }
        
        // Функция открытия сайдбара
        const openSidebar = () => {
            sidebar.classList.add('active');
            document.body.classList.add('sidebar-open');
        };
        
        // Обработчик для кнопки toggle
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (sidebar.classList.contains('active')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
        
        // Закрытие по клавише Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                closeSidebar();
            }
        });
    }
    
    // Закрытие сайдбара при клике вне его (только для мобильных)
    if (sidebar && window.innerWidth <= 1024) {
        const handleClickOutside = (e) => {
            if (sidebar.classList.contains('active') && 
                !sidebar.contains(e.target) && 
                (!toggleBtn || !toggleBtn.contains(e.target))) {
                closeSidebar();
            }
        };
        
        // Добавляем обработчик только на мобильных
        document.addEventListener('click', handleClickOutside, true);
    }
    
    // Определение активной страницы
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 
                       window.location.pathname.split('/').pop() || '';
    const allLinks = [...navLinks, ...quickLinks];
    
    allLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        const dataPage = link.getAttribute('data-page') || '';
        const hrefPage = href.replace('.html', '').replace('html/', '');
        
        if (hrefPage === currentPage || dataPage === currentPage || 
            (currentPage && (href.includes(currentPage) || dataPage.includes(currentPage)))) {
            link.classList.add('active');
        }
    });
    
    // Анимация спуска паука и нити в сайдбаре
    initSidebarSpiderAnimation();
}


// Функция инициализации анимации паука в сайдбаре (доступна глобально)
window.initSidebarSpiderAnimation = function() {
    const thread = document.querySelector('.brand-logo .spider-thread');
    const spider = document.querySelector('.brand-logo .spider-img');
    const swinger = document.querySelector('.brand-logo .spider-swinger');
    
    if (thread && spider && swinger) {
        // Сбрасываем стили
        thread.style.height = '0';
        spider.style.top = '-50px';
        swinger.classList.remove('spider-swing');
        
        // Небольшая задержка перед началом анимации
        setTimeout(() => {
            // Паук и нить спускаются одновременно
            thread.style.height = '60px';
            spider.style.top = '12px';
            
            // После спуска — качание
            setTimeout(() => {
                swinger.classList.add('spider-swing');
            }, 2000);
        }, 350);
    }
};
