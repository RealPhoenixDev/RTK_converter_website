const mainWindowContainer = document.getElementById("mainWindowContainer");
const usernameWindowContainer = document.getElementById(
  "usernameWindowContainer"
);
const taskBoardContainer = document.getElementById("taskBoardContainer");
const taskWindowContainer = document.getElementById("taskWindowContainer");
const tagSelectContainer = document.getElementById("tagSelectContainer");
let tagCreateContainer = document.getElementById("tagCreateContainer");

const loadedEvent = new Event("loaded");

// fetches the window from files and converts it into text
async function getWindow(path) {
  const data = await fetch(path);
  const parsedData = await data.text();
  return parsedData;
}

async function loadWindows() {
  console.log("asd");
  const mainWindow = await getWindow("./lib/windows/main.html");
  mainWindowContainer.insertAdjacentHTML("afterbegin", mainWindow);

  const usernameWindow = await getWindow("./lib/windows/usernameSelect.html");
  usernameWindowContainer.insertAdjacentHTML("afterbegin", usernameWindow);
  const taskBoardWindow = await getWindow("./lib/windows/taskBoard.html");
  taskBoardContainer.insertAdjacentHTML("afterbegin", taskBoardWindow);

  const taskWindow = await getWindow("./lib/windows/taskInfo.html");
  taskWindowContainer.insertAdjacentHTML("afterbegin", taskWindow);

  const tagSelectWindow = await getWindow("./lib/windows/tagSelectWindow.html");
  tagSelectContainer.insertAdjacentHTML("afterbegin", tagSelectWindow);
  const tagCreateWindow = await getWindow("./lib/windows/tagCreateWindow.html");
  tagCreateContainer.insertAdjacentHTML("afterbegin", tagCreateWindow);

  document.dispatchEvent(loadedEvent);
}

loadWindows();
