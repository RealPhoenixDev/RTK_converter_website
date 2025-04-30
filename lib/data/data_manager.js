const board_container = document.getElementById("board_container");
var windowHistory = [];

var data_temp = {};
if (window.localStorage.getItem("task_data"))
  data_temp = JSON.parse(window.localStorage.getItem("task_data"));
var tagData = {};
if (JSON.parse(window.localStorage.getItem("tag_data"))) {
  tagData = JSON.parse(window.localStorage.getItem("tag_data"));
}
function renameKey(obj, oldKey, newKey) {
  const newObj = {};

  for (const key of Object.keys(obj)) {
    if (key === oldKey) {
      newObj[newKey] = obj[oldKey];
    } else {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

function parseID(id) {
  const attributes = id.split("_");
  const globalID = attributes[0].split(",");
  const parsedGlobalID = { fID: globalID[0], sID: globalID[1] };

  if (attributes.length > 2 && attributes.length % 2 == 1) {
    for (let i = 1; i < attributes.length; i += 2) {
      parsedGlobalID[attributes[i]] = attributes[i + 1];
    }
  }
  return parsedGlobalID;
}
function getTaskCount(folderID) {
  const folderData = data_temp[getFolderIndexKey(folderID)];
  return folderData.length;
}

function addTask(data, folderID) {
  data_temp[getFolderIndexKey(folderID)].push(data);
  window.localStorage.setItem("task_data", JSON.stringify(data_temp));
}

function removeTask(globalID) {
  let parsedID = globalID;
  if (typeof globalID === "string" || typeof globalID === "number") {
    parsedID = parseID(`${globalID}`);
  }
  data_temp[getFolderIndexKey(parsedID["fID"])].splice(parsedID["sID"], 1);
  window.localStorage.setItem("task_data", JSON.stringify(data_temp));
}

function setTaskData(data, globalID) {
  let parsedID = globalID;
  if (typeof globalID === "string" || typeof globalID === "number") {
    parsedID = parseID(`${globalID}`);
  }
  data_temp[getFolderIndexKey(parsedID["fID"])][parsedID["sID"]] = data;
  window.localStorage.setItem("task_data", JSON.stringify(data_temp));
}

function moveTaskDataUp(globalID) {
  let parsedID = globalID;
  if (typeof globalID === "string" || typeof globalID === "number") {
    parsedID = parseID(`${globalID}`);
  }
  if (parsedID["sID"] < 1) return;
  const tempTaskAbove =
    data_temp[getFolderIndexKey(parsedID["fID"])][parsedID["sID"] - 1];
  data_temp[getFolderIndexKey(parsedID["fID"])][parsedID["sID"] - 1] =
    data_temp[getFolderIndexKey(parsedID["fID"])][parsedID["sID"]];
  data_temp[getFolderIndexKey(parsedID["fID"])][parsedID["sID"]] =
    tempTaskAbove;
  window.localStorage.setItem("task_data", JSON.stringify(data_temp));
}

function moveTaskDataDown(globalID) {
  let parsedID = globalID;
  if (typeof globalID === "string" || typeof globalID === "number") {
    parsedID = parseID(`${globalID}`);
  }
  if (parsedID["sID"] === getTaskCount(parsedID["fID"]) - 1 + "") return;
  const tempTaskBelow =
    data_temp[getFolderIndexKey(parsedID["fID"])][
      Number.parseInt(parsedID["sID"]) + 1
    ];
  console.log(data_temp[getFolderIndexKey(parsedID["fID"])]);
  data_temp[getFolderIndexKey(parsedID["fID"])][
    Number.parseInt(parsedID["sID"]) + 1
  ] = data_temp[getFolderIndexKey(parsedID["fID"])][parsedID["sID"]];
  data_temp[getFolderIndexKey(parsedID["fID"])][parsedID["sID"]] =
    tempTaskBelow;
  window.localStorage.setItem("task_data", JSON.stringify(data_temp));
}

function getFolderCount() {
  return Object.keys(data_temp).length;
}

function getFolderIndexKey(index) {
  return Object.keys(data_temp)[index];
}

function getFolderData(folderID) {
  return data_temp[getFolderIndexKey(folderID)];
}

function setFolderName(folderID, name) {
  data_temp = renameKey(data_temp, getFolderIndexKey(folderID), name);
  console.log(data_temp);
  window.localStorage.setItem("task_data", JSON.stringify(data_temp));
}

function addFolder(name) {
  data_temp[name] = [];
  window.localStorage.setItem("task_data", JSON.stringify(data_temp));
}

function removeFolder(folderID) {
  delete data_temp[getFolderIndexKey(folderID)];
  window.localStorage.setItem("task_data", JSON.stringify(data_temp));
}

function getTaskData(globalID) {
  let parsedID = globalID;
  if (typeof globalID === "string" || typeof globalID === "number") {
    parsedID = parseID(`${globalID}`);
  }
  return data_temp[getFolderIndexKey(parsedID["fID"])][parsedID["sID"]];
}

// fetches the folder template from files and converts it into text
async function getTemplate(path) {
  const data = await fetch(path);
  const parsedData = await data.text();
  return parsedData;
}

async function insertTemplate(parent, path, id, args, script) {
  let data = await getTemplate(path);
  data = data.replaceAll("{id}", id);
  Object.keys(args).forEach((key, index) => {
    data = data.replaceAll(`{${key}}`, args[key]);
  });
  parent.insertAdjacentHTML("beforeend", data);
  if (script) {
    const scriptElem = document.createElement("script");
    scriptElem.id = id + "_Scr";
    scriptElem.setAttribute("src", script);
    scriptElem.setAttribute("elemID", id);
    const template = document.getElementById(id);
    template.appendChild(scriptElem);
  }
}

function insertScript(parent, id, path) {
  const scriptElem = document.createElement("script");
  scriptElem.id = id;
  scriptElem.setAttribute("src", path);
  scriptElem.setAttribute("elemID", id);
  return parent.appendChild(scriptElem);
}

function removeTemplate(id) {
  document.getElementById(id).remove();
}

// folderID - ID of a specific folder.
// taskID - ID of a specific task in any board.
// globalID - ID of a specific task in a specific board.

async function passDataToScript(script, data, id) {
  let parsedID = id;
  if (typeof id === "string" || typeof id === "number") {
    parsedID = parseID(`${id}`);
  }
  Object.keys(data).forEach((key, index) => {
    script.setAttribute(key, data[key]);
    if (data["folderData"]) {
      script.setAttribute(
        "folderData",
        JSON.stringify(data_temp[getFolderIndexKey(parsedID["fID"])])
      );
    } else if (data["taskData"]) {
      script.setAttribute(
        "taskData",
        JSON.stringify(
          data_temp[getFolderIndexKey(parsedID["fID"])][parsedID["sID"]]
        )
      );
    }
  });
}
