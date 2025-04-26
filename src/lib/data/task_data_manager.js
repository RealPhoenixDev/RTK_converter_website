taskIDArray = [];
taskIDArray.push(parseID(document.currentScript.getAttribute("id")));
id = taskIDArray.at(-1);
taskElementArray = [];
taskElementArray.push(document.getElementById(`${id["fID"]},${id["sID"]}`));
//Event to assign a new element to the task array when create task button is pressed
i = 0;
taskElementArray.forEach((val) => {
    i++;
});
i = 0;
