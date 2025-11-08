// Профессиональные анимации и эффекты для DARKWEB

// Инициализация анимаций
function initAnimations() {
    initParticleBackground();
    initPageTransitions();
    initHoverEffects();
    initScrollAnimations();
    initTypingEffect();
}

// ========== АНИМИРОВАННЫЙ ФОН С ЧАСТИЦАМИ ==========

// Инициализация фоновых частиц
function initParticleBackground() {
    // Создаем canvas для частиц, если его нет
    if (!document.getElementById('particleCanvas')) {
        const canvas = document.createElement('canvas');
        canvas.id = 'particleCanvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
            opacity: 0.3;
        `;
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Массив частиц
        const particles = [];
        const particleCount = 50;
        
        // Создание частиц
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        
        // Анимация частиц
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                // Обновление позиции
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Отскок от краев
                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
                
                // Отрисовка частицы
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 255, 255, ${particle.opacity})`;
                ctx.fill();
            });
            
            // Соединение близких частиц
            particles.forEach((particle, i) => {
                particles.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(0, 255, 255, ${0.2 * (1 - distance / 100)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });
            });
            
            requestAnimationFrame(animateParticles);
        }
        
        animateParticles();
        
        // Обновление размера canvas при изменении размера окна
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
}

// ========== ПЛАВНЫЕ ПЕРЕХОДЫ МЕЖДУ СТРАНИЦАМИ ==========

// Инициализация переходов между страницами
function initPageTransitions() {
    // Добавляем эффект затухания при переходе
    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', (e) => {
            // Пропускаем внешние ссылки и специальные ссылки
            if (link.target === '_blank' || link.href.startsWith('javascript:') || link.href.startsWith('#')) {
                return;
            }
            
            // Проверяем, что это внутренняя ссылка
            const currentDomain = window.location.origin;
            if (link.href.startsWith(currentDomain) || link.href.startsWith('/') || !link.href.startsWith('http')) {
                e.preventDefault();
                
                // Эффект затухания
                document.body.style.transition = 'opacity 0.3s ease';
                document.body.style.opacity = '0';
                
                setTimeout(() => {
                    window.location.href = link.href;
                }, 300);
            }
        });
    });
}

// ========== ЭФФЕКТЫ ПРИ НАВЕДЕНИИ ==========

// Инициализация эффектов при наведении
function initHoverEffects() {
    // Добавляем эффект свечения для кнопок
    document.querySelectorAll('button, .btn, a').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
            this.style.transform = 'translateY(-2px)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Добавляем эффект пульсации для карточек
    document.querySelectorAll('.card, .widget-card, .stat-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.4)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
}

// ========== АНИМАЦИИ ПРИ ПРОКРУТКЕ ==========

// Инициализация анимаций при прокрутке
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Наблюдаем за элементами, которые должны анимироваться
    document.querySelectorAll('.card, .widget-card, .stat-card, .achievement-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });
}

// ========== ЭФФЕКТ ПЕЧАТАЮЩЕЙСЯ МАШИНКИ ==========

// Инициализация эффекта печатающейся машинки
function initTypingEffect() {
    document.querySelectorAll('[data-typing]').forEach(element => {
        const text = element.getAttribute('data-typing');
        element.textContent = '';
        
        let index = 0;
        const typingInterval = setInterval(() => {
            if (index < text.length) {
                element.textContent += text[index];
                index++;
            } else {
                clearInterval(typingInterval);
            }
        }, 50);
    });
}

// ========== ДОПОЛНИТЕЛЬНЫЕ ЭФФЕКТЫ ==========

// Эффект мерцания для текста
function addGlitchEffect(element) {
    if (!element) return;
    
    setInterval(() => {
        if (Math.random() > 0.95) {
            element.style.textShadow = `
                2px 2px 0 rgba(255, 0, 0, 0.5),
                -2px -2px 0 rgba(0, 255, 255, 0.5)
            `;
            
            setTimeout(() => {
                element.style.textShadow = '';
            }, 100);
        }
    }, 100);
}

// Эффект волны для текста
function addWaveEffect(element) {
    if (!element) return;
    
    const text = element.textContent;
    element.innerHTML = '';
    
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.animation = `wave 2s ease-in-out infinite`;
        span.style.animationDelay = `${index * 0.1}s`;
        element.appendChild(span);
    });
}

// Добавление CSS анимаций
function addAnimationStyles() {
    if (document.getElementById('customAnimations')) return;
    
    const style = document.createElement('style');
    style.id = 'customAnimations';
    style.textContent = `
        @keyframes wave {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-10px);
            }
        }
        
        @keyframes glow {
            0%, 100% {
                text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
            }
            50% {
                text-shadow: 0 0 20px rgba(0, 255, 255, 1), 0 0 30px rgba(0, 255, 255, 0.8);
            }
        }
        
        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
        }
        
        .animate-glow {
            animation: glow 2s ease-in-out infinite;
        }
        
        .animate-pulse {
            animation: pulse 2s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    addAnimationStyles();
    initAnimations();
});

// Экспорт функций
window.initAnimations = initAnimations;
window.addGlitchEffect = addGlitchEffect;
window.addWaveEffect = addWaveEffect;



