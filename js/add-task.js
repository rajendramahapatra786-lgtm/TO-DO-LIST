/* =========================
   BACK
========================= */
function goBack() {
  window.location.href = "../index.html";
}

/* =========================
   MODIFY CATEGORIES BUTTON
========================= */
function goToCategories() {
  window.location.href = "categories.html";
}

/* =========================
   ENSURE CATEGORIES EXIST
========================= */
function ensureCategoriesExist() {
const existing = getFromStorage("categories");
  if (existing && existing.length) return;

  const defaults = [
    { id: 1, name: "Work", emoji: "🏢", color: "blue", starred: false },
    { id: 2, name: "Coding", emoji: "💻", color: "violet", starred: false },
    { id: 3, name: "Health/Fitness", emoji: "💪", color: "yellow", starred: false },
    { id: 4, name: "Education", emoji: "📚", color: "orange", starred: false },
    { id: 5, name: "Personal", emoji: "👤", color: "pink", starred: false }
  ];

saveToStorage("categories", defaults);}
ensureCategoriesExist();

/* =========================
   CATEGORY DROPDOWN
========================= */
const categoryInput = document.getElementById("categoryInput");
const categoryDropdown = document.getElementById("categoryDropdown");
const categoryText = document.getElementById("categoryText");
const selectedCount = document.getElementById("selectedCount");
const categoryScroll = document.querySelector(".category-scroll");

let selectedCategories = [];

categoryInput.addEventListener("click", e => {
  e.stopPropagation();
  categoryDropdown.classList.toggle("show");
});

/* =========================
   ⭐ RENDER CATEGORIES (STAR SYNC)
========================= */
function renderCategoryList() {
  categoryScroll.innerHTML = "";

  let categories = JSON.parse(localStorage.getItem("categories")) || [];

  // ⭐ starred first
  const starred = categories.filter(c => c.starred);
  const normal = categories.filter(c => !c.starred);
  const ordered = [...starred, ...normal];

  ordered.forEach(cat => {
    const div = document.createElement("div");
    div.className = `category-item ${cat.color}`;

    // ⭐ show star only if starred
    const starIcon = cat.starred ? "⭐ " : "";

    div.textContent = `${starIcon}${cat.emoji} ${cat.name}`;

    div.onclick = () => toggleCategory(div, cat.name);

    categoryScroll.appendChild(div);
  });

  // MODIFY BUTTON always at bottom
  const modifyBtn = document.createElement("button");
  modifyBtn.type = "button";
  modifyBtn.className = "modify-btn";
  modifyBtn.textContent = "✏ MODIFY CATEGORIES";
  modifyBtn.onclick = goToCategories;

  categoryScroll.appendChild(modifyBtn);
}

renderCategoryList();

/* =========================
   TOGGLE CATEGORY (MAX 3)
========================= */
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
   COLOR DROPDOWN
========================= */
const colorInput = document.getElementById("colorInput");
const colorDropdown = document.getElementById("colorDropdown");
const colorText = document.getElementById("colorText");
const colorPreview = document.getElementById("colorPreview");
const colorDots = document.querySelectorAll(".color-dot");

let selectedColor = "violet";

colorInput.addEventListener("click", e => {
  e.stopPropagation();
  colorDropdown.classList.toggle("show");
});

colorDots.forEach(dot => {
  dot.addEventListener("click", e => {
    e.stopPropagation();
    selectedColor = dot.classList[1];
    colorPreview.className = "color-preview " + selectedColor;
    colorText.textContent = "Color – " + dot.dataset.name;
    colorDropdown.classList.remove("show");
  });
});

/* =========================
   EMOJI PICKER (UNCHANGED)
========================= */
const emojiData = {
  smileys: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "😊", "😍", "😎", "🙂"],
  exercise: ["🏃", "🏋️", "🤸", "🚴", "🧘"],
  study: ["📚", "📖", "✏️", "🧠", "🎓"]
};

const emojiBar = document.getElementById("emojiBar");
const emojiGrid = document.getElementById("emojiGrid");
const taskEmoji = document.getElementById("taskEmoji");

let selectedEmoji = "🙂";

function toggleEmojiBar() {

  const emojiBar =
    document.getElementById("emojiBar");

  if (emojiBar) {
    emojiBar.classList.toggle("hidden");
  }

}

function showCategory(cat) {
  emojiGrid.innerHTML = "";
  emojiData[cat].forEach(e => {
    const span = document.createElement("span");
    span.textContent = e;
    span.onclick = () => {
      selectedEmoji = e;
      taskEmoji.textContent = e;
      emojiBar.classList.add("hidden");
    };
    emojiGrid.appendChild(span);
  });
}
showCategory("smileys");

/* =========================
   SAVE TASK
========================= */
document.querySelector(".create-btn").addEventListener("click", () => {
  const name = document.getElementById("taskName").value.trim();
  if (!name) {
showToast("Task name is required", "error");
    return;
  }

  const tasks = getFromStorage("tasks");

  tasks.push({
id: generateID(),
    name,
    description: document.getElementById("taskDesc").value.trim(),
    deadline: document.getElementById("taskDeadline").value || null,
    categories: selectedCategories.length ? selectedCategories : ["General"],
    color: selectedColor,
    emoji: selectedEmoji,
    completed: false
  });

  saveToStorage("tasks", tasks);

  window.location.href = "../index.html";
});

/* =========================
   CLOSE DROPDOWNS
========================= */
document.addEventListener("click", () => {
  if (categoryDropdown) categoryDropdown.classList.remove("show");
  if (colorDropdown) colorDropdown.classList.remove("show");
});
/* =========================
   MUSIC (START ON FIRST CLICK)
========================= */
document.addEventListener("click", () => {
  const music = document.getElementById("bg-music");
  if (music && music.paused) {
    music.play().catch(() => { });
  }
}, { once: true });