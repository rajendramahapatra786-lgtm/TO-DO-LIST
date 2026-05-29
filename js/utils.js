// // Generate Unique ID
function generateID() {
    return crypto.randomUUID();
}

// Capitalize First Letter
function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

// Format Date
function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

// Play Audio
function playSound(soundId) {
    const sound = document.getElementById(soundId);

    if (sound) {
        sound.currentTime = 0;
        sound.play();
    }
}
