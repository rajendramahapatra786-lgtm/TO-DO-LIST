# 📝 Smart To-Do App

A clean and interactive **Task Management Web App** built using **HTML, CSS, and Vanilla JavaScript**.  
It allows users to create tasks, track daily progress with a monthly view, and manage tasks efficiently using localStorage.

---

## 🚀 Features

### ✅ Task Management
- Create new tasks with:
  - Task name
  - Description
  - Deadline
  - Categories (max 3)
  - Color
- Edit task details using a modal
- Delete tasks safely

### 📅 Monthly Task Tracking
- Automatic **current month grid**
- Mark tasks as **completed (✔)** per day
- Automatic **fail (✖)** if:
  - Deadline passes
  - Day is missed
- Colorful indicators for better visibility

### 🏠 Home Dashboard
- Shows all tasks as clean cards
- Displays:
  - Task color
  - Categories
  - Deadline
- “No tasks yet” message when empty

### 💾 Local Storage
- All tasks are saved in **browser localStorage**
- Data persists even after page refresh

---

## 🧱 Tech Stack

- **HTML5** – Structure
- **CSS3** – Styling & layout
- **JavaScript (Vanilla)** – Logic & interactions
- **localStorage API** – Data persistence

---

## 📁 Project Structure

```text
.
├── index.html        # Home page
├── index.css         # Home styles
├── index.js          # Home logic
├── add-task.html     # Add new task page
├── add-task.css      # Add task styles
├── add-task.js       # Add task logic
├── task.html         # Single task page
├── task.css          # Task page styles
├── task.js           # Task tracking logic
└── README.md
