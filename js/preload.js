document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.image-container img');
    const loadingScreen = document.getElementById('loading-screen');
    const loadingText = document.getElementById('loading-text');
    let loadedImagesCount = 0;

    // Проверка, загружены ли все изображения
    const allImagesLoaded = Array.from(images).every(img => img.complete);

    if (allImagesLoaded) {
        // Если все изображения уже загружены, просто выйти
        return; // Завершить выполнение
    } else {
        // Показать экран загрузки, если не все изображения загружены
        loadingScreen.style.display = 'flex';
    }

    images.forEach((img) => {
        img.onload = () => {
            loadedImagesCount++;
            // Обновление текста загрузки
            loadingText.textContent = Math.round((loadedImagesCount / images.length) * 100) + '%';
            if (loadedImagesCount === images.length) {
                // Все изображения загружены
                loadingText.textContent = '100%'; // Установить текст на 100%
                // Скрыть экран загрузки сразу после загрузки
                loadingScreen.style.display = 'none';
            }
        };

        img.onerror = () => {
            loadedImagesCount++;
            // Обновление текста загрузки в случае ошибки
            loadingText.textContent = Math.round((loadedImagesCount / images.length) * 100) + '%';
            if (loadedImagesCount === images.length) {
                // Если некоторые изображения не загрузились, скрыть экран загрузки
                loadingScreen.style.display = 'none'; // Скрыть экран загрузки
            }
        };

        // Запустить загрузку изображений
        img.src = img.src; // Это нужно для того, чтобы событие onload сработало
    });
});
