function goBack() {
  window.location.href = "index.html";
}

/* GET TASK */
const params = new URLSearchParams(window.location.search);
const taskId = Number(params.get("id"));
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const task = tasks.find(t => t.id === taskId);

if (!task) {
  alert("Task not found");
  goBack();
}

task.completed = task.completed || {};

/* ELEMENTS */
const titleEl = document.getElementById("taskTitle");
const descEl = document.getElementById("taskDesc");
const deadlineEl = document.getElementById("taskDeadline");
const catsEl = document.getElementById("taskCategories");
const weeksContainer = document.getElementById("weeksContainer");
const progressBars = document.getElementById("progressBars");

/* RENDER INFO */
function renderInfo() {
  titleEl.textContent = task.name;
  descEl.textContent = task.description || "No description";
  deadlineEl.textContent = task.deadline
    ? "⏰ " + new Date(task.deadline).toLocaleString()
    : "No deadline";

  catsEl.innerHTML = "";
  task.categories.forEach(c => {
    const span = document.createElement("span");
    span.textContent = c;
    catsEl.appendChild(span);
  });
}
renderInfo();

/* DATE HELPERS */
const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();
const daysInMonth = new Date(year, month + 1, 0).getDate();

function dateKey(day) {
  return `${year}-${month + 1}-${day}`;
}

/* WEEKLY RENDER */
function renderWeeks() {
  weeksContainer.innerHTML = "";
  progressBars.innerHTML = "";

  let week = 1;
  let completed = 0;
  let total = 0;

  let box = createWeekBox(week);

  for (let d = 1; d <= daysInMonth; d++) {
    const key = dateKey(d);
    const cell = document.createElement("div");
    cell.className = "cell";

    if (task.completed[key] === "done") {
      cell.textContent = "✔";
      cell.classList.add("done");
      cell.style.color = task.color;
      completed++;
    }

    cell.onclick = () => {
      task.completed[key] = "done";
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderWeeks();
    };

    box.days.appendChild(cell);
    total++;

    if (d % 7 === 0 || d === daysInMonth) {
      weeksContainer.appendChild(box.wrapper);

      const percent = Math.round((completed / total) * 100) || 0;
      const bar = document.createElement("div");
      bar.className = "progress-bar";
      bar.style.height = percent + "%";
      bar.textContent = percent + "%";
      progressBars.appendChild(bar);

      week++;
      completed = 0;
      total = 0;
      box = createWeekBox(week);
    }
  }
}

function createWeekBox(week) {
  const wrapper = document.createElement("div");
  wrapper.className = "week-box";

  const title = document.createElement("div");
  title.className = "week-title";
  title.textContent = `Week ${week}`;

  const days = document.createElement("div");
  days.className = "week-days";

  wrapper.appendChild(title);
  wrapper.appendChild(days);

  return { wrapper, days };
}

renderWeeks();

/* EDIT MODAL */
const modal = document.getElementById("modalOverlay");
document.getElementById("editBtn").onclick = () => modal.classList.add("show");
document.getElementById("cancelEdit").onclick = () => modal.classList.remove("show");

document.getElementById("saveEdit").onclick = () => {
  task.name = document.getElementById("editName").value || task.name;
  task.description = document.getElementById("editDesc").value;
  task.deadline = document.getElementById("editDeadline").value;
  task.color = document.getElementById("editColor").value;

  localStorage.setItem("tasks", JSON.stringify(tasks));
  modal.classList.remove("show");
  renderInfo();
};

/* DELETE */
document.getElementById("deleteBtn").onclick = () => {
  if (!confirm("Delete task?")) return;
  const index = tasks.findIndex(t => t.id === taskId);
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  goBack();
};
