/* =========================
   BACK BUTTON
========================= */
function goBack() {
  window.location.href = "index.html";
}

/* =========================
   CATEGORY
========================= */
const categoryInput = document.getElementById("categoryInput");
const categoryDropdown = document.getElementById("categoryDropdown");
const categoryText = document.getElementById("categoryText");
const selectedCount = document.getElementById("selectedCount");

let selectedCategories = [];

categoryInput.addEventListener("click", (e) => {
  e.stopPropagation();
  categoryDropdown.classList.toggle("show");
});

function toggleCategory(el, name) {
  if (el.classList.contains("selected")) {
    el.classList.remove("selected");
    selectedCategories = selectedCategories.filter(c => c !== name);
  } else {
    if (selectedCategories.length >= 3) return;
    el.classList.add("selected");
    selectedCategories.push(name);
  }

  selectedCount.textContent = selectedCategories.length || "none";
  categoryText.textContent =
    selectedCategories.join(", ") || "Select Categories";
}

/* =========================
   COLOR
========================= */
const colorInput = document.getElementById("colorInput");
const colorDropdown = document.getElementById("colorDropdown");
const colorText = document.getElementById("colorText");
const colorPreview = document.getElementById("colorPreview");
const colorDots = document.querySelectorAll(".color-dot");

let selectedColor = "violet";

colorInput.addEventListener("click", (e) => {
  e.stopPropagation();
  colorDropdown.classList.toggle("show");
});

colorDots.forEach(dot => {
  dot.addEventListener("click", (e) => {
    e.stopPropagation();
    selectedColor = dot.classList[1];
    colorPreview.className = "color-preview " + selectedColor;
    colorText.textContent = "Color – " + dot.dataset.name;
    colorDropdown.classList.remove("show");
  });
});

/* =========================
   SAVE TASK (SINGLE SOURCE)
========================= */
const createBtn = document.querySelector(".create-btn");
const taskName = document.getElementById("taskName");
const taskDesc = document.getElementById("taskDesc");
const taskDeadline = document.getElementById("taskDeadline");

createBtn.addEventListener("click", () => {
  if (!taskName.value.trim()) {
    alert("Task name is required");
    return;
  }

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const newTask = {
    id: Date.now(),
    name: taskName.value.trim(),
    description: taskDesc.value.trim(),
    deadline: taskDeadline.value || null,
    categories: selectedCategories.length ? selectedCategories : ["General"],
    color: selectedColor,
    completed: {}
  };

  tasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // ✅ BACK TO HOME
  window.location.href = "index.html";
});

/* =========================
   CLOSE DROPDOWNS
========================= */
document.addEventListener("click", () => {
  categoryDropdown.classList.remove("show");
  colorDropdown.classList.remove("show");
});
