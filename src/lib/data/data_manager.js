const board_container = document.getElementById("board_container");
var activeWindow = "";
var lastActiveWindow = "";

let folderRemoved = 0;

let data_temp = {
  "Test folder": [
    {
      task_name: "This is some task",
      description: "This is a very very real",
      tags: [],
      date: "date",
      color: "#FFFFFF",
    },
    {
      task_name: "Bake a cake",
      description: "Yummy yum yum",
      tags: [],
      date: "date",
      color: "#FFFFFF",
    },
  ],
  "Some other name": [
    {
      task_name: "This another task",
      description: "This is unreal",
      tags: [],
      date: "date",
      color: "#FF00FF",
    },
  ],
};

let tagData = {
  "test tag": "#FF0000",
  school: "#FF52A9",
  home: "#A2C751",
  chores: "#FAFAFA",
};

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
}

function removeTask(globalID) {
  let parsedID = globalID;
  if (typeof globalID === "string" || typeof globalID === "number") {
    parsedID = parseID(`${globalID}`);
  }
  data_temp[getFolderIndexKey(parsedID["fID"])].splice(parsedID["sID"], 1);
}

function setTaskData(data, globalID) {
  let parsedID = globalID;
  if (typeof globalID === "string" || typeof globalID === "number") {
    parsedID = parseID(`${globalID}`);
  }
  data_temp[getFolderIndexKey(parsedID["fID"])][parsedID["sID"]] = data;
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
    Number.parseInt(parsedID["sID"] + 1)
  ] = data_temp[getFolderIndexKey(parsedID["fID"])][parsedID["sID"]];
  data_temp[getFolderIndexKey(parsedID["fID"])][parsedID["sID"]] =
    tempTaskBelow;
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
}

function addFolder(name) {
  data_temp[name] = [];
}

function removeFolder(folderID) {
  delete data_temp[getFolderIndexKey(folderID)];
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
