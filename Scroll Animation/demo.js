(function () {
  const contentElements = document.querySelectorAll(".content");

  const checkElements = function () {
    const triggerBtm = window.innerHeight / 5 * 4;

    contentElements.forEach((item) => {
      const itemTop = item.getBoundingClientRect().top;

      if (itemTop < triggerBtm) {
        item.classList.add("show");
      } else {
        item.classList.remove("show");
      }
    })
  }
  
  window.addEventListener("scroll", checkElements);
  checkElements();
})();