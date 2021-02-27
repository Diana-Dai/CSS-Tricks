(function () {
  const nav = document.querySelector("nav");

  window.addEventListener("scroll", function () {
    if(window.scrollY >= 50){
      nav.className = "scrolled";
    }else{
      nav.className = "";
    }
    })
})();