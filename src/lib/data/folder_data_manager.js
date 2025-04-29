taskTemp = {
    task_name: "Piezīmju nosaukums",
    description: "",
    tags: [],
    color: "#FFFFFF",
};

folderIDArray = [];
folderIDArray.push(document.currentScript.getAttribute("elemID"));
_folderID = folderIDArray.at(-1);
folderDataArray = [];
folderDataArray.push(
    JSON.parse(document.currentScript.getAttribute("folderData"))
);

taskContainerArray = [];
taskContainerArray.push(document.getElementById(_folderID + "_C"));

createTaskButtonArray = [];
createTaskButtonArray.push(document.getElementById(_folderID + "_newTaskBtn"));

// Initializes all tasks in all folder
i = -1;
folderDataArray.forEach((folder) => {
    const taskContainer = taskContainerArray.at(-1);
    const folderID = folderIDArray.at(-1);
    folder.forEach(async (task) => {
        i++;
        const globalID = folderID + "," + i;
        await insertTemplate(
            taskContainer,
            "./lib/templates/task.html",
            globalID,
            { task_name: task["task_name"] },
            "./lib/data/task_data_manager.js"
        );
        const scriptElement = document.getElementById(globalID + "_Scr");
        await passDataToScript(scriptElement, { taskData: true }, globalID);
    });

    // Changes folder name on input in the name field
    const folderNameElem = document.getElementById(folderID + "_N");
    folderNameElem.addEventListener("input", () => {
        setFolderName(folderID, folderNameElem.value);
    });
    //removes the folder from the data and reloads the board to update
    const removeFolderBtn = document.getElementById(folderID + "_R");
    removeFolderBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (windowHistory.at(-1) !== "taskBoard") {
            return;
        }
        removeFolder(folderID);
        initializeData();
    });
});

createTaskButtonArray.forEach((button) => {
    const taskContainer = taskContainerArray.at(-1);
    const folderID = folderIDArray.at(-1);
    button.addEventListener("click", async (e) => {
        console.log(data_temp);
        console.log(_.clone(taskTemp));
        const taskCount = getTaskCount(folderID);
        // taskContainerArray.push(taskTemp);
        const newTaskID = folderID + "," + taskCount;
        addTask(_.clone(taskTemp), folderID);
        await insertTemplate(
            taskContainer,
            "./lib/templates/task.html",
            newTaskID,
            { task_name: taskTemp["task_name"] },
            "./lib/data/task_data_manager.js"
        );
        const scriptElement = document.getElementById(newTaskID + "_Scr");
        await passDataToScript(scriptElement, { taskData: true }, newTaskID);
    });
});
