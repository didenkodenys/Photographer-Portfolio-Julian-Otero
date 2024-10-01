const imageContainer = document.querySelector('.image-container');
const totalImages = 25; // Общее количество изображений
let currentImageIndex = 0; // Индекс текущего изображения
let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints; // Проверка на сенсорное устройство
let cursorElement;
let lastX, lastY; // Предыдущие координаты курсора

// Настройки скорости
const minSpeed = 50; // Минимальная скорость
const maxSpeed = 300; // Максимальная скорость
const imageGenerationThreshold = 20; // Порог генерации изображения (в пикселях)

// Функция для отображения следующего изображения
function showNextImage(x, y) {
    const img = document.createElement('img');
    img.src = `images/image${currentImageIndex + 1}.jpg`; // Убедитесь, что названия изображений правильные
    img.alt = `Изображение ${currentImageIndex + 1}`;
    
    // Центрируем изображение относительно курсора
    img.style.position = 'absolute'; // Позиционирование изображений
    img.style.left = `${x}px`; // Центрируем по X (половина ширины изображения)
    img.style.top = `${y}px`; // Центрируем по Y (половина высоты изображения)

    // Добавляем изображение в контейнер
    imageContainer.appendChild(img);

    currentImageIndex = (currentImageIndex + 1) % totalImages; // Увеличиваем индекс и сбрасываем, если больше 25
}

// Функция для перемещения имитации курсора
function moveCursor() {
    if (isTouchDevice && cursorElement) {
        const speed = Math.random() * (maxSpeed - minSpeed) + minSpeed; // Случайная скорость в диапазоне
        const directionX = (Math.random() - 0.5) * speed; // Случайное направление по X
        const directionY = (Math.random() - 0.5) * speed; // Случайное направление по Y

        const rect = cursorElement.getBoundingClientRect();
        let newX = rect.left + directionX;
        let newY = rect.top + directionY;

        // Проверка границ экрана
        if (newX < 0 || newX + cursorElement.clientWidth > window.innerWidth) {
            newX = Math.max(0, Math.min(newX, window.innerWidth - cursorElement.clientWidth));
        }
        if (newY < 0 || newY + cursorElement.clientHeight > window.innerHeight) {
            newY = Math.max(0, Math.min(newY, window.innerHeight - cursorElement.clientHeight));
        }

        cursorElement.style.left = `${newX}px`;
        cursorElement.style.top = `${newY}px`;

        // Проверка расстояния перемещения
        const distance = Math.sqrt(Math.pow(newX - lastX, 2) + Math.pow(newY - lastY, 2));
        if (distance >= imageGenerationThreshold) {
            // Отображаем следующее изображение в центре курсора
            showNextImage(newX + cursorElement.clientWidth / 2, newY + cursorElement.clientHeight / 2);
            lastX = newX; // Обновляем предыдущие координаты
            lastY = newY;
        }
    }

    requestAnimationFrame(moveCursor); // Продолжаем анимацию
}


// Инициализация имитации курсора
function initCursor() {
    cursorElement = document.createElement('div');
    cursorElement.style.position = 'fixed';
    cursorElement.style.width = '20px'; // Ширина имитации курсора
    cursorElement.style.height = '20px'; // Высота имитации курсора
    cursorElement.style.pointerEvents = 'none'; // Чтобы имитация не блокировала события
    cursorElement.style.backgroundColor = 'transparent'; // Сделаем его прозрачным

    // Устанавливаем начальную позицию курсора в центре окна
    cursorElement.style.left = `${window.innerWidth / 2}px`;
    cursorElement.style.top = `${window.innerHeight / 2}px`;

    document.body.appendChild(cursorElement);
    lastX = parseFloat(cursorElement.style.left);
    lastY = parseFloat(cursorElement.style.top);
    moveCursor(); // Запускаем движение
}

// Функция для удаления изображений
function removeImages() {
    const images = imageContainer.querySelectorAll('img');
    images.forEach((img) => {
        img.remove(); // Удаляем изображение
    });
}

// Обработчик событий клика
document.addEventListener('click', () => {
    removeImages(); // Удаляем все изображения по клику
    currentImageIndex = 0; // Сбрасываем индекс
});

// Инициализация при загрузке страницы
if (isTouchDevice) {
    initCursor(); // Запускаем имитацию курсора на сенсорных устройствах
} else {
    // Обработчик событий движения мыши для десктопа
    document.addEventListener('mousemove', (event) => {
        const x = event.clientX;
        const y = event.clientY;
        showNextImage(x, y);
    });
}
