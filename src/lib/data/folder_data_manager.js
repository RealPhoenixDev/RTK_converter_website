folderIDArray = [];
folderIDArray.push(document.currentScript.getAttribute("elemID"));
folderID = folderIDArray.at(-1);
folderDataArray = [];
folderDataArray.push(
    JSON.parse(document.currentScript.getAttribute("folderData"))
);

taskContainerArray = [];
taskContainerArray.push(document.getElementById(folderID + "_C"));
taskContainer = taskContainerArray.at(-1);

i = 0;
folderDataArray.forEach((folder) => {
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
