

const board_container = document.getElementById("board_container");


let data_temp = {
  "Test folder": [
    {
      task_name: "This is some task",
      description: "This is a very very real",
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

function getFolderCount() {
  return Object.keys(data_temp).length;
}

function getIndexKey(dict, index) {
  return Object.keys(dict)[index];
}

function getTaskCount(folderID) {
  const folderData = data_temp[getIndexKey(data_temp, folderID)];
  return folderData.length;
}

function initializeFolders() {
  for (let i = 0; i < getFolderCount(); i++) {
    getFolderTemplate().then((data) => {});
  }
}

async function getFolderTemplate() {
  const data = await fetch("./lib/templates/folder.html");
  const parsedData = await data.json();
  return parsedData;
}

console.log(getFolderTemplate());

// folderID - ID of a specific folder.
// taskID - ID of a specific task in any board.
// globalID - ID of a specific task in a specific board.
