(function () {
  const items = document.querySelectorAll(".item");
  const fill = document.querySelector(".fill");

  fill.addEventListener("dragstart", dragStart);
  fill.addEventListener("dragend", dragEnd);

  for (item of items) {
    item.addEventListener("dragenter", dragEnter);
    item.addEventListener("dragleave", dragLeave);
    item.addEventListener("dragover", dragOver);
    item.addEventListener("drop", drop);
  }

  function dragStart() {
    this.style.opacity = 0.5;
  }

  function dragEnd() {
    this.style.opacity = 1;

  }

  function dragEnter() {
    this.classList.add("hovered");
  }

  function dragLeave() {
    this.classList.remove("hovered");
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function drop() {
    this.append(fill);
  }
})();