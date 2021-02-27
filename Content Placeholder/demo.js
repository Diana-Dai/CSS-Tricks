(function () {
  const imgwrapper = document.querySelector(".imgwrapper");
  const title = document.querySelector("h3");
  const text = document.querySelector(".text");
  const profile = document.querySelector(".profile");
  const info = document.querySelector(".info");
  const animatedItems = document.querySelectorAll(".animated-bg");

  const loadItems = function () {
    animatedItems.forEach((item)=>{
      debugger
      item.classList.remove("animated-bg");
    })
    imgwrapper.innerHTML = `<img src="./img.jpg">`;
    title.innerHTML = `Lorem ipsum dolor sit amet`;
    text.innerHTML = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore perferendis`;
    profile.innerHTML = `<img src="./profile.jpeg">`;
    info.innerHTML = `<strong class="name">John Doe</strong><small class="date">Oct 08, 2020</small>`;
  }

  setTimeout(()=>{
    loadItems();
  },2400);
})();