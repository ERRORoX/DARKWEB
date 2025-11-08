// Система обработки ошибок для DARKWEB

// Инициализация обработки ошибок
function initErrorHandler() {
    // Обработка глобальных ошибок JavaScript
    window.addEventListener('error', (event) => {
        handleError({
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error
        });
    });
    
    // Обработка необработанных промисов
    window.addEventListener('unhandledrejection', (event) => {
        handleError({
            message: event.reason?.message || 'Unhandled Promise Rejection',
            error: event.reason
        });
    });
    
    // Обработка ошибок загрузки ресурсов
    window.addEventListener('error', (event) => {
        if (event.target !== window) {
            handleResourceError(event.target);
        }
    }, true);
}

// Обработка ошибки
function handleError(errorInfo) {
    console.error('Error:', errorInfo);
    
    // Сохраняем ошибку в localStorage для отладки
    const errors = JSON.parse(localStorage.getItem('darkweb_errors') || '[]');
    errors.push({
        ...errorInfo,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    });
    
    // Ограничиваем количество сохраненных ошибок
    if (errors.length > 50) {
        errors.shift();
    }
    
    localStorage.setItem('darkweb_errors', JSON.stringify(errors));
    
    // Показываем уведомление пользователю (только для критических ошибок)
    if (errorInfo.error && errorInfo.error.name !== 'TypeError') {
        if (typeof showNotification === 'function') {
            showNotification('Произошла ошибка. Попробуйте обновить страницу.', 'error');
        }
    }
}

// Обработка ошибок загрузки ресурсов
function handleResourceError(element) {
    if (element.tagName === 'IMG') {
        // Заменяем битые изображения на заглушку
        element.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23000" width="100" height="100"/%3E%3Ctext fill="%2300ffff" x="50" y="50" text-anchor="middle" dy=".3em"%3EImage%3C/text%3E%3C/svg%3E';
        element.style.opacity = '0.5';
    } else if (element.tagName === 'SCRIPT') {
        console.warn('Failed to load script:', element.src);
    } else if (element.tagName === 'LINK') {
        console.warn('Failed to load stylesheet:', element.href);
    }
}

// Валидация данных
function validateData(data, schema) {
    const errors = [];
    
    for (const key in schema) {
        const rule = schema[key];
        const value = data[key];
        
        if (rule.required && (value === undefined || value === null || value === '')) {
            errors.push(`Поле "${key}" обязательно для заполнения`);
            continue;
        }
        
        if (value !== undefined && value !== null && value !== '') {
            if (rule.type && typeof value !== rule.type) {
                errors.push(`Поле "${key}" должно быть типа ${rule.type}`);
            }
            
            if (rule.minLength && value.length < rule.minLength) {
                errors.push(`Поле "${key}" должно содержать минимум ${rule.minLength} символов`);
            }
            
            if (rule.maxLength && value.length > rule.maxLength) {
                errors.push(`Поле "${key}" должно содержать максимум ${rule.maxLength} символов`);
            }
            
            if (rule.pattern && !rule.pattern.test(value)) {
                errors.push(`Поле "${key}" имеет неверный формат`);
            }
        }
    }
    
    return errors;
}

// Безопасное выполнение функции
function safeExecute(func, errorMessage = 'Произошла ошибка при выполнении операции') {
    try {
        return func();
    } catch (error) {
        handleError({
            message: errorMessage,
            error: error
        });
        return null;
    }
}

// Асинхронное безопасное выполнение
async function safeExecuteAsync(func, errorMessage = 'Произошла ошибка при выполнении операции') {
    try {
        return await func();
    } catch (error) {
        handleError({
            message: errorMessage,
            error: error
        });
        return null;
    }
}

// Проверка доступности localStorage
function checkLocalStorage() {
    try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        if (typeof showNotification === 'function') {
            showNotification('localStorage недоступен. Некоторые функции могут не работать.', 'error');
        }
        return false;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    initErrorHandler();
    checkLocalStorage();
});

// Экспорт функций
window.handleError = handleError;
window.validateData = validateData;
window.safeExecute = safeExecute;
window.safeExecuteAsync = safeExecuteAsync;

