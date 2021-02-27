(function () {
  const buttons= document.querySelectorAll("button");

  buttons.forEach((button)=>{
    button.addEventListener("click", function (e) {
      button.parentElement.classList.toggle("active")})
  })
})();