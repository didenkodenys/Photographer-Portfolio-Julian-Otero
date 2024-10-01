// Создаем и добавляем CSS стили для экрана загрузки
const styles = `
    #loading-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #F8FBF8; /* Цвет фона экрана загрузки */
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999; /* Чтобы экран загрузки был поверх всего */
        opacity: 1; /* Начальная непрозрачность */
        transition: opacity 0.5s ease; /* Плавный переход для исчезновения */
    }

    .loading-text {
        position: fixed;
        font-size: 128px;
        color: #2E2930; /* Цвет текста */
        left: 10px;
        bottom: 0.1px;
    }
`;

// Создаем элемент стилей и добавляем его в документ
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// Создаем и добавляем HTML для экрана загрузки
const loadingScreenHTML = `
    <div id="loading-screen" style="display: none;">
        <div class="loading-text" id="loading-text">0</div>
    </div>
`;

// Добавляем HTML в body
document.body.insertAdjacentHTML('beforeend', loadingScreenHTML);

// Список всех изображений для загрузки
const imagesToLoad = [];
for (let i = 1; i <= 25; i++) {
    imagesToLoad.push(`images/image${i}.jpg`);
}

// Список всех скриптов для загрузки
const scriptsToLoad = [
    //'script.js',
    //'project.js',
    // Добавьте другие скрипты, если они есть
];

let loadedResources = 0; // Счетчик загруженных ресурсов
let animationInterval = null; // Переменная для управления анимацией
let isResourcesLoaded = false; // Флаг завершения загрузки ресурсов
const totalResources = imagesToLoad.length + scriptsToLoad.length; // Общее количество ресурсов
const animationDuration = 500; // Продолжительность анимации в миллисекундах

// Функция для обновления текста загрузки
function updateLoadingText(progress) {
    const loadingText = document.getElementById('loading-text');
    loadingText.textContent = progress; // Обновляем текст без нулей впереди
}

// Функция для загрузки изображения
function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            loadedResources++;
            resolve();
        };
        img.onerror = () => {
            console.error(`Ошибка загрузки изображения: ${src}`);
            loadedResources++; // Увеличиваем счетчик даже при ошибке
            resolve(); // Завершаем загрузку даже при ошибке
        };
    });
}

// Функция для загрузки скрипта
function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            loadedResources++;
            resolve();
        };
        script.onerror = () => {
            console.error(`Ошибка загрузки скрипта: ${src}`);
            loadedResources++; // Увеличиваем счетчик даже при ошибке
            resolve(); // Завершаем загрузку даже при ошибке
        };
        document.head.appendChild(script);
    });
}

// Функция для плавной анимации прогресса
function animateProgress() {
    const startTime = Date.now();

    animationInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min((elapsed / animationDuration) * 100, 100); // Рассчитываем текущий прогресс

        updateLoadingText(Math.floor(progress)); // Обновляем текст прогресса

        // Если прогресс достиг 100%
        if (progress >= 100 && isResourcesLoaded) {
            clearInterval(animationInterval);
            
            // Остановимся на 100% на 0.5 секунды
            setTimeout(() => {
                hideLoadingScreen(); // Плавно скрываем экран загрузки после паузы
            }, 500); // 500 миллисекунд пауза
        }
    }, 16); // Обновление каждые ~16мс (60 кадров в секунду)
}

// Функция для загрузки всех ресурсов
async function preloadResources() {
    // Загружаем все изображения
    const imagePromises = imagesToLoad.map(loadImage);
    
    // Загружаем все скрипты
    const scriptPromises = scriptsToLoad.map(loadScript);
    
    // Ожидаем загрузки всех ресурсов
    await Promise.all([...imagePromises, ...scriptPromises]);

    isResourcesLoaded = true; // Все ресурсы загружены
}

// Функция для плавного исчезновения экрана загрузки
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.opacity = '0'; // Устанавливаем непрозрачность в 0

    // Ждем окончания анимации
    setTimeout(() => {
        loadingScreen.style.display = 'none'; // Скрываем экран загрузки
    }, 500); // Должно совпадать с длительностью перехода в CSS
}

// Запуск процесса предзагрузки и обновления прогресса
async function initPreloader() {
    // Проверяем, было ли загружено ранее
    if (!sessionStorage.getItem('resourcesLoaded')) {
        // Если нет, показываем экран загрузки
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.display = 'flex'; // Показываем экран загрузки

        // Начинаем анимацию загрузки
        animateProgress();

        // Начинаем предзагрузку ресурсов
        const preloadPromise = preloadResources();

        const minLoadingTime = animationDuration; // Минимальное время загрузки (500 миллисекунд)
        const startTime = Date.now(); // Время начала загрузки

        // Ждем загрузки ресурсов
        await preloadPromise;

        const elapsedTime = Date.now() - startTime; // Прошедшее время загрузки

        // Если время загрузки меньше минимального, ждем оставшееся время
        if (elapsedTime < minLoadingTime) {
            await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsedTime));
        }

        // Устанавливаем флаг, что ресурсы загружены
        sessionStorage.setItem('resourcesLoaded', 'true');
    } else {
        // Если ресурсы уже загружены, скрываем экран загрузки без задержки
        hideLoadingScreen();
    }
}

// Инициализация при загрузке страницы
window.onload = initPreloader;
