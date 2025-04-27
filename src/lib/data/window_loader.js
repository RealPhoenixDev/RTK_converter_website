const mainWindowContainer = document.getElementById("mainWindowContainer");
const usernameWindowContainer = document.getElementById(
    "usernameWindowContainer"
);
const taskBoardContainer = document.getElementById("taskBoardContainer");
const taskWindowContainer = document.getElementById("taskWindowContainer");
const tagSelectContainer = document.getElementById("tagSelectContainer");

const loadedEvent = new Event("loaded");

// fetches the window from files and converts it into text
async function getWindow(path) {
    const data = await fetch(path);
    const parsedData = await data.text();
    return parsedData;
}

async function loadWindows() {
    const mainWindow = await getWindow("/src/lib/windows/main.html");
    mainWindowContainer.insertAdjacentHTML("afterbegin", mainWindow);

    const usernameWindow = await getWindow(
        "/src/lib/windows/usernameSelect.html"
    );
    usernameWindowContainer.insertAdjacentHTML("afterbegin", usernameWindow);
    const taskBoardWindow = await getWindow("/src/lib/windows/taskBoard.html");
    taskBoardContainer.insertAdjacentHTML("afterbegin", taskBoardWindow);

    const taskWindow = await getWindow("/src/lib/windows/taskInfo.html");
    taskWindowContainer.insertAdjacentHTML("afterbegin", taskWindow);

    const tagSelectWindow = await getWindow(
        "/src/lib/windows/tagSelectWindow.html"
    );
    tagSelectContainer.insertAdjacentHTML("afterbegin", tagSelectWindow);
    document.dispatchEvent(loadedEvent);
}

loadWindows();
