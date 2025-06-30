// DarkWeb Registration JavaScript
window.addEventListener('DOMContentLoaded', () => {
    // === ИНИЦИАЛИЗАЦИЯ АНИМАЦИЙ ===
    initializeAnimations();
    
    // === ИНИЦИАЛИЗАЦИЯ ЭЛЕМЕНТОВ ===
    initializeElements();
    
    // === ОБРАБОТЧИКИ СОБЫТИЙ ===
    setupEventListeners();
    
    // === ВАЛИДАЦИЯ ФОРМЫ ===
    setupFormValidation();
});

// === АНИМАЦИИ ПОЯВЛЕНИЯ ===
function initializeAnimations() {
    // Анимация появления элементов
    document.querySelectorAll('.fade-in-shadow').forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, 500 + (index * 200));
    });
    
    // Анимация паука и нити
    const thread = document.querySelector('.spider-thread');
    const spider = document.querySelector('.spider-img');
    const swinger = document.querySelector('.spider-swinger');
    
    if (thread && spider && swinger) {
        setTimeout(() => {
            thread.style.height = '90px';
            spider.style.top = '40px';
        }, 350);
        
        setTimeout(() => {
            swinger.classList.add('spider-swing');
        }, 2350);
    }
    
    // Пасхалка: клики по планете
    let planetClickCount = 0;
    const planet = document.querySelector('.planet-img');
    const webBg = document.querySelector('.body-web-bg');
    
    if (planet && webBg) {
        if (localStorage.getItem('darkweb_spider_web') === '1') {
            webBg.style.opacity = '0.22';
        } else {
            webBg.style.opacity = '0';
        }
        
        planet.addEventListener('click', () => {
            planetClickCount++;
            
            if (planetClickCount >= 7) {
                webBg.style.transition = 'opacity 3s ease-in-out';
                webBg.style.opacity = '0.22';
                planetClickCount = 0;
                
                showNotification('Паутина активирована!', 'success');
            }
        });
        
        planet.style.cursor = 'default';
    }
}

// === ИНИЦИАЛИЗАЦИЯ ЭЛЕМЕНТОВ ===
function initializeElements() {
    // Показ/скрытие пароля для всех полей
    setupPasswordToggles();
    
    // Индикатор силы пароля
    setupPasswordStrength();
    
    // Отключение автозаполнения
    disableAutocomplete();
}

// Настройка кнопок показа/скрытия пароля
function setupPasswordToggles() {
    const passwordToggles = [
        { btn: 'loginEyeBtn', input: 'loginPassword' },
        { btn: 'passwordEyeBtn', input: 'password' },
        { btn: 'confirmEyeBtn', input: 'confirmPassword' }
    ];
    
    passwordToggles.forEach(({ btn, input }) => {
        const toggleBtn = document.getElementById(btn);
        const passwordInput = document.getElementById(input);
        
        if (toggleBtn && passwordInput) {
            toggleBtn.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                const eyeIcon = toggleBtn.querySelector('.eye-icon');
                eyeIcon.textContent = type === 'password' ? '💀' : '🔥';
            });
        }
    });
}

// Настройка индикатора силы пароля
function setupPasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthContainer = document.getElementById('passwordStrength');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (passwordInput && strengthContainer && strengthFill && strengthText) {
        passwordInput.addEventListener('input', () => {
            const password = passwordInput.value;
            
            if (password.length > 0) {
                strengthContainer.style.display = 'block';
                const strength = checkPasswordStrength(password);
                updatePasswordStrength(strength, strengthFill, strengthText);
            } else {
                strengthContainer.style.display = 'none';
            }
        });
    }
}

// === ОБРАБОТЧИКИ СОБЫТИЙ ===
function setupEventListeners() {
    // Модальное окно условий
    const termsLink = document.getElementById('termsLink');
    const termsModal = document.getElementById('termsModal');
    const closeTerms = document.getElementById('closeTerms');
    
    if (termsLink && termsModal) {
        termsLink.addEventListener('click', (e) => {
            e.preventDefault();
            termsModal.classList.add('active');
        });
    }
    
    if (closeTerms && termsModal) {
        closeTerms.addEventListener('click', () => {
            termsModal.classList.remove('active');
        });
    }
    
    // Модальное окно восстановления пароля
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const closeForgotPassword = document.getElementById('closeForgotPassword');
    
    if (forgotPasswordLink && forgotPasswordModal) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            forgotPasswordModal.classList.add('active');
        });
    }
    
    if (closeForgotPassword && forgotPasswordModal) {
        closeForgotPassword.addEventListener('click', () => {
            forgotPasswordModal.classList.remove('active');
        });
    }
    
    // Закрытие модальных окон по клику вне их
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
    
    // Обработка формы восстановления пароля
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }
    
    // Переключение вкладок
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const toLogin = document.getElementById('toLogin');
    
    if (loginTab && registerTab && loginForm && registerForm) {
        loginTab.addEventListener('click', () => {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        });
        
        registerTab.addEventListener('click', () => {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerForm.style.display = 'block';
            loginForm.style.display = 'none';
        });
        
        if (toLogin) {
            toLogin.addEventListener('click', (e) => {
                e.preventDefault();
                loginTab.click();
            });
        }
    }
    
    // Обработка формы регистрации
    if (registerForm) {
        registerForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Обработка формы входа
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }
    
    // Эффекты для полей ввода
    const inputFields = document.querySelectorAll('.input-field');
    inputFields.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            input.parentElement.classList.remove('focused');
        });
        
        input.addEventListener('input', () => {
            if (input.value.length > 0) {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });
    });
}

