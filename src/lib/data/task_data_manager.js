taskIDArray = [];
taskIDArray.push(parseID(document.currentScript.getAttribute("id")));
id = taskIDArray.at(-1);
taskElementArray = [];
taskElementArray.push(document.getElementById(`${id["fID"]},${id["sID"]}`));
//Event to assign a new element to the task array when create task button is pressed
i = 0;
taskElementArray.forEach((val) => {
    val.addEventListener("click", (e) => {
        console.log(val);
        addTask(
            {
                task_name: "Task name",
                description: "",
                date: Date.now(),
                tags: [],
                color: "#F1F1F1",
            },
            id["fID"]
        );
    });
    i++;
});
i = 0;
