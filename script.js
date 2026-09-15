console.log("JavaScript Connected Successfully!");

// =======================
// Select HTML Elements
// =======================

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const searchInput = document.getElementById("searchInput");

const allBtn = document.getElementById("allBtn");
const pendingBtn = document.getElementById("pendingBtn");
const completedBtn = document.getElementById("completedBtn");

const taskCount = document.getElementById("taskCount");
const totalStat = document.getElementById("totalStat");
const pendingStat = document.getElementById("pendingStat");
const completedStat = document.getElementById("completedStat");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const clearBtn = document.getElementById("clearBtn");

const recycleBin = document.getElementById("recycleBin");

let totalTasks = 0;
let currentFilter = "all";

// =======================
// Create Task
// =======================

function createTask(
    taskText,
    completed = false,
    important = false,
    shouldSave = true
) {
    const task = document.createElement("div");
    task.className = "task";

    // Checkbox
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.checked = completed;

    if (completed) {
        task.classList.add("completed");
    }

    checkBox.addEventListener("change", function () {
    task.classList.toggle("completed");
    saveTasks();
    filterTasks();
    updateStats();
});
    // Star Button
    const starBtn = document.createElement("button");
    starBtn.innerText = important ? "⭐" : "☆";
    starBtn.classList.add("star-btn");

    if (important) {
        task.classList.add("important");
    }

    starBtn.addEventListener("click", function () {
        const isImportant = task.classList.toggle("important");

        starBtn.innerText = isImportant ? "⭐" : "☆";

        saveTasks();
    });

    // Task Text
    const taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;

    // Edit Button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");

    editBtn.addEventListener("click", function () {
        const newTaskText = prompt(
            "Edit your task:",
            taskSpan.textContent
        );

        if (newTaskText === null) {
            return;
        }

        const trimmedText = newTaskText.trim();

        if (trimmedText === "") {
            alert("Task cannot be empty!");
            return;
        }

        taskSpan.textContent = trimmedText;

        saveTasks();
        filterTasks();
    });

    // Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", function () {

        const isCompleted = task.classList.contains("completed");
        const isImportant = task.classList.contains("important");

        createRecycleTask(
            taskSpan.textContent,
            isCompleted,
            isImportant
        );

        task.remove();

totalTasks--;

updateTaskCount();

saveTasks();
updateStats();
    });

    // Add Elements
    task.appendChild(checkBox);
    task.appendChild(starBtn);
    task.appendChild(taskSpan);
    task.appendChild(editBtn);
    task.appendChild(deleteBtn);

    taskList.appendChild(task);

    totalTasks++;

    updateTaskCount();

    if (shouldSave) saveTasks();
        updateStats();
}

// =======================
// Create Recycle Task
// =======================

function createRecycleTask(
    taskText,
    completed = false,
    important = false
) {
    const recycleTask = document.createElement("div");
    recycleTask.className = "recycle-task";

    recycleTask.dataset.completed = completed;
    recycleTask.dataset.important = important;

    // Text
    const recycleText = document.createElement("span");
    recycleText.textContent = taskText;

    // Restore Button
    const restoreBtn = document.createElement("button");
    restoreBtn.textContent = "Restore";
    restoreBtn.className = "restore-btn";

    // Delete Forever Button
    const deleteForeverBtn = document.createElement("button");
    deleteForeverBtn.textContent = "Delete Forever";
    deleteForeverBtn.className = "delete-forever-btn";

    recycleTask.appendChild(recycleText);
    recycleTask.appendChild(restoreBtn);
    recycleTask.appendChild(deleteForeverBtn);

    // Restore
    restoreBtn.addEventListener("click", function () {

        const completedStatus =
            recycleTask.dataset.completed === "true";

        const importantStatus =
            recycleTask.dataset.important === "true";

        recycleTask.remove();

        createTask(
            taskText,
            completedStatus,
            importantStatus
        );

        saveTasks();
    });

    // Delete Forever
    deleteForeverBtn.addEventListener("click", function () {

        const confirmDelete = confirm(
            "Delete this task forever?"
        );

        if (!confirmDelete) {
            return;
        }

        recycleTask.remove();

        saveTasks();
    });

    recycleBin.appendChild(recycleTask);
}

// =======================
// Add Task
// =======================

addBtn.addEventListener("click", function () {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    createTask(taskText);

    taskInput.value = "";

    taskInput.focus();
});

