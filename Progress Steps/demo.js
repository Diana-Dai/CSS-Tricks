(function () {
    const preButton = document.querySelector("#prev");
    const nexButton = document.querySelector("#next");
    const progressElements = document.querySelectorAll(".progress_step");
    const progressLine = document.querySelector(".progress_line");

    let selected_items = 0;

    const _buttonController = function (selected_items) {
        if (selected_items === 0) {
            preButton.setAttribute("disabled", "disabled");
        } else {
            preButton.removeAttribute("disabled");
        };

        if (selected_items === 3) {
            nexButton.setAttribute("disabled", "disabled");
        } else {
            nexButton.removeAttribute("disabled");

        }
    }
    _buttonController(selected_items);

    nexButton.addEventListener("click", function (e) {
        selected_items++;
        progressElements[selected_items].classList.add("active");
        progressLine.style.width = `${33.3 * selected_items}%`;
        _buttonController(selected_items);
    })

    preButton.addEventListener("click", function (e) {
        progressElements[selected_items].classList.remove("active");
        selected_items--;
        progressLine.style.width = `${33.3 * selected_items}%`;
        _buttonController(selected_items);
    })

})();