// === ВАЛИДАЦИЯ ФОРМЫ ===
function setupFormValidation() {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const emailInput = document.getElementById('email');
    const usernameInput = document.getElementById('username');
    
    // Валидация email
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            const email = emailInput.value;
            if (email && !isValidEmail(email)) {
                showFieldError(emailInput, 'Некорректный email адрес');
            } else {
                clearFieldError(emailInput);
            }
        });
    }
    
    // Валидация имени пользователя
    if (usernameInput) {
        usernameInput.addEventListener('blur', () => {
            const username = usernameInput.value;
            if (!username || username.length < 3) {
                showFieldError(usernameInput, 'Имя пользователя должно содержать минимум 3 символа');
            } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                showFieldError(usernameInput, 'Имя пользователя может содержать только буквы, цифры и знак подчеркивания');
            } else if (username.length > 20) {
                showFieldError(usernameInput, 'Имя пользователя не должно превышать 20 символов');
            } else {
                clearFieldError(usernameInput);
            }
        });
    }
    
    // Валидация подтверждения пароля
    if (confirmPasswordInput && passwordInput) {
        confirmPasswordInput.addEventListener('input', () => {
            if (confirmPasswordInput.value && confirmPasswordInput.value !== passwordInput.value) {
                showFieldError(confirmPasswordInput, 'Пароли не совпадают');
            } else {
                clearFieldError(confirmPasswordInput);
            }
        });
    }
}

// === ОБРАБОТКА ОТПРАВКИ ФОРМЫ ===
function handleFormSubmit(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;
    
    // Валидация
    let hasErrors = false;
    
    if (!username || username.length < 3) {
        showFieldError(document.getElementById('username'), 'Имя пользователя должно содержать минимум 3 символа');
        hasErrors = true;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showFieldError(document.getElementById('username'), 'Имя пользователя может содержать только буквы, цифры и знак подчеркивания');
        hasErrors = true;
    } else if (username.length > 20) {
        showFieldError(document.getElementById('username'), 'Имя пользователя не должно превышать 20 символов');
        hasErrors = true;
    }
    
    if (!isValidEmail(email)) {
        showFieldError(document.getElementById('email'), 'Некорректный email адрес');
        hasErrors = true;
    }
    
    if (password.length < 8) {
        showFieldError(document.getElementById('password'), 'Пароль должен содержать минимум 8 символов');
        hasErrors = true;
    } else if (!/(?=.*[a-z])/.test(password)) {
        showFieldError(document.getElementById('password'), 'Пароль должен содержать хотя бы одну строчную букву');
        hasErrors = true;
    } else if (!/(?=.*[A-Z])/.test(password)) {
        showFieldError(document.getElementById('password'), 'Пароль должен содержать хотя бы одну заглавную букву');
        hasErrors = true;
    } else if (!/(?=.*\d)/.test(password)) {
        showFieldError(document.getElementById('password'), 'Пароль должен содержать хотя бы одну цифру');
        hasErrors = true;
    }
    
    if (password !== confirmPassword) {
        showFieldError(document.getElementById('confirmPassword'), 'Пароли не совпадают');
        hasErrors = true;
    }
    
    if (!terms) {
        showFieldError(document.getElementById('terms'), 'Необходимо принять условия использования');
        hasErrors = true;
    }
    
    if (hasErrors) {
        showNotification('Исправьте ошибки в форме', 'error');
        return;
    }
    
    // Проверка существующих пользователей
    const existingUsers = JSON.parse(localStorage.getItem('darknet_users') || '[]');
    const userExists = existingUsers.some(user => 
        user.username.toLowerCase() === username.toLowerCase() || 
        user.email.toLowerCase() === email.toLowerCase()
    );
    
    if (userExists) {
        showNotification('Пользователь с таким именем или email уже существует', 'error');
        return;
    }
    
    // Симуляция отправки данных
    const submitBtn = document.getElementById('registerBtn');
    const originalText = submitBtn.querySelector('.btn-text').textContent;
    
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Обработка...';
    
    // Имитация задержки
    setTimeout(() => {
        // Сохраняем нового пользователя
        const currentDate = new Date().toISOString().split('T')[0];
        const formattedDate = formatDate(currentDate);
        
        const newUser = {
            id: generateUserId(),
            username: username,
            email: email,
            password: btoa(password), // Простое кодирование (в реальном проекте нужно хеширование)
            memberSince: currentDate,
            status: 'online',
            rank: 'Новичок',
            reputation: '85.0%',
            connections: '1'
        };
        
        existingUsers.push(newUser);
        localStorage.setItem('darknet_users', JSON.stringify(existingUsers));
        
        // Сохраняем данные для входа
        localStorage.setItem('darknet_user', JSON.stringify({
            id: newUser.id,
            username: username,
            email: email,
            joinDate: formattedDate, // Используем форматированную дату
            memberSince: currentDate,
            status: 'online',
            rank: 'Новичок',
            reputation: '85.0%',
            connections: '1'
        }));
        
        showNotification('Регистрация успешна!', 'success');
        
        // Очищаем форму
        clearRegistrationForm();
        
        // Переход на страницу профиля
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 2000);
        
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = originalText;
    }, 2000);
}

