let currentProject = 'kaia'; // Set the desired default project
let currentIndex = 0; // Index of the current image
let isTouchDevice = false; // Flag to check for touch device

// Object to store background colors for each project
const projectBackgroundColors = {
    'kaia': '#2E2930',
    'lush-foliage': '#000B00',
    'the-four-regards': '#47585C',
    'clutch': '#250D00',
    'aramie-lena': '#2B2B2B'
};

// Function to load project images from HTML
function loadProjectImages(project) {
    const galleryImages = document.querySelectorAll(`#image-gallery img[data-project="${project}"]`);
    return Array.from(galleryImages).map(img => img.src);
}

// Function to load the project
function loadProject(project) {
    currentProject = project;
    currentIndex = 0; // Reset index when loading a new project
    document.body.classList.add('project-page'); // Add class for project page
    changeBackgroundColor(); // Change background color
    updateImage(); // Update image
}

// Function to update the image
function updateImage() {
    const projectImage = document.getElementById('project-image');
    const images = loadProjectImages(currentProject);

    if (images.length > 0) {
        // Get src of the current image from the array
        const imageSrc = images[currentIndex];
        projectImage.src = imageSrc; // Set the new image
        projectImage.alt = currentProject; // Update alt text

        // Update image numbering
        const imageNumber = document.getElementById('image-number');
        imageNumber.textContent = String(currentIndex + 1).padStart(3, '0'); // Format the number (001, 002, etc.)
    }
}

// Function to change the background color
function changeBackgroundColor() {
    document.body.style.backgroundColor = projectBackgroundColors[currentProject];
}

// Function to show the previous image
function showPrevious() {
    const images = loadProjectImages(currentProject);
    currentIndex = (currentIndex - 1 + images.length) % images.length; // Show the last image if the current is the first
    updateImage();
}

// Function to show the next image
function showNext() {
    const images = loadProjectImages(currentProject);
    currentIndex = (currentIndex + 1) % images.length; // Go back to the first image if the current is the last
    updateImage();
}

// Handling clicks and touches to switch images
const handleSwitchImage = (clientX) => {
    const halfWidth = window.innerWidth / 2;
    if (clientX < halfWidth) {
        showPrevious(); // If clicked/touched on the left side of the screen, show the previous image
    } else {
        showNext(); // If clicked/touched on the right side of the screen, show the next image
    }
};

// Handling clicks
window.addEventListener('click', (e) => {
    if (isTouchDevice) return; // If it's a touch device, ignore clicks
    const isLink = e.target.closest('a'); // Check if the target element is a link
    if (!isLink) {
        handleSwitchImage(e.clientX); // Handle screen taps
    }
});

// Handling touches
window.addEventListener('touchstart', (e) => {
    isTouchDevice = true; // Set the flag that the device supports touch
    const isLink = e.target.closest('a'); // Check if the target element is a link
    if (isLink) return; // If it's a link, cancel touch handling

    const touch = e.touches[0]; // Get the first touch
    handleSwitchImage(touch.clientX); // Handle touch
});

// Event handlers for "Previous" and "Next" buttons
// const previousButton = document.getElementById('previous');
// const nextButton = document.getElementById('next');

// if (previousButton) {
//     previousButton.addEventListener('click', (e) => {
//         e.preventDefault(); // Prevent the link from being followed
//         showPrevious();
//     });
// }

// if (nextButton) {
//     nextButton.addEventListener('click', (e) => {
//         e.preventDefault(); // Prevent the link from being followed
//         showNext();
//     });
// }

// Handling URL parameters
const urlParams = new URLSearchParams(window.location.search);
const projectParam = urlParams.get('project');

if (projectParam && projectBackgroundColors[projectParam]) {
    loadProject(projectParam); // Load project from URL
} else {
    loadProject('kaia'); // Load the default project
}

// Initialize the project when the page loads
window.onload = () => {
    loadProject(currentProject); // Load the default project
};