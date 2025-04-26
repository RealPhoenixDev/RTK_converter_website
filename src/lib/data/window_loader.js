const mainWindowContainer = document.getElementById("mainWindowContainer");
const usernameWindowContainer = document.getElementById(
    "usernameWindowContainer"
);
const taskBoardContainer = document.getElementById("taskBoardContainer");
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

    document.dispatchEvent(loadedEvent);
}

loadWindows();