// === ОБРАБОТКА ВХОДА ===
function handleLoginSubmit(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Валидация
    if (!username) {
        showFieldError(document.getElementById('loginUsername'), 'Введите имя пользователя');
        return;
    }
    
    if (!password) {
        showFieldError(document.getElementById('loginPassword'), 'Введите пароль');
        return;
    }
    
    // Проверка пользователей
    const existingUsers = JSON.parse(localStorage.getItem('darknet_users') || '[]');
    const user = existingUsers.find(u => 
        u.username.toLowerCase() === username.toLowerCase() && 
        u.password === btoa(password)
    );
    
    if (!user) {
        showNotification('Неверное имя пользователя или пароль', 'error');
        return;
    }
    
    // Симуляция входа
    const submitBtn = document.getElementById('loginBtn');
    const originalText = submitBtn.querySelector('.btn-text').textContent;
    
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Вход...';
    
    // Сохраняем данные пользователя для сессии
    const sessionUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        joinDate: formatDate(user.memberSince), // Форматируем дату
        memberSince: user.memberSince,
        status: 'online',
        rank: user.rank,
        reputation: user.reputation,
        connections: user.connections
    };
    
    localStorage.setItem('darknet_user', JSON.stringify(sessionUser));
    
    // Имитация задержки
    setTimeout(() => {
        showNotification('Вход выполнен успешно!', 'success');
        
        // Переход на страницу профиля
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1500);
        
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = originalText;
    }, 1500);
}

// === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===

// Проверка силы пароля
function checkPasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score < 2) return 'слабый';
    if (score < 3) return 'средний';
    if (score < 4) return 'хороший';
    return 'сильный';
}

// Обновление индикатора силы пароля
function updatePasswordStrength(strength, strengthFill, strengthText) {
    const strengthLabels = {
        слабый: 'Слабый',
        средний: 'Средний',
        хороший: 'Хороший',
        сильный: 'Сильный'
    };
    
    strengthFill.className = `strength-fill ${strength}`;
    strengthText.textContent = strengthLabels[strength];
}

// Валидация email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Форматирование даты для отображения
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

// Генерация случайного ID пользователя
function generateUserId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Показать ошибку поля
function showFieldError(field, message) {
    field.style.borderColor = 'var(--error-color)';
    field.style.boxShadow = '0 0 10px rgba(255, 68, 68, 0.3)';
    
    // Удаляем существующее сообщение об ошибке
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Создаем новое сообщение об ошибке
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--error-color)';
    errorElement.style.fontSize = '11px';
    errorElement.style.marginTop = '5px';
    errorElement.style.textShadow = '0 0 5px var(--error-color)';
    
    field.parentElement.appendChild(errorElement);
}

