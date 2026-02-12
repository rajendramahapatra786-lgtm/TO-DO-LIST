function goBack() {
  window.location.href = "../index.html";
}

/* ================= GET TASK ================= */
const params = new URLSearchParams(window.location.search);
const taskId = Number(params.get("id"));
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const task = tasks.find(t => t.id === taskId);

if (!task) {
  alert("Task not found");
  goBack();
}

task.completed = task.completed || {};
task.color = task.color || "#6366f1";

/* ================= ELEMENTS ================= */
const taskHeader = document.getElementById("taskHeader");
const weeksContainer = document.getElementById("weeksContainer");

const taskTitle = document.getElementById("taskTitle");
const taskDesc = document.getElementById("taskDesc");
const taskDeadline = document.getElementById("taskDeadline");
const taskCategories = document.getElementById("taskCategories");

const completion = document.getElementById("completion");
const consistency = document.getElementById("consistency");
const streak = document.getElementById("streak");
const missed = document.getElementById("missed");
const performanceLevel = document.getElementById("performanceLevel");

const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");
const modalOverlay = document.getElementById("modalOverlay");

const editName = document.getElementById("editName");
const editDesc = document.getElementById("editDesc");
const editDeadline = document.getElementById("editDeadline");
const editColor = document.getElementById("editColor");
const saveEdit = document.getElementById("saveEdit");
const cancelEdit = document.getElementById("cancelEdit");

/* ================= INFO ================= */
taskTitle.textContent = task.name;
taskDesc.textContent = task.description || "No description";
taskDeadline.textContent = task.deadline
  ? "⏰ " + new Date(task.deadline).toLocaleString()
  : "No deadline";

/* HEADER COLOR */
taskHeader.style.background =
  `linear-gradient(90deg, ${task.color}, #00000066)`;

/* CATEGORIES */
if (task.categories && task.categories.length) {
  task.categories.forEach(c => {
    const span = document.createElement("span");
    span.textContent = c;
    taskCategories.appendChild(span);
  });
}

/* ================= DATE HELPERS ================= */
const startDate = task.deadline ? new Date(task.deadline) : new Date();
startDate.setHours(0, 0, 0, 0);

const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function dateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/* ================= DAILY AUTO FAIL (FIXED LOGIC) ================= */
function checkDailyExpiry() {
  if (!task.deadline) return;

  const now = new Date();
  const deadline = new Date(task.deadline);

  const deadlineKey = dateKey(deadline);

  if (
    now > deadline &&
    task.completed[deadlineKey] !== "done"
  ) {
    task.completed[deadlineKey] = "fail";
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

/* ================= AUTO FAIL (PAST DAYS) ================= */
function autoFail() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const key in task.completed) {
    const [y, m, d] = key.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    if (date < today && task.completed[key] !== "done") {
      task.completed[key] = "fail";
    }
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* ================= RENDER WEEKS ================= */
function renderWeeks() {
  weeksContainer.innerHTML = "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const aligned = new Date(startDate);
  const wd = aligned.getDay();
  aligned.setDate(aligned.getDate() + (wd === 0 ? -6 : 1 - wd));

  let cur = new Date(aligned);

  for (let w = 1; w <= 4; w++) {
    const card = document.createElement("div");
    card.className = "week-card";

    card.innerHTML = `<div class="week-title">Week ${w}</div>`;

    const names = document.createElement("div");
    names.className = "day-names";
    dayNames.forEach(d => names.innerHTML += `<div>${d}</div>`);

    const boxes = document.createElement("div");
    boxes.className = "day-boxes";

    for (let i = 0; i < 7; i++) {
      const box = document.createElement("div");
      box.className = "day";

      const key = dateKey(cur);
      const isFuture = cur > today;
      const isBeforeStart = cur < startDate;

      if (task.completed[key] === "done") {
        box.innerHTML = "✔";
        box.classList.add("done");
      }
      else if (task.completed[key] === "fail") {
        box.innerHTML = "✖";
        box.classList.add("fail", "locked");
      }

      if (isFuture || isBeforeStart || task.completed[key] === "fail") {
        box.classList.add("locked");
      } else {
        box.onclick = () => {
          if (!task.completed[key]) task.completed[key] = "done";
          else if (task.completed[key] === "done") task.completed[key] = "fail";
          else delete task.completed[key];

          autoFail();
          renderWeeks();
          calculateReport();
        };
      }

      boxes.appendChild(box);
      cur.setDate(cur.getDate() + 1);
    }

    card.append(names, boxes);
    weeksContainer.appendChild(card);
  }
}

/* ================= REPORT ================= */
function calculateReport() {
  let done = 0, fail = 0, streakCount = 0;
  const keys = Object.keys(task.completed).sort();

  keys.forEach(k => {
    if (task.completed[k] === "done") done++;
    if (task.completed[k] === "fail") fail++;
  });

  for (let i = keys.length - 1; i >= 0; i--) {
    if (task.completed[keys[i]] === "done") streakCount++;
    else break;
  }

  const total = done + fail;
  const percent = total ? Math.round((done / total) * 100) : 0;

  completion.textContent = percent + "%";
  consistency.textContent = percent + "%";
  streak.textContent = streakCount;
  missed.textContent = fail;

  performanceLevel.textContent =
    percent >= 90 ? "🏆 LEGEND MODE" :
      percent >= 70 ? "🔥 BEAST MODE" :
        percent >= 50 ? "💪 TRAINING MODE" :
          "🚶 BEGINNER MODE";
}

/* ================= INIT ================= */
checkDailyExpiry();
autoFail();
renderWeeks();
calculateReport();

/* Real-time checking every minute */
setInterval(() => {
  checkDailyExpiry();
  renderWeeks();
  calculateReport();
}, 60000);

/* ================= EDIT ================= */
editBtn.onclick = () => {
  editName.value = task.name;
  editDesc.value = task.description || "";
  editDeadline.value = task.deadline
    ? new Date(task.deadline).toISOString().slice(0, 16)
    : "";
  editColor.value = task.color;
  modalOverlay.classList.add("show");
};

cancelEdit.onclick = () => modalOverlay.classList.remove("show");

saveEdit.onclick = () => {
  task.name = editName.value;
  task.description = editDesc.value;
  task.deadline = editDeadline.value;
  task.color = editColor.value;

  localStorage.setItem("tasks", JSON.stringify(tasks));
  location.reload();
};

/* ================= DELETE ================= */
deleteBtn.onclick = () => {
  if (!confirm("Delete task?")) return;
  const index = tasks.findIndex(t => t.id === taskId);
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  goBack();
};