const openTaskBoardBtn = document.getElementById("openTaskBoardBtn");
const openSettingsBtn = document.getElementById("openSettingsBtn");

function loadUsernameData() {
  const username_span = document.getElementById("username_span");
  const container = document.getElementById("usernameWindowContainer");

  const username_input = document.getElementById("username_input");
  const username_submit = document.getElementById("username_submit");

  let popup_open = false;

  if (!localStorage.getItem("username")) {
    container.style.display = "flex";
    windowHistory.push("usernameWindow");
    username_input.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        username_submit.click();
      }
    });
    username_submit.addEventListener("click", (e) => {
      const username = username_input.value;
      localStorage.setItem("username", username);
      container.style.display = "none";
      windowHistory.pop();

      // username_span.innerHTML = localStorage.getItem("username");
    });
  }
  // username_span.innerHTML = localStorage.getItem("username");
}

document.addEventListener("loaded", () => {
  //   loadUsernameData();
});

openTaskBoardBtn.addEventListener("click", () => {
  if (windowHistory.length !== 0) return;
  taskBoardContainer.style.display = "flex";
  windowHistory.push("taskBoard");
});

openSettingsBtn.addEventListener("click", () => {
  if (windowHistory.length !== 0) return;
  optionContainer.style.display = "flex";
  windowHistory.push("optionContainer");
});