// Очистить ошибку поля
function clearFieldError(field) {
    field.style.borderColor = 'var(--border-color)';
    field.style.boxShadow = 'none';
    
    const errorElement = field.parentElement.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Показать уведомление
function showNotification(message, type = 'info') {
    const notifications = document.getElementById('notificationContainer');
    
    if (!notifications) {
        console.error('Notification container not found');
        return;
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notifications.appendChild(notification);
    
    // Показываем уведомление
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Автоматически скрываем через 5 секунд
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// === ДОПОЛНИТЕЛЬНЫЕ ЭФФЕКТЫ ===

// Эффект разбития для кнопки
function shatterEffect(button) {
    const rect = button.getBoundingClientRect();
    const particles = 20;
    
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = rect.left + rect.width / 2 + 'px';
        particle.style.top = rect.top + rect.height / 2 + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'var(--accent-cyan)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '10000';
        
        const angle = (i / particles) * 360;
        const velocity = 100 + Math.random() * 100;
        const vx = Math.cos(angle * Math.PI / 180) * velocity;
        const vy = Math.sin(angle * Math.PI / 180) * velocity;
        
        document.body.appendChild(particle);
        
        let x = 0;
        let y = 0;
        let opacity = 1;
        
        function animate() {
            x += vx * 0.016;
            y += vy * 0.016;
            opacity -= 0.02;
            
            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                document.body.removeChild(particle);
            }
        }
        
        animate();
    }
}

// Добавляем эффект разбития к кнопке регистрации
const registerBtn = document.querySelector('.register-btn');
if (registerBtn) {
    registerBtn.addEventListener('click', () => {
        shatterEffect(registerBtn);
    });
}

// === КЛАВИАТУРНЫЕ СОКРАЩЕНИЯ ===
document.addEventListener('keydown', (e) => {
    // Ctrl + Enter для отправки формы
    if (e.ctrlKey && e.key === 'Enter') {
        const form = document.getElementById('registerForm');
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape для закрытия модального окна
    if (e.key === 'Escape') {
        const modal = document.getElementById('termsModal');
        if (modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    }
});

// === АВТОСОХРАНЕНИЕ ===
function autoSave() {
    const formData = {
        username: document.getElementById('username')?.value || '',
        email: document.getElementById('email')?.value || ''
    };
    
    localStorage.setItem('registerFormData', JSON.stringify(formData));
}

function loadAutoSave() {
    const savedData = localStorage.getItem('registerFormData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        if (data.username) document.getElementById('username').value = data.username;
        if (data.email) document.getElementById('email').value = data.email;
        
        showNotification('Данные восстановлены', 'success');
    }
}

// Автосохранение каждые 5 секунд
setInterval(autoSave, 5000);

// Загрузка сохраненных данных при загрузке страницы
window.addEventListener('load', loadAutoSave);

// Синхронизация паутины с главной страницей
window.addEventListener('DOMContentLoaded', () => {
    const webBg = document.querySelector('.body-web-bg');
    if (webBg) {
        if (localStorage.getItem('darkweb_spider_web') === '1') {
            webBg.style.opacity = '0.22';
        } else {
            webBg.style.opacity = '0';
        }
    }
});

// Обработка восстановления пароля
function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('resetEmail').value;
    
    if (!email || !isValidEmail(email)) {
        showNotification('Введите корректный email адрес', 'error');
        return;
    }
    
    // Симуляция отправки инструкций
    showNotification('Инструкции по восстановлению пароля отправлены на ваш email', 'success');
    
    // Закрываем модальное окно
    const modal = document.getElementById('forgotPasswordModal');
    modal.classList.remove('active');
    
    // Очищаем форму
    document.getElementById('resetEmail').value = '';
}

// Отключение автозаполнения для всех полей
function disableAutocomplete() {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        // Устанавливаем атрибуты для отключения автозаполнения
        input.setAttribute('autocomplete', 'new-password');
        input.setAttribute('data-lpignore', 'true');
        input.setAttribute('data-form-type', 'other');
        
        // Добавляем обработчики событий для предотвращения автозаполнения
        input.addEventListener('focus', () => {
            input.style.backgroundColor = 'rgba(0,0,0,0.45)';
            input.style.color = '#eaffff';
        });
        
        input.addEventListener('blur', () => {
            if (input.value) {
                input.style.backgroundColor = 'rgba(0,0,0,0.32)';
                input.style.color = '#eaffff';
            }
        });
        
        input.addEventListener('input', () => {
            input.style.backgroundColor = 'rgba(0,0,0,0.32)';
            input.style.color = '#eaffff';
        });
        
        // Предотвращаем автозаполнение при загрузке страницы
        setTimeout(() => {
            input.style.backgroundColor = 'rgba(0,0,0,0.32)';
            input.style.color = '#eaffff';
        }, 100);
    });
}

// Очистка формы после успешной регистрации
function clearRegistrationForm() {
    const form = document.getElementById('registerForm');
    if (form) {
        form.reset();
    }
} 