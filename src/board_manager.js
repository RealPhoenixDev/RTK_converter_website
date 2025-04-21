let data_structure_template = {
    "Test folder": [
        {
            task_name: "This is some task",
            description: "This is a very very real",
            tags: [],
            date: "date",
            color: "#FFFFFF",
        },
    ],
    "Some other name": [
        {
            task_name: "This another task",
            description: "This is unreal",
            tags: [],
            date: "date",
            color: "#FF00FF",
        },
    ],
};
let scrollingHorizontally = true;
const create_folder_button = document.getElementById("folder_create_button");
const board_container = document.getElementById("board_container");
const task_popup_frame = document.getElementById("task_popup_frame");
let activeIndex = "";

create_folder_button.addEventListener("click", (e) => {
    const folderData = {
        "Folder Name": [],
    };
    data_structure_template = { ...data_structure_template, ...folderData };
    createFolderWithData("Folder Name");
});
// Horizontal scrolling
board_container.addEventListener("wheel", (event) => {
    console.log(scrollingHorizontally);
    console.log(
        board_container.scrollWidth +
            board_container.clientLeft +
            ", " +
            window.innerWidth
    );
    if (scrollingHorizontally) {
        board_container.scrollBy({
            left: event.deltaY < 0 ? -70 : 70,
        });
        event.preventDefault();

        // check if the user has reached the end of the slider
        if (
            board_container.scrollLeft >=
            board_container.scrollWidth - board_container.clientWidth
        ) {
            scrollingHorizontally = false;
            board_container.style.overflowY = "auto";
        }
    } else {
        if (
            board_container.scrollWidth + board_container.clientLeft >
            window.innerWidth
        ) {
            scrollingHorizontally = true;
        }
        // (scroll the page up/down)
        return true;
    }
});

// This function imports all data from the local storage on load of the page
function initializeAllTasks() {
    if (data_structure_template) {
        // Iterates through each folder in the JSON and creates an HTML element
        for (let key in data_structure_template) {
            createFolderWithData(key);
        }
    }
}

function createFolderWithData(folderName) {
    const folderIndex = Object.keys(data_structure_template).indexOf(
        folderName
    );
    board_container.insertAdjacentHTML(
        "beforeend",
        `<div class="board_folder_container">
            <div class="task_folder" id="${folderIndex}">
                <input
                    maxlength="28"
                    type="text"
                    class="task_folder_name"
                    id="folder_name_${folderIndex}"
                    value="${folderName}" />
                <div class="task_container" id="container_${folderIndex}" >
                    <button style="order: 999" class="add_task" id="add_task_${folderIndex}">
                        Add a task
                    </button>
                </div>
            </div>
        </div>`
    );
    const folder = document.getElementById("container_" + folderIndex);
    const folderNameElement = document.getElementById(
        "folder_name_" + folderIndex
    );
    const addTaskButton = document.getElementById("add_task_" + folderIndex);
    //Event to assign a new element to the task array when create task button is pressed
    addTaskButton.addEventListener("click", (e) => {
        const taskArrayLength = data_structure_template[folderName].push({
            task_name: "Task name",
            description: "",
            date: Date.now(),
            tags: [],
            color: "#F1F1F1",
        });
        activeIndex = folderIndex + "," + (taskArrayLength - 1);
        setTaskWindowData(folderIndex + "," + (taskArrayLength - 1));
        loadSpecificTask(activeIndex);
    });
    // When user changes the name of the folder, automatically update it in the data
    folderNameElement.addEventListener("input", (e) => {
        data_structure_template[folderName]["folderName"] = e.target.value;
    });

    // Iterates through each task in the JSON and creates task elements with the data
    for (let j = 0; j < data_structure_template[folderName].length; j++) {
        const task_data = data_structure_template[folderName][j];
        const taskIndex = folderIndex + "," + j;
        folder.insertAdjacentHTML(
            "beforeend",
            `<div class="task" id="${taskIndex}">
                <span id="${taskIndex}_name"
                    >${task_data.task_name}</span>
                <div class="task_tags">
                    <div
                        class="tag" 
                        style="border: violet 1px solid">
                        <div
                            class="tag_color"
                            style="
                                background-color: violet;
                            "></div>
                        <div class="tag_text">school</div>
                    </div>
                </div>
            </div>`
        );
        const task = document.getElementById(taskIndex);
        task.addEventListener("click", (e) => {
            activeIndex = taskIndex;
            setTaskWindowData(taskIndex);
        });
    }
}

