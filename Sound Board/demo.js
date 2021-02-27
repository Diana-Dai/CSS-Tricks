(function () {
  const buttons = document.querySelectorAll("button");
  const audios = document.querySelectorAll("audio");

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const name = e.target.innerText;
      const audio = document.querySelector(`#${name}`);
      audio.play();

      audios.forEach((audio) => {
        if (audio.getAttribute("id") !== name) {
          audio.pause();
        };
      })
    })
  })
})();