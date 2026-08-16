console.log("JavaScript Connected Successfully!");

// =======================
// Select HTML Elements
// =======================

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearBtn = document.getElementById("clearBtn");
const recycleBin = document.getElementById("recycleBin");

// =======================
// Variables
// =======================

let totalTasks = 0;

// =======================
// Add Task
// =======================

addBtn.addEventListener("click", function () {

    const taskText = taskInput.value.trim();

    // Prevent Empty Task
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    // =======================
    // Create Task Card
    // =======================

    const task = document.createElement("div");
    task.className = "task";

    // =======================
    // Checkbox
    // =======================

    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";

    checkBox.addEventListener("change", function () {
        task.classList.toggle("completed");
    });

    // =======================
    // Star Button
    // =======================

    const starBtn = document.createElement("button");
    starBtn.innerText = "☆";
    starBtn.classList.add("star-btn");

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

    });

    // =======================
    // Task Text
    // =======================

    const taskSpan = document.createElement("span");
    taskSpan.textContent = taskText;

    // =======================
    // Delete Button
    // =======================

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", function () {

        task.remove();

        totalTasks--;

        taskCount.textContent = totalTasks;

    });

    // =======================
    // Add Elements to Task
    // =======================

    task.appendChild(checkBox);
    task.appendChild(starBtn);
    task.appendChild(taskSpan);
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
    taskInput.value = "";

});