// =======================
// Enter Key
// =======================

taskInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {
        addBtn.click();
    }
});

// =======================
// Update Task Counter
// =======================

function updateTaskCount() {

    totalTasks = document.querySelectorAll(".task").length;

    taskCount.textContent = totalTasks;
}

// =======================
// Clear All
// =======================

clearBtn.addEventListener("click", function () {

    const taskExists =
        document.querySelectorAll(".task").length > 0;

    const recycleExists =
        document.querySelectorAll(".recycle-task").length > 0;

    if (!taskExists && !recycleExists) {
        return;
    }

    const confirmClear = confirm(
        "Are you sure you want to clear all tasks and recycle bin?"
    );

    if (!confirmClear) {
        return;
    }

    taskList.innerHTML = "";
    recycleBin.innerHTML = "";

   totalTasks = 0;

updateTaskCount();

saveTasks();
updateStats();
});

// =======================
// Save Tasks
// =======================

function saveTasks() {

    const tasks = [];
    const recycleTasks = [];

    document.querySelectorAll(".task").forEach(function (task) {

        tasks.push({
            text: task.querySelector("span").textContent,
            completed: task.classList.contains("completed"),
            important: task.classList.contains("important")
        });
    });

    document.querySelectorAll(".recycle-task").forEach(function (task) {

        recycleTasks.push({
            text: task.querySelector("span").textContent,
            completed: task.dataset.completed === "true",
            important: task.dataset.important === "true"
        });
    });

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

    localStorage.setItem(
        "recycleTasks",
        JSON.stringify(recycleTasks)
    );
}

// =======================
// Load Tasks
// =======================

function loadTasks() {

    const savedTasks =
        localStorage.getItem("tasks");

    const savedRecycleTasks =
        localStorage.getItem("recycleTasks");

    const tasks =
        savedTasks ? JSON.parse(savedTasks) : [];

    const recycleTasks =
        savedRecycleTasks
            ? JSON.parse(savedRecycleTasks)
            : [];

    tasks.forEach(function (task) {

        createTask(
            task.text,
            task.completed,
            task.important,
            false
        );
    });

    recycleTasks.forEach(function (task) {

        createRecycleTask(
            task.text,
            task.completed,
            task.important
        );
    });

    updateTaskCount();
}

// =======================
// Filter Tasks
// =======================

function filterTasks() {

    const searchText =
        searchInput.value.toLowerCase().trim();

    document.querySelectorAll(".task").forEach(function (task) {

        const taskText =
            task.querySelector("span")
                .textContent
                .toLowerCase();

        const isCompleted =
            task.classList.contains("completed");

        const matchesSearch =
            taskText.includes(searchText);

        let matchesFilter = true;

        if (currentFilter === "pending") {
            matchesFilter = !isCompleted;
        }

        if (currentFilter === "completed") {
            matchesFilter = isCompleted;
        }

        task.style.display =
            matchesSearch && matchesFilter
                ? "flex"
                : "none";
    });
}

// =======================
// Search
// =======================

searchInput.addEventListener("input", function () {
    filterTasks();
});

// =======================
// Filter Button Helper
// =======================

function setActiveFilter(filter) {

    currentFilter = filter;

    allBtn.classList.remove("active");
    pendingBtn.classList.remove("active");
    completedBtn.classList.remove("active");

    if (filter === "all") {
        allBtn.classList.add("active");
    }

    if (filter === "pending") {
        pendingBtn.classList.add("active");
    }

    if (filter === "completed") {
        completedBtn.classList.add("active");
    }

    filterTasks();
}

// =======================
// Filter Buttons
// =======================

allBtn.addEventListener("click", function () {
    setActiveFilter("all");
});

pendingBtn.addEventListener("click", function () {
    setActiveFilter("pending");
});

completedBtn.addEventListener("click", function () {
    setActiveFilter("completed");
});

// =======================
// Start App
// =======================

loadTasks();

setActiveFilter("all");

updateStats();

function updateStats() {
    const tasks = document.querySelectorAll(".task");

    const total = tasks.length;

    let completed = 0;

    tasks.forEach(function (task) {
        if (task.classList.contains("completed")) {
            completed++;
        }
    });

    const pending = total - completed;

    const progress = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    totalStat.textContent = total;
    pendingStat.textContent = pending;
    completedStat.textContent = completed;

    progressText.textContent = progress + "%";
    progressFill.style.width = progress + "%";
}