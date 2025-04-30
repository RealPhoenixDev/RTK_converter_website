const element = document.getElementById("taskWindowContainer");
const tagSelectWindow = document.getElementById("tagSelectContainer");
const tagSelectScript = document.getElementById("tagSelectScr");

const self = document.currentScript;

//Window field elements
const taskNameElem = document.getElementById("inputTaskName");
const taskDescElem = document.getElementById("inputTaskDesc");
const taskColorElem = document.getElementById("inputTaskColor");
const selectTagButton = document.getElementById("selectTagButton");

// Task control elements
const moveTaskUp = document.getElementById("moveTaskUp");
const moveTaskDown = document.getElementById("moveTaskDown");
const removeTaskBtn = document.getElementById("removeTask");
const saveTaskDataBtn = document.getElementById("saveTaskData");

let id;
let taskWindowData;

// Checks for changes of the style/ display property to fetch data of selected task
const taskInfoObserver = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
        if (
            mutation.type === "attributes" &&
            mutation.attributeName === "style" &&
            element.style.display === "flex"
        ) {
            windowHistory.push("taskInfoWindow");
            id = JSON.parse(self.getAttribute("taskID"));
            taskWindowData = JSON.parse(self.getAttribute("taskData"));
            insertData(taskWindowData);
        }
    }
});

taskInfoObserver.observe(element, {
    attributes: true,
    attributeFilter: ["style"],
});

// Removes the current script and adds a new one to reload the task
function reloadTask(globalID, taskWindowData) {
    if (taskWindowData) setTaskData(taskWindowData, globalID);
    document.getElementById(globalID + "_Scr").remove();
    let taskElem = document.getElementById(globalID);
    taskElem.replaceWith(taskElem.cloneNode(true));
    taskElem = document.getElementById(globalID);
    const newTaskScript = insertScript(
        taskElem,
        globalID + "_Scr",
        "./lib/data/task_data_manager.js"
    );
    passDataToScript(newTaskScript, { taskData: true }, globalID);
}

function insertData(data) {
    taskNameElem.value = data["task_name"];
    taskDescElem.value = data["description"];
    taskColorElem.value = data["color"];
}

selectTagButton.addEventListener("click", (e) => {
    tagSelectWindow.style.display = "block";
    passDataToScript(
        tagSelectScript,
        {
            taskID: JSON.stringify(id),
            taskData: JSON.stringify(taskWindowData),
        },
        id
    );
});
// If the X button is called, discard all changes
const closePopup = document.getElementById("task_popup_X");
closePopup.addEventListener("click", () => {
    if (windowHistory.at(-1) !== "taskInfoWindow") {
        return;
    }
    windowHistory.pop();
    element.style.display = "none";
    taskNameElem.value = "";
    taskDescElem.value = "";
    taskColorElem.value = "";
});

saveTaskDataBtn.addEventListener("click", (e) => {
    if (windowHistory.at(-1) !== "taskInfoWindow") {
        return;
    }
    const globalID = id["fID"] + "," + id["sID"];
    saveTaskData(globalID, taskWindowData, true);
});

removeTaskBtn.addEventListener("click", () => {
    if (windowHistory.at(-1) !== "taskInfoWindow") {
        return;
    }
    const globalID = id["fID"] + "," + id["sID"];
    removeTask(id);
    document.getElementById(globalID).remove();
    windowHistory.pop();
    element.style.display = "none";
    taskNameElem.value = "";
    taskDescElem.value = "";
    taskColorElem.value = "";
});

moveTaskUp.addEventListener("click", () => {
    if (windowHistory.at(-1) !== "taskInfoWindow") {
        return;
    }
    const globalID = id["fID"] + "," + id["sID"];
    if (id["sID"] < 1) return;
    moveTaskDataUp(id);
    reloadTask(globalID);
    const _globalID = id["fID"] + "," + (id["sID"] - 1);
    reloadTask(_globalID);
    saveTaskData(_globalID, taskWindowData, false);
});

moveTaskDown.addEventListener("click", () => {
    if (windowHistory.at(-1) !== "taskInfoWindow") {
        return;
    }
    const globalID = id["fID"] + "," + id["sID"];
    if (id["sID"] === getTaskCount(id["fID"]) - 1 + "") return;
    moveTaskDataDown(id);
    reloadTask(globalID);
    const _globalID = id["fID"] + "," + (Number.parseInt(id["sID"]) + 1);
    reloadTask(_globalID);
    saveTaskData(_globalID, taskWindowData, false);
});

// Saves the enter values and clears the fields
function saveTaskData(globalID, taskWindowData, _reloadTask) {
    element.style.display = "none";
    taskWindowData["task_name"] = taskNameElem.value;
    taskWindowData["description"] = taskDescElem.value;
    taskWindowData["color"] = taskColorElem.value;
    taskNameElem.value = "";
    taskDescElem.value = "";
    taskColorElem.value = "";
    if (_reloadTask) reloadTask(globalID, taskWindowData);
    windowHistory.pop();
}
