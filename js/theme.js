// Apply Theme
function setTheme(theme) {

    document.body.setAttribute("data-theme", theme);

    localStorage.setItem("theme", theme);
}

// Load Saved Theme
function loadTheme() {

    const savedTheme = localStorage.getItem("theme") || "dark";

    setTheme(savedTheme);
}

loadTheme();

const themeSwitcher = document.getElementById("themeSwitcher");

if (themeSwitcher) {

    themeSwitcher.value =
        localStorage.getItem("theme") || "dark";

    themeSwitcher.addEventListener("change", (e) => {
        setTheme(e.target.value);
    });
}