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

// Функция для обновления прогресса загрузки
window.updateLoadingProgress = function() {
    const loadingText = document.querySelector('.loading-text');
    const progress = Math.round((loadedCount / resources.length) * 100);
    loadingText.textContent = `${progress}`; // Убираем знак процента

    if (loadedCount === resources.length) {
        // Все ресурсы загружены, скрываем экран загрузки
        document.getElementById('loading-screen').style.display = 'none';
        displayImages(); // Показываем изображения
    }
}

// Функция для загрузки изображения
window.loadImage = function(resource) {
    return new Promise((resolve) => {
        const img = new Image(); // Создаем новый элемент изображения
        img.src = resource;

        img.onload = () => {
            loadedCount++;
            imagesArray.push(img); // Сохраняем загруженное изображение в массив
            updateLoadingProgress();
            resolve(); // Разрешаем промис после загрузки
        };

        img.onerror = () => {
            loadedCount++;
            updateLoadingProgress();
            resolve(); // Разрешаем промис даже в случае ошибки
        };
    });
}

// Функция для отображения загруженных изображений
window.displayImages = function() {
    const imageContainer = document.querySelector('.image-container'); // Находим контейнер для изображений
    imagesArray.forEach(img => {
        imageContainer.appendChild(img); // Добавляем каждое загруженное изображение в контейнер
    });
}

// Функция для загрузки всех ресурсов
window.loadResources = async function() {
    const loadPromises = resources.map(resource => loadImage(resource));
    await Promise.all(loadPromises);
}

// Начинаем загрузку ресурсов
loadResources();
