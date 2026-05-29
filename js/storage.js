// Save Data
function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Get Data
function getFromStorage(key, defaultValue = []) {

    const data = localStorage.getItem(key);

    return data ? JSON.parse(data) : defaultValue;
}

// Remove Data
function removeFromStorage(key) {
    localStorage.removeItem(key);
}