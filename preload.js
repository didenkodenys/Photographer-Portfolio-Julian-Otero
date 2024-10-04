document.addEventListener('DOMContentLoaded', () => {
    const imageContainers = document.querySelectorAll('.image-container, #image-gallery'); // Find both containers
    const loadingScreen = document.getElementById('loading-screen');
    const loadingText = document.getElementById('loading-text');
    let loadedImagesCount = 0;
    let totalImagesCount = 0;

    // Check for the presence of containers
    if (imageContainers.length === 0) {
        return; // If there are no containers, just exit the function
    }

    // Count the total number of images in both containers
    imageContainers.forEach(container => {
        const images = container.querySelectorAll('img'); // Find all images in the current container
        totalImagesCount += images.length; // Increase the total number of images

        if (images.length === 0) {
            return; // If there are no images in the container, just continue
        }

        // Check if all images in the container are loaded
        const allImagesLoaded = Array.from(images).every(img => img.complete);

        if (allImagesLoaded) {
            // If all images are already loaded, increase the counter
            loadedImagesCount += images.length;
            return; // Exit the function for this container
        } else {
            // Show the loading screen if not all images are loaded
            loadingScreen.style.display = 'flex';
        }

        images.forEach((img) => {
            img.onload = () => {
                loadedImagesCount++;
                // Update loading text
                loadingText.textContent = Math.round((loadedImagesCount / totalImagesCount) * 100) + '%';
                if (loadedImagesCount === totalImagesCount) {
                    // All images are loaded
                    loadingText.textContent = '100%'; // Set text to 100%
                    // Hide the loading screen immediately after loading
                    loadingScreen.style.display = 'none';
                }
            };

            img.onerror = () => {
                loadedImagesCount++;
                // Update loading text in case of an error
                loadingText.textContent = Math.round((loadedImagesCount / totalImagesCount) * 100) + '%';
                if (loadedImagesCount === totalImagesCount) {
                    // If some images failed to load, hide the loading screen
                    loadingScreen.style.display = 'none'; // Hide the loading screen
                }
            };

            // Start loading images
            img.src = img.src; // This is needed for the onload event to fire
        });
    });

    // If there are no images to load, hide the loading screen
    if (totalImagesCount === 0) {
        loadingScreen.style.display = 'none';
    }
});