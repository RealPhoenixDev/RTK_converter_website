taskTemp = {
    task_name: "Task name",
    description: "",
    date: Date.now(),
    tags: [],
    color: "#F1F1F1",
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
            "/src/lib/templates/task.html",
            globalID,
            { task_name: task["task_name"] },
            "/src/lib/data/task_data_manager.js"
        );
        const scriptElement = document.getElementById(globalID + "_Scr");
        await passDataToScript(scriptElement, { taskData: true }, globalID);
    });
});

createTaskButtonArray.forEach((button) => {
    const taskContainer = taskContainerArray.at(-1);
    const folderID = folderIDArray.at(-1);
    button.addEventListener("click", async (e) => {
        console.log(data_temp);
        const taskCount = getTaskCount(folderID);
        taskContainerArray.push(taskTemp);
        const newTaskID = folderID + "," + taskCount;
        addTask(taskTemp, folderID);
        console.log(taskContainerArray.length - 1);
        await insertTemplate(
            taskContainer,
            "/src/lib/templates/task.html",
            newTaskID,
            { task_name: taskTemp["task_name"] },
            "/src/lib/data/task_data_manager.js"
        );
        const scriptElement = document.getElementById(newTaskID + "_Scr");
        await passDataToScript(scriptElement, { taskData: true }, newTaskID);
    });
});
