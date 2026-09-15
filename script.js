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
const clearBtn = document.getElementById("clearBtn");
const recycleBin = document.getElementById("recycleBin");

// =======================
// Variables
// =======================

let totalTasks = 0;

// =======================
// Create Task Function
// =======================

function createTask(taskText, completed = false, important = false, shouldSave = true) {

    const task = document.createElement("div");
    task.className = "task";

    // =======================
// Checkbox
// =======================

const checkBox = document.createElement("input");
checkBox.type = "checkbox";

if (completed) {
    checkBox.checked = true;
    task.classList.add("completed");
}
checkBox.addEventListener("change", function () {

    task.classList.toggle("completed");

    saveTasks();

    filterTasks();

});

    // =======================
    // Star Button
    // =======================
const starBtn = document.createElement("button");
starBtn.innerText = important ? "⭐" : "☆";
starBtn.classList.add("star-btn");

if (important) {
    task.classList.add("important");
}
    starBtn.addEventListener("click", function () {

        if (starBtn.innerText === "☆") {

            starBtn.innerText = "⭐";
            task.classList.add("important");

            // Move important task to top
            taskList.prepend(task);

        } else {

            starBtn.innerText = "☆";
            task.classList.remove("important");

        }
        saveTasks();

    });





    // =======================
    // Task Text
    // =======================

    const taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;

    // =======================
// Edit Button
// =======================

const editBtn = document.createElement("button");
editBtn.textContent = "Edit";
editBtn.classList.add("edit-btn");

editBtn.addEventListener("click", function () {

    const newTaskText = prompt("Edit your task:", taskSpan.textContent);

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

    // =======================
    // Delete Button
    // =======================

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", function () {

       createRecycleTask(
    taskSpan.textContent,
    task,
    task.classList.contains("completed"),
    task.classList.contains("important")
);

        task.remove();

        totalTasks--;

        taskCount.textContent = totalTasks;
 
        saveTasks();

    });

    // =======================
    // Add Elements to Task
    // =======================

task.appendChild(checkBox);
task.appendChild(starBtn);
task.appendChild(taskSpan);
task.appendChild(editBtn);
task.appendChild(deleteBtn);

    // =======================
    // Add Task to List
    // =======================

    taskList.appendChild(task);

    // =======================
    // Update Counter
    // =======================

    totalTasks++;
    taskCount.textContent = totalTasks;

    // Clear Input
 
            if (shouldSave) {
        saveTasks();
    }

}
function createRecycleTask(
    taskText,
    task = null,
    completed = false,
    important = false
) {

    const recycleTask = document.createElement("div");

recycleTask.className = "recycle-task";

recycleTask.dataset.completed = completed;
recycleTask.dataset.important = important;

const recycleText = document.createElement("span");

recycleText.textContent = taskText;

recycleTask.appendChild(recycleText);

const restoreBtn = document.createElement("button");

restoreBtn.textContent = "Restore";

restoreBtn.className = "restore-btn";

const deleteForeverBtn = document.createElement("button");

deleteForeverBtn.textContent = "Delete Forever";

deleteForeverBtn.className = "delete-forever-btn";

recycleTask.appendChild(restoreBtn);

recycleTask.appendChild(deleteForeverBtn);


restoreBtn.addEventListener("click", function () {

    recycleTask.remove();

    createTask(
        taskText,
        completed,
        important
    );
       saveTasks();
});

deleteForeverBtn.addEventListener("click", function () {

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

});


taskInput.addEventListener("keypress", function (event) {

    if (event.key === "Enter") {

        addBtn.click();

    }

});
// =======================
// Clear All Tasks
// =======================

clearBtn.addEventListener("click", function () {

    taskList.innerHTML = "";

    recycleBin.innerHTML = "";

    totalTasks = 0;

    taskCount.textContent = totalTasks;

    saveTasks();

});
// =======================
// Save Tasks
// =======================

function saveTasks() {

    const tasks = [];

    const recycleTasks = [];

    const allTasks = document.querySelectorAll(".task");

    const allRecycleTasks = document.querySelectorAll(".recycle-task");

    allTasks.forEach(function (task) {

        tasks.push({

            text: task.querySelector("span").textContent,

            completed: task.classList.contains("completed"),

            important: task.classList.contains("important")

        });

    });

    allRecycleTasks.forEach(function (task) {

    recycleTasks.push({

        text: task.querySelector("span").textContent,

        completed: task.dataset.completed === "true",

        important: task.dataset.important === "true"

    });

});

    localStorage.setItem("tasks", JSON.stringify(tasks));

    localStorage.setItem("recycleTasks", JSON.stringify(recycleTasks));

}
// =======================
// Load Tasks
// =======================

function loadTasks() {

    const savedTasks = localStorage.getItem("tasks");
    const savedRecycleTasks = localStorage.getItem("recycleTasks");

    const tasks = savedTasks ? JSON.parse(savedTasks) : [];

    const recycleTasks = savedRecycleTasks
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
            null,
            task.completed,
            task.important
        );

    });

    saveTasks();

}
 loadTasks();

// =======================
// Search and Filter Tasks
// =======================

let currentFilter = "all";

function filterTasks() {

    const searchText = searchInput.value.toLowerCase();

    const allTasks = document.querySelectorAll(".task");

    allTasks.forEach(function (task) {

        const taskText = task.querySelector("span").textContent.toLowerCase();

        const isCompleted = task.classList.contains("completed");

        const matchesSearch = taskText.includes(searchText);

        let matchesFilter = true;

        if (currentFilter === "pending") {
            matchesFilter = !isCompleted;
        }

        if (currentFilter === "completed") {
            matchesFilter = isCompleted;
        }

        if (matchesSearch && matchesFilter) {
            task.style.display = "flex";
        } else {
            task.style.display = "none";
        }

    });

}


// Search

searchInput.addEventListener("input", function () {

    filterTasks();

});


// All Button

allBtn.addEventListener("click", function () {

    currentFilter = "all";

    filterTasks();

});


// Pending Button

pendingBtn.addEventListener("click", function () {

    currentFilter = "pending";

    filterTasks();

});


// Completed Button

completedBtn.addEventListener("click", function () {

    currentFilter = "completed";

    filterTasks();

});