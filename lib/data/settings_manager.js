const optionsContainer = document.getElementById("optionContainer");
const exportDataButton = document.getElementById("exportDataBtn");
const importDataBtn = document.getElementById("importDataBtn");
const clearDataBtn = document.getElementById("clearDataBtn");
const taskBoardBgColor = document.getElementById("taskBoardBgColor");
const desktopBgColor = document.getElementById("desktopBgColor");
const settingsCloseBtn = document.getElementById("settingsCloseBtn");

function exportToJsonFile(obj, filename) {
    const dataStr = JSON.stringify(obj);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
}

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    };
    rawFile.send(null);
}

exportDataButton.addEventListener("click", () => {
    exportToJsonFile(data_temp, "taskBoardData.json");
});

importDataBtn.addEventListener("change", () => {
    const dataURL = URL.createObjectURL(importDataBtn.files[0]);
    readTextFile(dataURL, (val) => {
        data_temp = JSON.parse(val);
        window.localStorage.setItem("task_data", data_temp);
        initializeData();
    });
});

clearDataBtn.addEventListener("click", () => {
    data_temp = {};
    window.localStorage.setItem("task_data", data_temp);
    initializeData();
});

if (window.localStorage.getItem("desktopColor")) {
    document.body.style.backgroundColor =
        window.localStorage.getItem("desktopColor");
    desktopBgColor.value = window.localStorage.getItem("desktopColor");
}
if (window.localStorage.getItem("taskBoardColor")) {
    const taskBoardContainer = document.getElementById("folder_container");
    taskBoardContainer.style.backgroundColor =
        window.localStorage.getItem("taskBoardColor");
    taskBoardBgColor.value = window.localStorage.getItem("taskBoardColor");
}

desktopBgColor.addEventListener("input", () => {
    document.body.style.backgroundColor = desktopBgColor.value;
    window.localStorage.setItem("desktopColor", desktopBgColor.value);
});

taskBoardBgColor.addEventListener("input", () => {
    const taskBoardContainer = document.getElementById("folder_container");
    taskBoardContainer.style.backgroundColor = taskBoardBgColor.value;
    window.localStorage.setItem("taskBoardColor", taskBoardBgColor.value);
});

settingsCloseBtn.addEventListener("click", () => {
    windowHistory.pop();
    optionsContainer.style.display = "none";
});
