document.addEventListener('DOMContentLoaded', () => {
    const imageContainers = document.querySelectorAll('.image-container, #image-gallery'); // Найдем оба контейнера
    const loadingScreen = document.getElementById('loading-screen');
    const loadingText = document.getElementById('loading-text');
    let loadedImagesCount = 0;
    let totalImagesCount = 0;

    // Проверка наличия контейнеров
    if (imageContainers.length === 0) {
        return; // Если контейнеров нет, просто завершаем выполнение
    }

    // Считаем общее количество изображений в обоих контейнерах
    imageContainers.forEach(container => {
        const images = container.querySelectorAll('img'); // Найдем все изображения в текущем контейнере
        totalImagesCount += images.length; // Увеличиваем общее количество изображений

        if (images.length === 0) {
            return; // Если в контейнере нет изображений, просто продолжаем
        }

        // Проверяем, загружены ли все изображения в контейнере
        const allImagesLoaded = Array.from(images).every(img => img.complete);

        if (allImagesLoaded) {
            // Если все изображения уже загружены, увеличиваем счетчик
            loadedImagesCount += images.length;
            return; // Завершить выполнение для этого контейнера
        } else {
            // Показать экран загрузки, если не все изображения загружены
            loadingScreen.style.display = 'flex';
        }

        images.forEach((img) => {
            img.onload = () => {
                loadedImagesCount++;
                // Обновление текста загрузки
                loadingText.textContent = Math.round((loadedImagesCount / totalImagesCount) * 100) + '%';
                if (loadedImagesCount === totalImagesCount) {
                    // Все изображения загружены
                    loadingText.textContent = '100%'; // Установить текст на 100%
                    // Скрыть экран загрузки сразу после загрузки
                    loadingScreen.style.display = 'none';
                }
            };

            img.onerror = () => {
                loadedImagesCount++;
                // Обновление текста загрузки в случае ошибки
                loadingText.textContent = Math.round((loadedImagesCount / totalImagesCount) * 100) + '%';
                if (loadedImagesCount === totalImagesCount) {
                    // Если некоторые изображения не загрузились, скрыть экран загрузки
                    loadingScreen.style.display = 'none'; // Скрыть экран загрузки
                }
            };

            // Запустить загрузку изображений
            img.src = img.src; // Это нужно для того, чтобы событие onload сработало
        });
    });

    // Если нет изображений для загрузки, скрываем экран загрузки
    if (totalImagesCount === 0) {
        loadingScreen.style.display = 'none';
    }
});
