const imageContainer = document.querySelector('.image-container');
const totalImages = 25; // Общее количество изображений
let currentImageIndex = 0; // Индекс текущего изображения
let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints; // Проверка на сенсорные устройства
let cursorElement;
let lastX, lastY; // Предыдущие координаты курсора
let lastMouseX, lastMouseY; // Предыдущие координаты мыши для десктопа
let cursorDirectionX, cursorDirectionY; // Направление курсора

// Настройки скорости
const minSpeed = 2; // Минимальная скорость
const maxSpeed = 10; // Максимальная скорость
const imageGenerationThreshold = 20; // Порог генерации изображения (в пикселях)

// Массив для хранения загруженных изображений
const images = Array.from(imageContainer.querySelectorAll('img')); // Получаем все изображения из контейнера

// Функция для отображения следующего изображения
function showNextImage(x, y) {
    const img = images[currentImageIndex]; // Получаем следующее изображение из массива

    // Центрируем изображение относительно курсора
    img.style.position = 'absolute'; // Позиционирование изображений
    img.style.left = `${x}px`; // Устанавливаем X координату
    img.style.top = `${y}px`; // Устанавливаем Y координату
    img.style.display = 'block'; // Показываем изображение

    currentImageIndex = (currentImageIndex + 1) % totalImages; // Увеличиваем индекс и сбрасываем, если больше 25
}

// Функция для перемещения имитации курсора
function moveCursor() {
    if (isTouchDevice && cursorElement) {
        // Генерируем случайное направление
        const speed = Math.random() * (maxSpeed - minSpeed) + minSpeed; // Случайная скорость в диапазоне
        const newX = parseFloat(cursorElement.style.left) + cursorDirectionX * speed; // Обновляем положение по X
        const newY = parseFloat(cursorElement.style.top) + cursorDirectionY * speed; // Обновляем положение по Y

        // Проверка границ экрана
        if (newX < 0 || newX + cursorElement.clientWidth > window.innerWidth) {
            cursorDirectionX = -cursorDirectionX; // Меняем направление по X
            cursorDirectionY = Math.random() * 2 - 1; // Новое случайное направление по Y
        }
        if (newY < 0 || newY + cursorElement.clientHeight > window.innerHeight) {
            cursorDirectionY = -cursorDirectionY; // Меняем направление по Y
            cursorDirectionX = Math.random() * 2 - 1; // Новое случайное направление по X
        }

        // Обновляем позицию курсора
        cursorElement.style.left = `${Math.max(0, Math.min(newX, window.innerWidth - cursorElement.clientWidth))}px`;
        cursorElement.style.top = `${Math.max(0, Math.min(newY, window.innerHeight - cursorElement.clientHeight))}px`;

        // Проверка расстояния перемещения
        const distance = Math.sqrt(Math.pow(newX - lastX, 2) + Math.pow(newY - lastY, 2));
        if (distance >= imageGenerationThreshold) {
            // Отображаем следующее изображение в центре курсора
            showNextImage(newX, newY); // Передаём координаты без смещения
            lastX = newX; // Обновляем предыдущие координаты
            lastY = newY;
        }
    }

    requestAnimationFrame(moveCursor); // Продолжаем анимацию
}

// Инициализация при загрузке страницы
if (isTouchDevice) {
    initCursor(); // Запускаем имитацию курсора на сенсорных устройствах
} else {
    lastMouseX = window.innerWidth / 2; // Устанавливаем начальную позицию для мыши
    lastMouseY = window.innerHeight / 2;
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
    
    // Генерируем случайное направление для курсора
    cursorDirectionX = Math.random() * 2 - 1; // Случайное направление по X
    cursorDirectionY = Math.random() * 2 - 1; // Случайное направление по Y

    moveCursor(); // Запускаем движение
}

// Функция для удаления изображений
function removeImages() {
    const images = imageContainer.querySelectorAll('img');
    images.forEach((img) => {
        img.style.display = 'none'; // Скрываем изображение вместо удаления
    });
}

// Обработчик событий клика
document.addEventListener('click', () => {
    removeImages(); // Скрываем все изображения по клику
    currentImageIndex = 0; // Сбрасываем индекс
    // Генерируем новое случайное направление для курсора
    cursorDirectionX = Math.random() * 2 - 1; // Новое случайное направление по X
    cursorDirectionY = Math.random() * 2 - 1; // Новое случайное направление по Y
});

// Обработчик событий движения мыши для десктопа
document.addEventListener('mousemove', (event) => {
    const x = event.clientX;
    const y = event.clientY;

    // Проверяем расстояние перемещения мыши
    const distance = Math.sqrt(Math.pow(x - lastMouseX, 2) + Math.pow(y - lastMouseY, 2));
    if (distance >= imageGenerationThreshold) {
        showNextImage(x, y); // Передаём координаты мыши
        lastMouseX = x; // Обновляем предыдущие координаты мыши
        lastMouseY = y;
    }
});

// Удаляем функцию preloadImages, так как изображения уже загружены в HTML
