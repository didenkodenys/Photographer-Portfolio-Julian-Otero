const projectData = {
    'kaia': {
        title: 'Kaia',
        images: ['images/image1.jpg', 'images/image2.jpg', 'images/image3.jpg']
    },
    'lush-foliage': {
        title: 'Lush Foliage',
        images: ['images/image4.jpg', 'images/image5.jpg', 'images/image6.jpg', 'images/image7.jpg', 'images/image8.jpg', 'images/image9.jpg', 'images/image10.jpg', 'images/image11.jpg']
    },
    'selected-portraits': {
        title: 'Selected Portraits',
        images: ['images/image12.jpg', 'images/image13.jpg', 'images/image14.jpg', 'images/image15.jpg', 'images/image16.jpg']
    },
    'clutch': {
        title: 'Clutch',
        images: ['images/image17.jpg', 'images/image18.jpg', 'images/image19.jpg', 'images/image20.jpg']
    },
    'aramie-lena': {
        title: 'Aramie & Lena',
        images: ['images/image21.jpg', 'images/image22.jpg', 'images/image23.jpg', 'images/image24.jpg', 'images/image25.jpg']
    }
};

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

let touchHandled = false; // Флаг для отслеживания обработки касания

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
    const images = projectData[currentProject].images;

    if (images.length > 0) {
        // Получаем src текущего изображения из массива
        const imageSrc = images[currentIndex];
        projectImage.src = imageSrc; // Устанавливаем новое изображение
        projectImage.alt = projectData[currentProject].title; // Обновляем alt

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
    const images = projectData[currentProject].images;
    currentIndex = (currentIndex - 1 + images.length) % images.length; // Показать последнее изображение, если текущее первое
    updateImage();
}

// Функция для показа следующего изображения
function showNext() {
    const images = projectData[currentProject].images;
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
    if (touchHandled) {
        touchHandled = false; // Сбрасываем флаг
        return; // Пропускаем обработку клика, если уже произошло касание
    }

    const isLink = e.target.closest('a'); // Проверяем, является ли целевой элемент ссылкой

    if (!isLink) {
        handleSwitchImage(e.clientX); // Обработка нажатий на экран
    }
});

// Обработка касаний
window.addEventListener('touchstart', (e) => {
    const isLink = e.target.closest('a'); // Проверяем, является ли целевой элемент ссылкой
    if (isLink) return; // Если это ссылка, отменяем обработку касания

    touchHandled = true; // Устанавливаем флаг, что касание произошло
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

if (projectParam && projectData[projectParam]) {
    loadProject(projectParam); // Загружаем проект из URL
} else {
    loadProject('kaia'); // Загружаем проект по умолчанию
}

// Инициализация проекта при загрузке страницы
window.onload = () => {
    loadProject(currentProject); // Загрузить проект по умолчанию
};
