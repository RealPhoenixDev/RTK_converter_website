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

function getFolderCount() {
    return Object.keys(data_temp).length;
}

function getFolderIndexKey(index) {
    return Object.keys(data_temp)[index];
}

function getTaskCount(folderID) {
    const folderData = data_temp[getFolderIndexKey(folderID)];
    return folderData.length;
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

function setFolderData(data, name) {
    data_temp[name] = data;
}

function addTask(data, folderID) {
    data_temp[getFolderIndexKey(folderID)].push(data);
}

function setTaskData(data, globalID) {
    globalID = parseID(globalID);
    data_temp[getFolderIndexKey(globalID["fID"])][globalID["sID"]] = data;
}

function getFolderData(folderID) {
    return data_temp[getFolderIndexKey(folderID)];
}

function getTaskData(globalID) {
    const parsedID = parseID(globalID);
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
    const parsedID = parseID(`${id}`);
    const elem = document.getElementById(script);
    Object.keys(data).forEach((key, index) => {
        if (data["folderData"]) {
            script.setAttribute(
                "folderData",
                JSON.stringify(data_temp[getFolderIndexKey(parsedID["fID"])])
            );
            return;
        } else if (data["taskData"]) {
            script.setAttribute(
                "taskData",
                JSON.stringify(
                    data_temp[getFolderIndexKey(parsedID["fID"])][
                        parsedID["sID"]
                    ]
                )
            );
            return;
        }
        elem.setAttribute(`{${key}}`, data[key]);
    });
}
