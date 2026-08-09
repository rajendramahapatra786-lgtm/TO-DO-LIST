/* ================= TOAST ================= */

function showToast(message, type = "success") {

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.innerHTML = `<span>${message}</span>`;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 100);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);

}

/* ================= READY FUNCTIONS ================= */

function showTaskCompleted(taskName) {
    showToast(`✅ Task Completed: "${taskName}"`, "success");
}

function showTaskMissed(taskName) {
    showToast(`❌ Task Missed: "${taskName}"`, "error");
}

function showTaskWarning(taskName) {
    showToast(`⏰ 1 minute left for "${taskName}"`, "info");
}