/* =========================
   GREETING (TIME BASED)
========================= */
const greeting = document.getElementById("greeting");

if (greeting) {
  const h = new Date().getHours();
  greeting.textContent =
    h < 12 ? "👋 Good morning buddy" :
    h < 16 ? "👋 Good afternoon buddy" :
    h < 20 ? "👋 Good evening buddy" :
             "👋 Good night buddy";
}

/* =========================
   HEADER QUOTE (TYPING + SLIDE)
========================= */
const headerQuote = document.getElementById("headerQuote");

const headerQuotes = [
  "You’re closer than you think.",
  "Small steps every day.",
  "Discipline beats motivation.",
  "Progress, not perfection."
];

let hq = 0;
let hc = 0;

function typeHeader() {
  headerQuote.textContent = headerQuotes[hq].slice(0, hc++);
  if (hc <= headerQuotes[hq].length) {
    setTimeout(typeHeader, 60);
  } else {
    setTimeout(slideHeader, 1800);
  }
}

function slideHeader() {
  headerQuote.style.transform = "translateX(-100%)";
  headerQuote.style.opacity = "0";

  setTimeout(() => {
    hc = 0;
    hq = (hq + 1) % headerQuotes.length;
    headerQuote.textContent = "";
    headerQuote.style.transition = "none";
    headerQuote.style.transform = "translateX(0)";
    headerQuote.style.opacity = "1";

    setTimeout(() => {
      headerQuote.style.transition = "all 0.5s ease";
      typeHeader();
    }, 50);
  }, 500);
}

typeHeader();

/* =========================
   CENTER MOTIVATION QUOTE
========================= */
const motivationText = document.getElementById("motivationText");

const centerQuotes = [
  "🔥 TO BECOME THE PERSON YOU WANT, YOU MUST DESTROY THE PERSON YOU ARE",
  "💪 Stop fooling yourself, you know you can do better!!"
];

let mq = 0;

function showCenterQuote() {
  motivationText.textContent = centerQuotes[mq];
  motivationText.style.transform = "translateX(0)";
  motivationText.style.opacity = "1";

  setTimeout(() => {
    motivationText.style.transform = "translateX(-100%)";
    motivationText.style.opacity = "0";

    setTimeout(() => {
      mq = (mq + 1) % centerQuotes.length;
      motivationText.style.transform = "translateX(0)";
      showCenterQuote();
    }, 600);
  }, 2500);
}

showCenterQuote();

/* =========================
   ADD TASK BUTTON (HOME)
========================= */
const addTaskBtn = document.getElementById("addTaskBtn");

if (addTaskBtn) {
  addTaskBtn.onclick = () => {
    window.location.href = "add-task.html";
  };
}

/* =========================
   LOAD TASKS ON HOME
========================= */
const taskList = document.getElementById("taskList");
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

if (!taskList) {
  console.error("taskList container missing in index.html");
} else if (tasks.length === 0) {
  taskList.innerHTML = `<div class="no-task">No tasks yet</div>`;
} else {
  taskList.innerHTML = "";

  tasks.forEach(task => {
    if (!task || !task.id || !task.name) return;

    const card = document.createElement("div");
    card.className = `task-card ${task.color || ""}`;

    card.innerHTML = `
      <div class="task-title">${task.name}</div>
      ${task.description ? `<div class="task-desc">${task.description}</div>` : ""}
      ${task.deadline ? `<div class="task-deadline">⏰ ${new Date(task.deadline).toLocaleString()}</div>` : ""}
      <div class="task-meta">
        ${(task.categories || []).map(c =>
          `<span class="task-pill">${c}</span>`
        ).join("")}
      </div>
    `;

    card.onclick = () => {
      window.location.href = `task.html?id=${task.id}`;
    };

    taskList.appendChild(card);
  });
}
