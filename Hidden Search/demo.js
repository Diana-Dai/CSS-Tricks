(function () {
    const searchLogo = document.querySelector("button");
    const searchInput = document.querySelector("input");

    searchLogo.addEventListener("click", function (e) {
        searchInput.classList.toggle("close");
      })
})();