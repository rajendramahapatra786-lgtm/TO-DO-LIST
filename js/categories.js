let categories = getFromStorage("categories");
let editId = null;
let selectedColor = "violet";
let selectedEmoji = "🙂";

/* RENDER */
function renderCategories() {
  const list = document.getElementById("categoryList");
  list.innerHTML = "";

  // ⭐ starred categories always on top
  const starred = categories.filter(c => c.starred);
  const normal = categories.filter(c => !c.starred);
  const ordered = [...starred, ...normal];

  ordered.forEach(cat => {
    const div = document.createElement("div");
    div.className = `category-item ${cat.color}`;

    // ⭐ FIX: empty vs filled star
    const starIcon = cat.starred ? "⭐" : "☆";

    div.innerHTML = `
      <div class="category-left">${cat.emoji} ${cat.name}</div>
      <div class="category-actions">
        <button onclick="starCat(${cat.id})">${starIcon}</button>
        <button onclick="editCat(${cat.id})">✏</button>
        <button onclick="deleteCat(${cat.id})">🗑</button>
      </div>
    `;
    list.appendChild(div);
  });
}
renderCategories();

/* SAVE */
function saveCategory() {
  const name = document.getElementById("catName").value.trim();
  if (!name) {
    showToast("Category name required", "error");
    return;
  }
  if (editId) {
    const c = categories.find(c => c.id === editId);
    c.name = name;
    c.color = selectedColor;
    c.emoji = selectedEmoji;
  } else {
    categories.push({
      id: generateID(),
      name,
      color: selectedColor,
      emoji: selectedEmoji,
      starred: false
    });
  }

  saveToStorage("categories", categories);
  window.location.href = "add-task.html";
}

/* EDIT */
function editCat(id) {
  const c = categories.find(c => c.id === id);
  editId = id;
  document.getElementById("catName").value = c.name;
  document.getElementById("catEmoji").textContent = c.emoji;
  selectColor(c.color, c.color);
}

/* DELETE */
function deleteCat(id) {
  if (!confirm("Delete category?")) return;
  categories = categories.filter(c => c.id !== id);
  saveToStorage("categories", categories);
  renderCategories();
}

/* STAR */
function starCat(id) {
  const c = categories.find(c => c.id === id);
  c.starred = !c.starred;

  saveToStorage("categories", categories);
  renderCategories();
}

/* COLOR */
function toggleColors(e) {
  e.stopPropagation();
  document.getElementById("colorDropdown").classList.toggle("hidden");
}

function selectColor(color, name) {
  selectedColor = color;
  document.getElementById("colorDot").className = "dot " + color;
  document.getElementById("colorText").textContent = name;
  document.getElementById("colorDropdown").classList.add("hidden");
}

/* EMOJI */
const emojis = {
  smileys: ["😀", "😃", "😄", "😁", "😆", "😂", "😊", "😍", "😎", "🙂"],
  exercise: ["🏃", "🏋️", "🚴", "🤸", "🧘"],
  study: ["📚", "📖", "✏️", "🧠", "🎓"]
};

// z;

function toggleEmoji() {
  document.getElementById("emojiPanel").classList.toggle("hidden");
}

function loadEmoji(type) {
  const grid = document.getElementById("emojiGrid");
  grid.innerHTML = "";
  emojis[type].forEach(e => {
    const s = document.createElement("span");
    s.textContent = e;
    s.onclick = () => {
      selectedEmoji = e;
      document.getElementById("catEmoji").textContent = e;
      document.getElementById("emojiPanel").classList.add("hidden");
    };
    grid.appendChild(s);
  });
}
loadEmoji("smileys");


/* CLOSE DROPDOWNS OUTSIDE CLICK */

document.addEventListener("click", (e) => {

  const colorDropdown =
    document.getElementById("colorDropdown");

  const colorSelect =
    document.querySelector(".color-select");

  const emojiPanel =
    document.getElementById("emojiPanel");

  const emojiPicker =
    document.querySelector(".emoji-picker");

  // COLOR DROPDOWN
  if (
    colorDropdown &&
    colorSelect &&
    !colorDropdown.contains(e.target) &&
    !colorSelect.contains(e.target)
  ) {
    colorDropdown.classList.add("hidden");
  }

  // EMOJI PANEL
  if (
    emojiPanel &&
    emojiPicker &&
    !emojiPanel.contains(e.target) &&
    !emojiPicker.contains(e.target)
  ) {
    emojiPanel.classList.add("hidden");
  }

});