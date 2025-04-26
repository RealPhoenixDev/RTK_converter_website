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
i = 0;
folderDataArray.forEach((folder) => {
    const taskContainer = taskContainerArray.at(-1);
    const folderID = folderIDArray.at(-1);
    folder.forEach((task) => {
        insertTemplate(
            taskContainer,
            "/src/lib/templates/task.html",
            folderID + "," + i,
            { task_name: task["task_name"] },
            "/src/lib/data/task_data_manager.js"
        );
        i++;
    });
    i = 0;
});

createTaskButtonArray.forEach((button) => {
    const folderID = folderIDArray.at(-1);
    const taskContainer = taskContainerArray.at(-1);
    button.addEventListener("click", (e) => {
        taskContainerArray.push(taskTemp);
        addTask(taskTemp, folderID);
        insertTemplate(
            taskContainer,
            "/src/lib/templates/task.html",
            folderID + "," + taskContainerArray.length - 1,
            { task_name: taskTemp["task_name"] },
            "/src/lib/data/task_data_manager.js"
        );
    });
});
