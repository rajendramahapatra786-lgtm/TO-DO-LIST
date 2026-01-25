function goBack() {
  window.location.href = "index.html";
}

/* =========================
   GET TASK
========================= */
const params = new URLSearchParams(window.location.search);
const taskId = Number(params.get("id"));

const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const task = tasks.find(t => t.id === taskId);

if (!task) {
  alert("Task not found");
  goBack();
}

/* =========================
   ELEMENTS
========================= */
const titleEl = document.getElementById("taskTitle");
const descEl = document.getElementById("taskDesc");
const deadlineEl = document.getElementById("taskDeadline");
const catsEl = document.getElementById("taskCategories");
const monthGrid = document.getElementById("monthGrid");

/* MODAL */
const modal = document.getElementById("modalOverlay");
const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");

const editName = document.getElementById("editName");
const editDesc = document.getElementById("editDesc");
const editDeadline = document.getElementById("editDeadline");
const editColor = document.getElementById("editColor");

/* =========================
   RENDER TASK INFO
========================= */
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

/* =========================
   MONTH GRID LOGIC
========================= */
task.completed = task.completed || {};

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth();
const daysInMonth = new Date(year, month + 1, 0).getDate();

function dateKey(day) {
  return `${year}-${month + 1}-${day}`;
}

let html = `<table class="month-table"><tr><th>Day</th>`;
for (let d = 1; d <= daysInMonth; d++) html += `<th>${d}</th>`;
html += `</tr><tr><td>${task.name}</td>`;

for (let d = 1; d <= daysInMonth; d++) {
  const key = dateKey(d);
  const cellDate = new Date(year, month, d);
  const deadline = task.deadline ? new Date(task.deadline) : null;

  let state = task.completed[key];
  let locked = false;

  /* AUTO FAIL — DEADLINE */
  if (!state && deadline && now > deadline &&
      cellDate.toDateString() === deadline.toDateString()) {
    state = "fail";
    task.completed[key] = "fail";
  }

  /* AUTO FAIL — PAST DAY */
  if (!state && !deadline && cellDate < new Date(year, month, now.getDate())) {
    state = "fail";
    task.completed[key] = "fail";
  }

  if (state === "fail" || cellDate < now) locked = true;

  html += `
    <td>
      <div class="cell ${state === "fail" ? "fail locked" : ""} ${state === "done" ? "done" : ""}"
           data-day="${d}"
           style="${state === "done" ? `color:${task.color}` : ""}">
        ${state === "done" ? "✔" : state === "fail" ? "✖" : ""}
      </div>
    </td>`;
}

html += `</tr></table>`;
monthGrid.innerHTML = html;
localStorage.setItem("tasks", JSON.stringify(tasks));

/* CLICK TO COMPLETE */
document.querySelectorAll(".cell").forEach(cell => {
  cell.onclick = () => {
    if (cell.classList.contains("locked")) return;

    const d = cell.dataset.day;
    const key = dateKey(d);

    task.completed[key] = "done";
    localStorage.setItem("tasks", JSON.stringify(tasks));

    cell.textContent = "✔";
    cell.style.color = task.color;
    cell.classList.add("done");
  };
});

/* =========================
   EDIT MODAL
========================= */
editBtn.onclick = () => {
  editName.value = task.name;
  editDesc.value = task.description || "";
  editDeadline.value = task.deadline || "";
  editColor.value = task.color;
  modal.classList.add("show");
};

document.getElementById("cancelEdit").onclick = () => {
  modal.classList.remove("show");
};

document.getElementById("saveEdit").onclick = () => {
  task.name = editName.value.trim() || task.name;
  task.description = editDesc.value.trim();
  task.deadline = editDeadline.value || null;
  task.color = editColor.value;

  localStorage.setItem("tasks", JSON.stringify(tasks));
  modal.classList.remove("show");
  renderInfo();
};

/* =========================
   DELETE TASK
========================= */
deleteBtn.onclick = () => {
  if (!confirm("Delete this task permanently?")) return;

  const index = tasks.findIndex(t => t.id === taskId);
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  goBack();
};
