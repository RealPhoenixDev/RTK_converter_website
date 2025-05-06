async function initializeData() {
  const boardContainer = document.getElementById("folder_container");
  // I did this because any other solution would take too much time I cannot be bothered
  boardContainer.innerHTML = `<div class="folder_element" style="order: 2; border: none">
                                  <div id="folderCreateBtnContainer">
                                      <button id="folderCreateBtn">
                                          <svg
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg">
                                              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                              <g
                                                  id="SVGRepo_tracerCarrier"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"></g>
                                              <g id="SVGRepo_iconCarrier">
                                                  <path
                                                      d="M6 12H12M18 12H12M12 12V6M12 12V18"
                                                      stroke="#7c4e6c"
                                                      stroke-width="1.5"
                                                      stroke-linecap="round"
                                                      stroke-linejoin="round"></path>
                                              </g>
                                          </svg>
                                      </button>
                                  </div>
                              </div>`;
  const folderCreateBtn = document.getElementById("folderCreateBtn");
  folderCreateBtn.addEventListener("click", async () => {
    const boardContainer = document.getElementById("folder_container");
    let newfolderName = "Mapes nosaukums" + getFolderCount();
    if (data_temp[newfolderName]) newfolderName += " 1";
    await addFolder(newfolderName);
    await insertTemplate(
      boardContainer,
      "./lib/templates/folder.html",
      getFolderCount() - 1,
      {
        folderName: getFolderIndexKey(getFolderCount() - 1),
      },
      "./lib/data/folder_data_manager.js"
    );
    const scriptElement = document.getElementById(
      getFolderCount() - 1 + "_Scr"
    );
    await passDataToScript(
      scriptElement,
      { folderData: true },
      getFolderCount() - 1
    );
  });
  for (let i = 0; i < getFolderCount(); i++) {
    await insertTemplate(
      boardContainer,
      "./lib/templates/folder.html",
      i,
      {
        folderName: getFolderIndexKey(i),
      },
      "./lib/data/folder_data_manager.js"
    );

    const scriptElement = document.getElementById(i + "_Scr");
    passDataToScript(scriptElement, { folderData: true }, i);
  }
}
document.addEventListener("loaded", () => {
  initializeData();
  insertScript(document.body, "taskInfoScr", "./lib/data/task_info_manager.js");
  insertScript(document.body, "tagSelectScr", "./lib/data/tag_manager.js");
  insertScript(
    document.body,
    "optionsScript",
    "./lib/data/settings_manager.js"
  );
  const taskBoardCloseBtn = document.getElementById("taskBoardCloseBtn");

  taskBoardCloseBtn.addEventListener("click", () => {
    if (windowHistory.at(-1) !== "taskBoard") return;
    taskBoardContainer.style.display = "none";
    windowHistory.pop();
  });
});
