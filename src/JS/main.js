// modal control
const modal = document.querySelector("#modalWindow");
const openModalButton = document.querySelector("#add-task");
const closeModalButton = document.querySelector("#close-button");

openModalButton.addEventListener("click", function () {
    modal.style.display = "block";
});

closeModalButton.addEventListener("click", function () {
    modal.style.display = "none";
});

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// find elements
const form = document.querySelector("#form");
const formInput = document.querySelector("#form-input");
const formInputDate = document.querySelector("#form-date");
const formInputPriority = document.querySelector("#task-priority");
const taskList = document.querySelector("#tasks");
const sendButton = document.querySelector("#send-button");
const empty = document.querySelector("#empty");

let tasks = [];

if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
}

tasks.forEach(function (task) {
    renderTask(task);
});

checkEmptyList();

//Adding task
form.addEventListener("submit", addTask);

class taskObject {
    constructor(id, text, date, priority, done) {
        this.id = id;
        this.text = text;
        this.date = date;
        this.priority = priority;
        this.done = done;
    }
}

function addTask(event) {
    event.preventDefault();

    const inputText = formInput.value;

    const inputDate = new Date(formInputDate.value);
    const option = { weekday: "long", day: "2-digit", month: "short" };
    const formatDate = inputDate.toLocaleDateString("en-UK", option);

    const inputPriority = formInputPriority.value;

    if (inputText === "") {
        return alert("Please enter all information");
    }

    const newTask = new taskObject(Date.now(), inputText, formatDate, inputPriority, false);

    // const newTask = {
    //     id: Date.now(),
    //     text: inputText,
    //     date: formatDate,
    //     priority: inputPriority,
    //     done: false,
    // };

    tasks.push(newTask);

    renderTask(newTask);

    formInput.value = "";
    formInputDate.value = "";
    formInputPriority.value;

    formInput.focus();

    checkEmptyList();

    saveLocalStorage();
}

//Deleting task
taskList.addEventListener("click", deleteTask);

function deleteTask(event) {
    // console.log(event.target);

    if (event.target.dataset.action === "delete") {
        const parentNode = event.target.closest(".task");
        //Find ID of task
        const id = Number(parentNode.id);

        //Find index in array
        const index = tasks.findIndex(function (task) {
            if (task.id === id) {
                return true;
            }
        });

        tasks.splice(index, 1);

        parentNode.remove();

        checkEmptyList();

        saveLocalStorage();
    }
}

//Done task
taskList.addEventListener("click", doneTask);

function doneTask(event) {
    // console.log(event.target);

    if (event.target.dataset.action === "done") {
        const parentNode = event.target.closest(".task");

        const id = Number(parentNode.id);
        const task = tasks.find(function (task) {
            if (task.id == id) {
                return true;
            }
        });

        task.done = !task.done;

        saveLocalStorage();

        const taskTag = parentNode.querySelector("#done");
        taskTag.classList.toggle("none");
    }
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `<h1 class="empty-heading" id="empty">List is empty</h1>`;
        taskList.insertAdjacentHTML("afterbegin", emptyListHTML);
    } else if (tasks.length > 0) {
        const emptyListEl = document.querySelector("#empty");
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
    const doneClass = task.done ? "task-done" : "task-done none";

    const taskHTML = `<div class="task" id="${task.id}">
    <div class="task-date">${task.date}</div>
    <div class="task-block">
        <div class="task-info">
            <h1 class="task-title">${task.text}</h1>
            <div class="task-tag high">${task.priority}</div>
            <div class="${doneClass}" id="done">Done</div>
        </div>
        <div class="task-tools">
            <button data-action="done" class="task-edit btn"><img class="filter" src="./src/img/done.svg" alt="done" /></button>
            <button data-action="delete" class="task-delete btn"><img src="./src/img/delete.png" alt="del" /></button>
        </div>
    </div>
</div>`;

    taskList.insertAdjacentHTML("beforeend", taskHTML);
}
