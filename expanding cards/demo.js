
(function () {
    let selected_item;
    selected_item = list_items[0];
    selected_item.style.flex = "5"

    list_items.forEach((list_item) => {
        list_item.addEventListener("click", function (e) {
            if (selected_item !== e.target) {
                e.target.style.flex = "5"
                selected_item.style.flex = "0.5";
                selected_item = e.target;
            }
        })
    })
})();