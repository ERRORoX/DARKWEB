window.addEventListener('DOMContentLoaded', () => {
    // 1. Эффект появления из тени для всех элементов
    document.querySelectorAll('.fade-in-shadow').forEach(el => {
        setTimeout(() => {
            el.classList.add('visible');
        }, 500);
    });
    
    // 2. АНИМАЦИЯ СПУСКА ПАУКА И НИТИ, ЗАТЕМ КАЧАНИЕ
    const thread = document.querySelector('.spider-thread');
    const spider = document.querySelector('.spider-img');
    const swinger = document.querySelector('.spider-swinger');
    if (thread && spider && swinger) {
        // Паук и нить спускаются одновременно
        setTimeout(() => {
            thread.style.height = '90px';
            spider.style.top = '40px';
        }, 350);
        // После спуска — качание
        setTimeout(() => {
            swinger.classList.add('spider-swing');
        }, 350 + 2000); // 2s на спуск
    }
    
    // 3. ПАСХАЛКА: 7 нажатий на планету = появление паутины
    let planetClickCount = 0;
    const planet = document.querySelector('.planet-img');
    const webBg = document.querySelector('.body-web-bg');
    
    if (planet && webBg) {
        // Скрываем паутину по умолчанию
        webBg.style.opacity = '0';
        
        planet.addEventListener('click', () => {
            planetClickCount++;
            
            // После 7 нажатий - тихо появляется паутина
            if (planetClickCount >= 7) {
                webBg.style.transition = 'opacity 3s ease-in-out';
                webBg.style.opacity = '0.22';
                
                // Сбрасываем счетчик
                planetClickCount = 0;
            }
        });
        
        // Убираем курсор pointer - планета выглядит обычной
        planet.style.cursor = 'default';
    }
    
    // ENTER переход
    const enterText = document.getElementById('enterText');
    if (enterText) {
        enterText.addEventListener('click', () => {
            const fadeBg = document.getElementById('fadeBg');
            fadeBg.classList.add('active');
            setTimeout(() => {
                window.location.href = 'html/register.html';
            }, 700);
        });
    }
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const fadeBg = document.getElementById('fadeBg');
            fadeBg.classList.add('active');
            setTimeout(() => {
                window.location.href = 'html/register.html';
            }, 700);
        }
    });
    
    // Регистрация Service Worker для PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            const swPath = window.location.pathname.includes('/html/') ? '../sw.js' : 'sw.js';
            navigator.serviceWorker.register(swPath)
                .then((registration) => {
                    console.log('ServiceWorker registered:', registration);
                })
                .catch((error) => {
                    console.log('ServiceWorker registration failed:', error);
                });
        });
    }
}); 