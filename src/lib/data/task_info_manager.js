const element = document.getElementById("taskWindowContainer");

// const task = document.getElementById("1,0");

// const target = document.getElementById("myElement");
const self = document.currentScript;

//Window field elements
const taskNameElem = document.getElementById("inputTaskName");
const taskDescElem = document.getElementById("inputTaskDesc");
const taskColorElem = document.getElementById("inputTaskColor");
let id;
let taskData;

// Checks for changes of the style/ display property to fetch data of selected task
const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "attributes" && mutation.attributeName === "style") {
      id = JSON.parse(self.getAttribute("taskID"));
      taskData = JSON.parse(self.getAttribute("taskData"));
      insertData(taskData);
    }
  }
});

observer.observe(element, { attributes: true, attributeFilter: ["style"] });

function insertData(data) {
  taskNameElem.value = data["task_name"];
  taskDescElem.value = data["description"];
  taskColorElem.value = data["color"];
}

const closePopup = document.getElementById("task_popup_X");
closePopup.addEventListener("click", (e) => {
  element.style.display = "none";
  taskData["task_name"] = taskNameElem.value;
  taskData["description"] = taskDescElem.value;
  taskData["color"] = taskColorElem.value;
  taskNameElem.value = "";
  taskDescElem.value = "";
  taskColorElem.value = "";
  // Removing the current script and adding a new one to update data of a task
  setTaskData(taskData, id["fID"] + "," + id["sID"]);
  const oldTaskScript = document
    .getElementById(id["fID"] + "," + id["sID"] + "_Scr")
    .remove();
  let taskElem = document.getElementById(id["fID"] + "," + id["sID"]);
  taskElem.replaceWith(taskElem.cloneNode(true));
  taskElem = document.getElementById(id["fID"] + "," + id["sID"]);
  const newTaskScript = insertScript(
    taskElem,
    id["fID"] + "," + id["sID"] + "_Scr",
    "/src/lib/data/task_data_manager.js"
  );
  passDataToScript(
    newTaskScript,
    { taskData: true },
    id["fID"] + "," + id["sID"]
  );
});
