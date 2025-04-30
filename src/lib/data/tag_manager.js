tagCreateContainer = document.getElementById("tagCreateContainer");
const XBtn = document.getElementById("tagSelectWindowClose");
const tagSelectForm = document.getElementById("tagSelectForm");
const maxChecked = 3;
const tagSubmitButton = document.getElementById("submitTagButton");
const tagCreateButton = document.getElementById("createTagButton");
const tagRemoveButton = document.getElementById("removeTagButton");

const tagManScript = document.currentScript;
let globalID;

tagSelectForm.addEventListener("change", (event) => {
  const checkedBoxes = tagSelectForm.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  if (checkedBoxes.length > maxChecked) {
    // If more than 3, uncheck the one that triggered the event
    event.target.checked = false;
  }
});

tagCreateButton.addEventListener("click", () => {
  tagCreateContainer.style.display = "flex";
});

tagSubmitButton.addEventListener("click", (e) => {
  if (windowHistory.at(-1) !== "tagSelectWindow") {
    return;
  }
  const checkedBoxes = tagSelectForm.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  let selectedTags = [];
  // Goes through each selected checkbox and gets the id of the tag
  checkedBoxes.forEach((val) => {
    selectedTags.push(parseID(val.parentNode.lastChild.id)["fID"]);
  });
  const taskData = getTaskData(globalID);
  taskData["tags"] = selectedTags;
  taskWindowData = taskData;

  windowHistory.pop();

  // Close tag select window
  tagSelectWindow.style.display = "none";
});

tagRemoveButton.addEventListener("click", () => {
  const checkedBoxes = tagSelectForm.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  let selectedTags = [];
  // Goes through each selected checkbox and gets the id of the tag
  let k = 0;
  checkedBoxes.forEach((val) => {
    const valID = parseID(val.parentNode.lastChild.id)["fID"];
    delete tagData[Object.keys(tagData)[valID - k]];
    k++;
  });
  insertTags();
  window.localStorage.setItem("tag_data", JSON.stringify(tagData));
});

XBtn.addEventListener("click", (e) => {
  if (windowHistory.at(-1) !== "tagSelectWindow") {
    return;
  }
  windowHistory.pop();
  tagSelectWindow.style.display = "none";
});

async function insertTags() {
  tagSelectForm.innerHTML = "";
  for (let i = 0; i < Object.keys(tagData).length; i++) {
    await insertTemplate(
      tagSelectForm,
      "./lib/templates/checkboxTag.html",
      `${i}_Sel`,
      {
        color: tagData[Object.keys(tagData)[i]],
        name: Object.keys(tagData)[i],
      }
    );
  }
}

// Checks for changes of the style/ display property to fetch data of selected task`
const tagSelectObserver = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (
      mutation.type === "attributes" &&
      mutation.attributeName === "style" &&
      tagSelectWindow.style.display === "block"
    ) {
      windowHistory.push("tagSelectWindow");
      globalID = JSON.parse(tagManScript.getAttribute("taskID"));
      insertTags();
    }
  }
});

tagSelectObserver.observe(tagSelectContainer, {
  attributes: true,
  attributeFilter: ["style"],
});

// Code for managing tag creation

const tagNameInput = document.getElementById("tagNameInput");
const tagColorInput = document.getElementById("tagColorInput");

// Checks for changes of the style/ display property to show the tag craetion window`
const tagCreatorObserver = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (
      mutation.type === "attributes" &&
      mutation.attributeName === "style" &&
      tagCreateContainer.style.display === "flex"
    ) {
      windowHistory.push("tagCreateWindow");
    }
  }
});

tagCreatorObserver.observe(tagCreateContainer, {
  attributes: true,
  attributeFilter: ["style"],
});

const tagCreateClose = document.getElementById("tagCreateWindowClose");
tagCreateClose.addEventListener("click", () => {
  windowHistory.pop();
  tagCreateContainer.style.display = "none";
  insertTags();
});

tagCreateSubmit = document.getElementById("tagCreateSubmit");

tagCreateSubmit.addEventListener("click", () => {
  if (tagNameInput.value.length < 1) return;
  const newTagName = tagNameInput.value;
  const newTagColor = tagColorInput.value;
  tagData[newTagName] = newTagColor;
  windowHistory.pop();
  tagCreateContainer.style.display = "none";
  insertTags();
  window.localStorage.setItem("tag_data", JSON.stringify(tagData));
});
