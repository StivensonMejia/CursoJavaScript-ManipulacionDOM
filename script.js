const formulario = document.getElementById("formulario");
const taskContainer = document.querySelector(".taskContainer");
const themeToggle = document.querySelector(".btnChangeTheme");
const root = document.documentElement;

const btnCloseMEdit = document.querySelector("#btnCloseMEdit");
const btnCloseMDelete = document.querySelector("#btnCloseMDelete");
const modalEdit = document.querySelector(".modEdit");
const modalDelete = document.querySelector(".modDelete");

let taskToDelete = null; // Guarda la tarea a eliminar

loadTask();

function closeModal(modal) {
    modal.classList.remove("visible");
}

function showModal(modal) {
    modal.classList.add("visible");
}

btnCloseMEdit.addEventListener("click", () => closeModal(modalEdit));
btnCloseMDelete.addEventListener("click", () => closeModal(modalDelete));

document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.querySelector(".btnChangeTheme");
    const root = document.documentElement;

    function applyTheme(darkMode) {
        root.classList.toggle("dark-theme", darkMode);
        localStorage.setItem("darkMode", darkMode ? "enabled" : "disabled");
        themeToggle.checked = darkMode;
    }

    // Aplicar tema guardado
    const savedTheme = localStorage.getItem("darkMode") === "enabled";
    applyTheme(savedTheme);

    // Evento al cambiar el switch
    themeToggle.addEventListener("change", function () {
        applyTheme(this.checked);
    });
});


formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    const textInput = document.querySelector(".textArea");
    createNewTask(textInput.value);
    saveTask(textInput.value);
    textInput.value = ""
});

taskContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("btnDelete")) {
        
        deleteTask(event.target.closest(".task"));

    } else if (event.target.classList.contains("btnEdit")) {
        editTask(event.target.closest(".task"));
        
    }
    
});

function createNewTask(taskItem) {
    taskContainer.insertAdjacentHTML("afterbegin", `
        <article class="task fade-in">
            <p>${taskItem}</p>
            <div class="inTask">
                <button class="btn-inTask btnEdit">✏️</button>
                <button class="btn-inTask btnDelete">X</button>
            </div>
        </article>
    `);
}

function deleteTask(taskValue) {
    taskToDelete = taskValue; // Guarda la tarea seleccionada
    modalDelete.classList.add("visible"); // Abre el modal

    // Seleccionar botones dentro del modal solo cuando se abre
    const btnDeleteInModal = document.querySelector(".btnDeleteINModal");
    const btnCancelInModal = document.querySelector(".btnCancelINModal");

    // Confirmar eliminación
    btnDeleteInModal.onclick = () => {
        if (taskToDelete) {
            taskValue.style.backgroundColor = "#ffcccc"; // Cambia a rojo claro
            taskValue.style.opacity = "0"; // Hace que se desvanezca
            taskValue.style.transition = "background-color .5s linear, opacity .5s linear";

            setTimeout(() => {
                taskValue.remove(); // Elimina del DOM después de la animación
                updateTask();
            }, 500); // Espera 500ms antes de eliminarlo
        }
        modalDelete.classList.remove("visible"); // Cierra el modal
        taskToDelete = null; // Limpia la referencia
    };

    // Cancelar eliminación
    btnCancelInModal.onclick = () => {
        modalDelete.classList.remove("visible"); // Cierra el modal sin borrar nada
        taskToDelete = null; // Limpia la referencia
    };
}

function editTask(taskValue) {
    const textAreaEdit = document.querySelector(".textAreaEdit");
    const btnEditInModal = document.querySelector(".btnEditINModal");

    textAreaEdit.value = taskValue.firstElementChild.textContent; // Cargar texto en el modal
    showModal(modalEdit); // Mostrar modal de edición

    btnEditInModal.onclick = (e) => {
        e.preventDefault();
        taskValue.firstElementChild.textContent = textAreaEdit.value; // Guardar cambios
        closeModal(modalEdit); // Cerrar modal
        updateTask();
    };
}

function updateTask() {
    let taskAll = Array.from(taskContainer.getElementsByClassName("task")).map(task => task.firstElementChild.textContent);
    console.log(taskAll);
    localStorage.setItem("taskItem", JSON.stringify(taskAll));
    
}

function saveTask(taskItem) {
    const taskItemJSON = JSON.parse(localStorage.getItem("taskItem") || "[]");
    taskItemJSON.push(taskItem);
    localStorage.setItem("taskItem", JSON.stringify(taskItemJSON));
}

function loadTask() {
    const taskItemJSON = JSON.parse(localStorage.getItem("taskItem") || "[]");

    taskItemJSON.forEach(element => {
        createNewTask(element);
    });
}


