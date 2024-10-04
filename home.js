const imageContainer = document.querySelector('.image-container');
const totalImages = 25; // Total number of images
let currentImageIndex = 0; // Index of the current image
let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints; // Check for a touch device
let cursorElement;
let lastX, lastY; // Previous cursor coordinates
let lastMouseX, lastMouseY; // Previous mouse coordinates for desktop

// Speed settings
const minSpeed = 10; // Minimum speed
const maxSpeed = 20; // Maximum speed
const imageGenerationThreshold = 20; // Image generation threshold (in pixels)

// Array to store all images from HTML
const images = Array.from(imageContainer.querySelectorAll('img')); // Get all images from the container

// Array to store the last shown images
const lastShownImages = [];

// Function to display the next random image
function showNextImage(x, y) {
    let randomIndex;

    // Generate a new index until an image can be shown
    do {
        randomIndex = Math.floor(Math.random() * totalImages); // Generate a random index
    } while (lastShownImages.includes(randomIndex)); // Check that the image is not in the last 10

    const img = images[randomIndex]; // Get the image by random index
    const imgClone = img.cloneNode(true); // Clone the image
    imgClone.style.position = 'absolute'; // Positioning images
    imgClone.style.left = `${x - imgClone.clientWidth / 2}px`; // Center horizontally
    imgClone.style.top = `${y - imgClone.clientHeight / 2}px`; // Center vertically
    imgClone.style.display = 'block'; // Show the image

    imageContainer.appendChild(imgClone); // Add the image to the container

    // If on a touch device, check the number of images
    if (isTouchDevice) {
        const currentImages = imageContainer.querySelectorAll('img');
        if (currentImages.length > 25) {
            removeOldestImage(); // Remove the oldest image if there are more than 25
        }
    }

    // Add the current index to the array of last shown images
    lastShownImages.push(randomIndex);

    // If there are more than 10 elements in the array, remove the first (oldest)
    if (lastShownImages.length > 10) {
        lastShownImages.shift();
    }
}

// Function to remove the oldest image
function removeOldestImage() {
    const images = imageContainer.querySelectorAll('img');
    if (images.length > 0) {
        images[0].remove(); // Remove the oldest image
    }
}

let cursorDirectionX = Math.random() * 2 - 1; // Random direction on X (from -1 to 1)
let cursorDirectionY = Math.random() * 2 - 1; // Random direction on Y (from -1 to 1)

// Function to move the simulated cursor
function moveCursor() {
    if (isTouchDevice && cursorElement) {
        const speed = Math.random() * (maxSpeed - minSpeed) + minSpeed; // Random speed in range
        const newX = parseFloat(cursorElement.style.left) + cursorDirectionX * speed; // Update position on X
        const newY = parseFloat(cursorElement.style.top) + cursorDirectionY * speed; // Update position on Y

        // Check screen boundaries
        if (newX < 0 || newX + cursorElement.clientWidth > window.innerWidth) {
            cursorDirectionX = -cursorDirectionX; // Change direction on X
            cursorDirectionY = Math.random() * 2 - 1; // New random direction on Y
        }
        if (newY < 0 || newY + cursorElement.clientHeight > window.innerHeight) {
            cursorDirectionY = -cursorDirectionY; // Change direction on Y
            cursorDirectionX = Math.random() * 2 - 1; // New random direction on X
        }

        // Update cursor position
        cursorElement.style.left = `${Math.max(0, Math.min(newX, window.innerWidth - cursorElement.clientWidth))}px`;
        cursorElement.style.top = `${Math.max(0, Math.min(newY, window.innerHeight - cursorElement.clientHeight))}px`;

        // Check distance moved
        const distance = Math.sqrt(Math.pow(newX - lastX, 2) + Math.pow(newY - lastY, 2));
        if (distance >= imageGenerationThreshold) {
            // Display the next image at the cursor center
            showNextImage(newX + cursorElement.clientWidth / 2, newY + cursorElement.clientHeight / 2);
            lastX = newX; // Update previous coordinates
            lastY = newY;
        }
    }

    requestAnimationFrame(moveCursor); // Continue animation
}

// Initialization on page load
if (isTouchDevice) {
    initCursor(); // Start cursor simulation on touch devices
} else {
    lastMouseX = window.innerWidth / 2; // Set initial position for the mouse
    lastMouseY = window.innerHeight / 2;
}

// Initialize cursor simulation
function initCursor() {
    cursorElement = document.createElement('div');
    cursorElement.style.position = 'fixed';
    cursorElement.style.width = '20px'; // Width of the cursor simulation
    cursorElement.style.height = '20px'; // Height of the cursor simulation
    cursorElement.style.pointerEvents = 'none'; // Make sure simulation does not block events
    cursorElement.style.backgroundColor = 'transparent'; // Make it transparent

    // Set the initial position of the cursor in the center of the window
    cursorElement.style.left = `${window.innerWidth / 2}px`;
    cursorElement.style.top = `${window.innerHeight / 2}px`;

    document.body.appendChild(cursorElement);
    lastX = parseFloat(cursorElement.style.left);
    lastY = parseFloat(cursorElement.style.top);
    moveCursor(); // Start moving
}

// Function to remove images
function removeImages() {
    const images = imageContainer.querySelectorAll('img');
    images.forEach((img) => {
        img.remove(); // Remove the image
    });
}

// Click event handler
document.addEventListener('click', () => {
    removeImages(); // Remove all images on click
    currentImageIndex = 0; // Reset the index
    lastShownImages.length = 0; // Clear the array of last shown images
    // Generate a new random direction for the cursor
    cursorDirectionX = Math.random() * 2 - 1; // New random direction on X
    cursorDirectionY = Math.random() * 2 - 1; // New random direction on Y
});

// Mouse movement event handler for desktop
document.addEventListener('mousemove', (event) => {
    const x = event.clientX;
    const y = event.clientY;

    // Check the distance moved by the mouse
    const distance = Math.sqrt(Math.pow(x - lastMouseX, 2) + Math.pow(y - lastMouseY, 2));
    if (distance >= imageGenerationThreshold) {
        showNextImage(x, y); // Display the next image
        lastMouseX = x; // Update previous mouse coordinates
        lastMouseY = y;
    }
});