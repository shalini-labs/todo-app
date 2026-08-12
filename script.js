console.log("JavaScript Connected Successfully!");

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearBtn = document.getElementById("clearBtn");
const recycleBin = document.getElementById("recycleBin");

let totalTasks = 0;

console.log(taskInput);

addBtn.addEventListener("click", function () {

    console.log("Add Button Clicked");

   const taskText = taskInput.value.trim();
   
    if (taskText === "") {
    alert("Please enter a task!");
    return;
}

    console.log(taskText);

    const task = document.createElement("div");

    task.className = "task";

    const checkBox = document.createElement("input");

checkBox.type = "checkbox";

checkBox.addEventListener("change", function () {

    task.classList.toggle("completed");

});

   const taskSpan = document.createElement("span");

taskSpan.textContent = taskText;

task.appendChild(checkBox);

task.appendChild(taskSpan);

    const deleteBtn = document.createElement("button");

deleteBtn.textContent = "Delete";

deleteBtn.addEventListener("click", function () {

    task.remove();

});

totalTasks--;

taskCount.textContent = totalTasks;

task.appendChild(deleteBtn);

taskList.appendChild(task);

totalTasks++;

taskCount.textContent = totalTasks;

taskInput.value = "";;

});