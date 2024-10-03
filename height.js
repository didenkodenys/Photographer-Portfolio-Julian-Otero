function setFullHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Устанавливаем значение при загрузке страницы
setFullHeight();

// Обновляем значение при изменении размера окна
window.addEventListener('resize', setFullHeight);