function loadSpecificTask(index) {
    const parsedIndex = index.split(",");
    const folder = document.getElementById("container_" + parsedIndex[0]);
    const task_data =
        data_structure_template[
            Object.keys(data_structure_template)[parsedIndex[0]]
        ][parsedIndex[1]];
    folder.insertAdjacentHTML(
        "beforeend",
        `<div class="task" id="${index}">
                <span id="${index}_name"
                    >${task_data.task_name}</span>
                <div class="task_tags">
                    <div
                        class="tag" 
                        style="border: violet 1px solid">
                        <div
                            class="tag_color"
                            style="
                                background-color: violet;
                            "></div>
                        <div class="tag_text">school</div>
                    </div>
                </div>
            </div>`
    );
    const task = document.getElementById(index);
    task.addEventListener("click", (e) => {
        activeIndex = index;
        setTaskWindowData(index);
    });
}

function updateTaskDisplay(index) {
    const parsedIndex = index.split(",");
    const task_data =
        data_structure_template[
            Object.keys(data_structure_template)[parsedIndex[0]]
        ][parsedIndex[1]];
    const task_name = document.getElementById(index + "_name");
    task_name.innerHTML = task_data["task_name"];
}

function loadTaskWindowData() {
    let innerDoc =
        task_popup_frame.contentDocument ||
        task_popup_frame.contentWindow.document;
    const inputTaskName = innerDoc.getElementById("input_task_name");
    const inputTaskDesc = innerDoc.getElementById("input_task_desc");
    const inputTaskColor = innerDoc.getElementById("input_task_color");
    // Adds events that update the data of currently selected task every time a value in their field changes
    inputTaskName.addEventListener("input", (e) => {
        const parsedActiveIndex = activeIndex.split(",");
        data_structure_template[
            Object.keys(data_structure_template)[parsedActiveIndex[0]]
        ][parsedActiveIndex[1]]["task_name"] = e.target.value;
        updateTaskDisplay(activeIndex);
    });
    inputTaskDesc.addEventListener("input", (e) => {
        const parsedActiveIndex = activeIndex.split(",");
        data_structure_template[
            Object.keys(data_structure_template)[parsedActiveIndex[0]]
        ][parsedActiveIndex[1]]["description"] = e.target.value;
    });
    inputTaskColor.addEventListener("input", (e) => {
        if (e.target.value.match("^#(?:[0-9a-fA-F]{3}){1,2}$")) {
            e.target.style.accentColor = "green";
            const parsedActiveIndex = activeIndex.split(",");
            data_structure_template[
                Object.keys(data_structure_template)[parsedActiveIndex[0]]
            ][parsedActiveIndex[1]]["color"] = e.target.value;
            const taskObject = document.getElementById(activeIndex);
            taskObject.style.backgroundColor = e.target.value + "FF";
        } else {
            e.target.style.accentColor = "red";
        }
    });
    const closePopup = innerDoc.getElementById("task_popup_X");
    closePopup.addEventListener("click", (e) => {
        task_popup_frame.style.display = "none";
    });
}

function setTaskWindowData(index) {
    let innerDoc =
        task_popup_frame.contentDocument ||
        task_popup_frame.contentWindow.document;
    const parsedTaskIndex = index.split(",");
    const taskData =
        data_structure_template[
            Object.keys(data_structure_template)[parsedTaskIndex[0]]
        ][parsedTaskIndex[1]];
    const inputTaskName = innerDoc.getElementById("input_task_name");
    const inputTaskDesc = innerDoc.getElementById("input_task_desc");
    const inputTaskColor = innerDoc.getElementById("input_task_color");

    inputTaskName.value = taskData["task_name"];
    inputTaskDesc.innerHTML = taskData["description"];
    inputTaskColor.value = taskData["color"];
    task_popup_frame.style.display = "block";
}

initializeAllTasks();
