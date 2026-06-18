/* GREETING */
const greeting = document.getElementById("greeting");

if (greeting) {
  const h = new Date().getHours();
  greeting.textContent =
    h < 12 ? "👋 Good morning buddy" :
      h < 16 ? "👋 Good afternoon buddy" :
        h < 20 ? "👋 Good evening buddy" :
          "👋 Good night buddy";
}

/* HEADER QUOTES */
const headerQuote = document.getElementById("headerQuote");

const headerQuotes = [
  "You’re closer than you think.",
  "Small steps every day.",
  "Discipline beats motivation.",
  "Progress, not perfection."
];

let hq = 0, hc = 0;

function typeHeader() {
  if (!headerQuote) return;

  headerQuote.textContent = headerQuotes[hq].slice(0, hc++);
  if (hc <= headerQuotes[hq].length) {
    setTimeout(typeHeader, 60);
  } else {
    setTimeout(slideHeader, 1800);
  }
}

function slideHeader() {
  if (!headerQuote) return;

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

/* CENTER MOTIVATION */
const motivationText = document.getElementById("motivationText");

const centerQuotes = [
  "🔥 TO BECOME THE PERSON YOU WANT, YOU MUST DESTROY THE PERSON YOU ARE",
  "💪 Stop fooling yourself, you know you can do better!!"
];

let mq = 0;

function showCenterQuote() {
  if (!motivationText) return;

  motivationText.textContent = centerQuotes[mq];
  motivationText.style.opacity = "1";

  setTimeout(() => {
    motivationText.style.opacity = "0";
    mq = (mq + 1) % centerQuotes.length;
    setTimeout(showCenterQuote, 600);
  }, 2500);
}

showCenterQuote();

/* ADD TASK */
const addTaskBtn = document.getElementById("addTaskBtn");
if (addTaskBtn) {
  addTaskBtn.onclick = () => {
    window.location.href = "pages/add-task.html";
  };
}

/* LOAD TASKS */
const taskList = document.getElementById("taskList");

const tasks = getFromStorage("tasks");

function getTaskStatus(task) {

  if (
    !task.completed ||
    task.completed === false ||
    Object.keys(task.completed).length === 0
  ) {
    return {
      text: "PENDING",
      className: "pending"
    };
  }

  let done = 0;
  let fail = 0;
  let total = 0;

  Object.values(task.completed).forEach(val => {
    total++;

    if (val === "done") done++;
    if (val === "fail") fail++;
  });

  // all completed
  if (done > 0 && done === total) {
    return {
      text: "COMPLETED",
      className: "completed"
    };
  }

  // failed task
  if (fail > 0 && done === 0) {
    return {
      text: "FAILED",
      className: "failed"
    };
  }

  // some progress
  if (done > 0) {
    return {
      text: "IN PROGRESS",
      className: "progress"
    };
  }

  return {
    text: "PENDING",
    className: "pending"
  };
}

if (taskList) {
  if (tasks.length === 0) {
    taskList.innerHTML = `
      <div class="no-task">
        🚀 No tasks yet<br>
        Click <b>+</b> to start
      </div>`;
  } else {
    tasks.forEach(task => {
      const status = getTaskStatus(task);
      if (!task?.id || !task?.name) return;

      const card = document.createElement("div");
      card.className = `task-card slide-up ${task.color || ""}`;

      card.innerHTML = `

  <!-- TOP -->
  <div class="task-top">

    <h3 class="task-name">
      📌 ${task.name}
    </h3>

    <div class="task-status ${status.className}">
  ${status.text}
</div>

  </div>

  <!-- DESCRIPTION -->
  <p class="task-desc">
    ${task.description || "No description"}
  </p>

  <!-- CATEGORY -->
  <div class="task-categories">
    ${(task.categories || [])
          .map(c => `<span class="task-pill">${c}</span>`)
          .join("")}
  </div>

  <!-- DEADLINE -->
  <div class="task-deadline">
    ${task.deadline
          ? `⏰ ${new Date(task.deadline).toLocaleString()}`
          : "No deadline"
        }
  </div>

  <!-- PROGRESS -->
  <div class="progress-wrapper">

    <div class="progress-bar">
      <div class="progress-fill" style="width:75%;"></div>
    </div>

    <span class="progress-text">75%</span>

  </div>

  <!-- FOOTER -->
  <div class="task-footer">

    <div class="streak">
      🔥 6 Day Streak
    </div>

  </div>
`;

      card.onclick = () => {
        window.location.href = `pages/task.html?id=${task.id}`;
      };

      taskList.appendChild(card);
    });
  }
}


const music = document.getElementById("bg-music");
const btn = document.getElementById("musicBtn");

// restore state
if (music && btn) {

  let musicState = getFromStorage("music", "off");

  if (musicState === "on") {
    music.play().catch(() => { });
    btn.textContent = "🔇";
  }

  // toggle play / mute
  btn.addEventListener("click", () => {
    if (music.paused) {
      music.play();
      saveToStorage("music", "on");
      btn.textContent = "🔇";
    } else {
      music.pause();
      music.currentTime = 0; // STOP completely
      saveToStorage("music", "off");
      btn.textContent = "🎵";

    }
  });
}


/* DEADLINE NOTIFICATION SYSTEM */

setInterval(() => {

  const tasks = getFromStorage("tasks");

  const now = new Date().getTime();

  tasks.forEach(task => {

    // skip if no deadline
    if (!task.deadline) return;

    const deadline =
      new Date(task.deadline).getTime();

    const diff = deadline - now;

    /* ⏰ 1 MINUTE WARNING */
    if (
      diff > 0 &&
      diff <= 60000 &&
      !task.completed &&
      !task.warningShown
    ) {

      showToast(
        `⏰ 1 minute left for "${task.name}"`,
        "info"
      );

      task.warningShown = true;

      saveToStorage("tasks", tasks);
    }

    /* ❌ TASK MISSED */
    if (
      diff < -60000 &&
      !task.completed &&
      !task.missedShown
    ) {

      showToast(
        `❌ Task Missed: "${task.name}"`,
        "error"
      );

      task.missedShown = true;

      saveToStorage("tasks", tasks);
    }

    /* ✅ TASK COMPLETED */
    if (
      task.completed &&
      !task.successShown
    ) {

      showToast(
        `✅ Task Completed: "${task.name}"`,
        "success"
      );

      task.successShown = true;

      saveToStorage("tasks", tasks);
    }

  });

}, 5000);