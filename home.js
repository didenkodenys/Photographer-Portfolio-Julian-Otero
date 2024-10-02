const imageContainer = document.querySelector('.image-container');
const totalImages = 25; // Общее количество изображений
let currentImageIndex = 0; // Индекс текущего изображения
let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints; // Проверка на сенсорное устройство
let cursorElement;
let lastX, lastY; // Предыдущие координаты курсора
let lastMouseX, lastMouseY; // Предыдущие координаты мыши для десктопа

// Настройки скорости
const minSpeed = 10; // Минимальная скорость
const maxSpeed = 20; // Максимальная скорость
const imageGenerationThreshold = 20; // Порог генерации изображения (в пикселях)

// Массив для хранения загруженных изображений
const images = Array.from(imageContainer.querySelectorAll('img')); // Получаем все изображения из контейнера
const preloadedImages = []; // Массив для предварительно загруженных изображений
const loadingScreen = document.getElementById('loading-screen'); // Получаем элемент загрузочного экрана

// Функция для предварительной загрузки всех изображений
function preloadImages() {
    return Promise.all(
        images.map((img) => {
            return new Promise((resolve) => {
                const preloadedImg = new Image();
                preloadedImg.src = img.src; // Задаем источник изображения
                preloadedImg.onload = resolve; // Разрешаем промис после загрузки
                preloadedImg.onerror = resolve; // Разрешаем промис даже в случае ошибки
                preloadedImages.push(preloadedImg); // Сохраняем загруженное изображение в массив
            });
        })
    ).then(() => {
        loadingScreen.style.display = 'none'; // Скрываем загрузочный экран после загрузки
    });
}

// Функция для отображения следующего изображения
function showNextImage(x, y) {
    const img = preloadedImages[currentImageIndex]; // Получаем следующее предзагруженное изображение
    const imgClone = img.cloneNode(true); // Клонируем изображение
    imgClone.style.position = 'absolute'; // Позиционирование изображений
    imgClone.style.left = `${x - imgClone.clientWidth / 2}px`; // Центрируем по X
    imgClone.style.top = `${y - imgClone.clientHeight / 2}px`; // Центрируем по Y
    imgClone.style.display = 'block'; // Показываем изображение
    imageContainer.appendChild(imgClone); // Добавляем изображение в контейнер

    currentImageIndex = (currentImageIndex + 1) % totalImages; // Увеличиваем индекс и сбрасываем, если больше 25
}

let cursorDirectionX = Math.random() * 2 - 1; // Случайное направление по X (от -1 до 1)
let cursorDirectionY = Math.random() * 2 - 1; // Случайное направление по Y (от -1 до 1)

// Функция для перемещения имитации курсора
function moveCursor() {
    if (isTouchDevice && cursorElement) {
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
            showNextImage(newX + cursorElement.clientWidth / 2, newY + cursorElement.clientHeight / 2);
            lastX = newX; // Обновляем предыдущие координаты
            lastY = newY;
        }
    }

    requestAnimationFrame(moveCursor); // Продолжаем анимацию
}

// Инициализация при загрузке страницы
preloadImages().then(() => {
    if (isTouchDevice) {
        initCursor(); // Запускаем имитацию курсора на сенсорных устройствах
    } else {
        lastMouseX = window.innerWidth / 2; // Устанавливаем начальную позицию для мыши
        lastMouseY = window.innerHeight / 2;
    }
});

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
        showNextImage(x, y); // Отображаем следующее изображение
        lastMouseX = x; // Обновляем предыдущие координаты мыши
        lastMouseY = y;
    }
});
