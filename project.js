let currentProject = 'kaia'; // Установите нужный проект по умолчанию
let currentIndex = 0; // Индекс текущего изображения

// Объект для хранения цветов фона для каждого проекта
const projectBackgroundColors = {
    'kaia': '#2E2930',
    'lush-foliage': '#000B00',
    'selected-portraits': '#47585C',
    'clutch': '#250D00',
    'aramie-lena': '#2B2B2B'
};

// Функция для загрузки изображений проекта из HTML
function loadProjectImages(project) {
    const galleryImages = document.querySelectorAll(`#image-gallery img[data-project="${project}"]`);
    return Array.from(galleryImages).map(img => img.src);
}

// Функция для загрузки проекта
function loadProject(project) {
    currentProject = project;
    currentIndex = 0; // Сброс индекса при загрузке нового проекта
    document.body.classList.add('project-page'); // Добавляем класс для страницы проекта
    changeBackgroundColor(); // Изменяем цвет фона
    updateImage(); // Обновляем изображение
}

// Функция для обновления изображения
function updateImage() {
    const projectImage = document.getElementById('project-image');
    const images = loadProjectImages(currentProject);

    if (images.length > 0) {
        // Получаем src текущего изображения из массива
        const imageSrc = images[currentIndex];
        projectImage.src = imageSrc; // Устанавливаем новое изображение
        projectImage.alt = currentProject; // Обновляем alt

        // Обновление нумерации изображения
        const imageNumber = document.getElementById('image-number');
        imageNumber.textContent = String(currentIndex + 1).padStart(3, '0'); // Форматирование номера (001, 002 и т.д.)
    }
}

// Функция для изменения цвета фона
function changeBackgroundColor() {
    document.body.style.backgroundColor = projectBackgroundColors[currentProject];
}

// Функция для показа предыдущего изображения
function showPrevious() {
    const images = loadProjectImages(currentProject);
    currentIndex = (currentIndex - 1 + images.length) % images.length; // Показать последнее изображение, если текущее первое
    updateImage();
}

// Функция для показа следующего изображения
function showNext() {
    const images = loadProjectImages(currentProject);
    currentIndex = (currentIndex + 1) % images.length; // Вернуться к первому изображению, если текущее последнее
    updateImage();
}

// Обработка кликов и касаний для переключения изображений
const handleSwitchImage = (clientX) => {
    const halfWidth = window.innerWidth / 2;
    if (clientX < halfWidth) {
        showPrevious(); // Если клик/касание по левой части экрана, показать предыдущее изображение
    } else {
        showNext(); // Если клик/касание по правой части экрана, показать следующее изображение
    }
};

// Обработка кликов
window.addEventListener('click', (e) => {
    const isLink = e.target.closest('a'); // Проверяем, является ли целевой элемент ссылкой
    if (!isLink) {
        handleSwitchImage(e.clientX); // Обработка нажатий на экран
    }
});

// Обработка касаний
window.addEventListener('touchstart', (e) => {
    const isLink = e.target.closest('a'); // Проверяем, является ли целевой элемент ссылкой
    if (isLink) return; // Если это ссылка, отменяем обработку касания

    const touch = e.touches[0]; // Получаем первое касание
    handleSwitchImage(touch.clientX); // Обработка касания
});

// Обработчики событий для кнопок "Previous" и "Next"
const previousButton = document.getElementById('previous');
const nextButton = document.getElementById('next');

if (previousButton) {
    previousButton.addEventListener('click', (e) => {
        e.preventDefault(); // Предотвращаем переход по ссылке
        showPrevious();
    });
}

if (nextButton) {
    nextButton.addEventListener('click', (e) => {
        e.preventDefault(); // Предотвращаем переход по ссылке
        showNext();
    });
}

// Обработка параметров URL
const urlParams = new URLSearchParams(window.location.search);
const projectParam = urlParams.get('project');

if (projectParam && projectBackgroundColors[projectParam]) {
    loadProject(projectParam); // Загружаем проект из URL
} else {
    loadProject('kaia'); // Загружаем проект по умолчанию
}

// Инициализация проекта при загрузке страницы
window.onload = () => {
    loadProject(currentProject); // Загрузить проект по умолчанию
};
