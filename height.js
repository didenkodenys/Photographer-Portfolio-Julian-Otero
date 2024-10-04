function setFullHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Set the value on page load
setFullHeight();

// Update the value on window resize
window.addEventListener('resize', setFullHeight);