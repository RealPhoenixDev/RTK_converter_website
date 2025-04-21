function loadUsernameData() {
    const username_window_popup = document.getElementById(
        "username_select_container"
    );
    var innerDoc =
        username_window_popup.contentDocument ||
        username_window_popup.contentWindow.document;
    const username_input = innerDoc.getElementById("username_input");
    const username_submit = innerDoc.getElementById("username_submit");

    let popup_open = false;

    if (!localStorage.getItem("username")) {
        username_window_popup.style.display = "block";
        username_submit.addEventListener("click", (e) => {
            const username = username_input.value;
            localStorage.setItem("username", username);
            username_window_popup.style.display = "none";
        });
    }
}
