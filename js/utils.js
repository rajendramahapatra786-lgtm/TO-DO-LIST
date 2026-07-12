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

// ================= MUSIC =================

function isMusicEnabled() {
    return localStorage.getItem("musicEnabled") === "true";
}

function setMusicEnabled(status) {
    localStorage.setItem("musicEnabled", status);
}

function initBackgroundMusic() {

    const music = document.getElementById("bg-music");

    if (!music) return;

    // Restore previous position
    const savedTime =
        parseFloat(localStorage.getItem("musicTime")) || 0;

    music.currentTime = savedTime;

    if (isMusicEnabled()) {

        music.play().catch(() => {});

    }

    // Save current position while playing
    music.addEventListener("timeupdate", () => {

        localStorage.setItem(
            "musicTime",
            music.currentTime
        );

    });

}

// Save position before page closes
window.addEventListener("beforeunload", () => {

    const music =
        document.getElementById("bg-music");

    if (music) {

        localStorage.setItem(
            "musicTime",
            music.currentTime
        );

    }

});
