// Переключение между формами
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

loginBtn.addEventListener('click', () => {
    loginBtn.classList.add('active');
    registerBtn.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
});

registerBtn.addEventListener('click', () => {
    registerBtn.classList.add('active');
    loginBtn.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
});

// Обработка формы входа
const loginFormElement = document.getElementById('loginFormElement');
loginFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    // Здесь можно добавить логику проверки входа
    window.location.href = 'profile.html';
});

// Обработка формы регистрации
const registerFormElement = document.getElementById('registerFormElement');
registerFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Пароли не совпадают!');
        return;
    }
    
    window.location.href = 'profile.html';
}); 