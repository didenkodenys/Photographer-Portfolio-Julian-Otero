// preload.js

// Массив с ресурсами для загрузки
window.resources = [
    'images/image1.jpg',
    'images/image2.jpg',
    'images/image3.jpg',
    'images/image4.jpg',
    'images/image5.jpg',
    'images/image6.jpg',
    'images/image7.jpg',
    'images/image8.jpg',
    'images/image9.jpg',
    'images/image10.jpg',
    'images/image11.jpg',
    'images/image12.jpg',
    'images/image13.jpg',
    'images/image14.jpg',
    'images/image15.jpg',
    'images/image16.jpg',
    'images/image17.jpg',
    'images/image18.jpg',
    'images/image19.jpg',
    'images/image20.jpg',
    'images/image21.jpg',
    'images/image22.jpg',
    'images/image23.jpg',
    'images/image24.jpg',
    'images/image25.jpg',
];

window.loadedCount = 0; // Количество загруженных ресурсов
window.imagesArray = []; // Массив для хранения загруженных изображений
let loadingStartTime; // Время начала загрузки

// Функция для обновления прогресса загрузки
window.updateLoadingProgress = function() {
    const loadingText = document.querySelector('.loading-text');
    const elapsedTime = Date.now() - loadingStartTime; // Время с начала загрузки
    const progress = Math.min(Math.round((window.loadedCount / window.resources.length) * 100), 100);

    // Обновляем текст загрузки с задержкой, чтобы гарантировать минимальное время 2 секунды
    if (elapsedTime < 2000) {
        const adjustedProgress = Math.round((elapsedTime / 2000) * progress);
        loadingText.textContent = `${adjustedProgress}`;
    } else {
        loadingText.textContent = `${progress}`;
    }

    if (window.loadedCount === window.resources.length) {
        // Все ресурсы загружены, скрываем экран загрузки
        document.getElementById('loading-screen').style.display = 'none';
        displayImages(); // Показываем изображения
        checkLoadedImages(); // Проверяем загруженные изображения
    }
}

// Функция для загрузки изображения
window.loadImage = function(resource) {
    return new Promise((resolve) => {
        const img = new Image(); // Создаем новый элемент изображения
        img.src = resource;

        img.onload = () => {
            window.loadedCount++;
            window.imagesArray.push(img); // Сохраняем загруженное изображение в массив
            updateLoadingProgress();
            resolve(); // Разрешаем промис после загрузки
        };

        img.onerror = () => {
            window.loadedCount++;
            updateLoadingProgress();
            resolve(); // Разрешаем промис даже в случае ошибки
        };
    });
}

// Функция для отображения загруженных изображений
window.displayImages = function() {
    const imageContainer = document.querySelector('.image-container'); // Находим контейнер для изображений

    // Итерируемся по массиву загруженных изображений
    window.imagesArray.forEach((img, index) => {
        // Находим изображение в контейнере по индексу
        const existingImg = imageContainer.querySelector(`img:nth-of-type(${index + 1})`);
        if (existingImg) {
            existingImg.src = img.src; // Устанавливаем путь к загруженному изображению
            existingImg.style.display = 'block'; // Делаем изображение видимым
        }
    });
}

// Функция для проверки загруженных изображений
window.checkLoadedImages = function() {
    console.log(`Всего загруженных изображений: ${window.imagesArray.length}`);
    window.imagesArray.forEach((img, index) => {
        console.log(`Изображение ${index + 1}: ${img.src}`);
    });
}

// Функция для загрузки всех ресурсов
window.loadResources = async function() {
    loadingStartTime = Date.now(); // Запоминаем время начала загрузки
    const loadPromises = window.resources.map(resource => loadImage(resource));
    await Promise.all(loadPromises);
}

// Начинаем загрузку ресурсов
loadResources();
