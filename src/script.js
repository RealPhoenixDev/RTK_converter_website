const usename_span = document.getElementById("username_span");

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
        username_input.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                username_submit.click();
            }
        });
        username_submit.addEventListener("click", (e) => {
            const username = username_input.value;
            localStorage.setItem("username", username);
            username_window_popup.style.display = "none";
            username_span.innerHTML = localStorage.getItem("username");
        });
    }
}

username_span.innerHTML = localStorage.getItem("username");

const data_structure_template = {
    folder_name: [
        {
            task_name: "",
            description: "",
            tags: [],
            date: "date",
            color: "#FFFFFF",
            type: "text | checkbox",
            status: "default | pending | completed",
        },
        { task_name: "" },
        { task_name: "" },
        { task_name: "" },
    ],
};
