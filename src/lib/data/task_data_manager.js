taskIDArray = [];
taskIDArray.push(parseID(document.currentScript.getAttribute("id")));
_id = taskIDArray.at(-1);
taskElementArray = [];
taskElementArray.push(document.getElementById(`${_id["fID"]},${_id["sID"]}`));
taskDataArray = [];
taskDataArray.push(JSON.parse(document.currentScript.getAttribute("taskData")));

taskScript = document.currentScript;

//Event to assign a new element to the task array when create task button is pressed
i = 0;
taskElementArray.forEach((val) => {
  const id = taskIDArray.at(-1);
  const windowElement = document.getElementById("taskWindowContainer");
  const taskInfoScript = document.getElementById("taskInfoScr");
  let taskData = taskDataArray.at(-1);
  // On click passes data about itself to the task editor window
  val.addEventListener("click", (e) => {
    passDataToScript(
      taskInfoScript,
      {
        taskID: JSON.stringify(id),
        taskData: JSON.stringify(taskData),
        taskScript: taskScript,
      },
      id["fID"] + "," + id["sID"]
    );
    windowElement.style.display = "flex";
  });

  //Updating task name and color
  const taskNameElem = document.getElementById(
    id["fID"] + "," + id["sID"] + "_N"
  );
  taskNameElem.innerHTML = taskData["task_name"];
  val.style.backgroundColor = taskData["color"];

  i++;
});
i = 0;
