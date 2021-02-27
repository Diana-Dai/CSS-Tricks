(function () {
  const textarea = document.querySelector("textarea");
  const tagDiv = document.querySelector(".tag")

  const randomTag = function (tags) {
    const lengthSpan = tags.length;
    const randomNum = Math.floor(Math.random() * lengthSpan);
    return tags[randomNum];
  };

  const createHtml = function (value, tagDiv) {
    let html = "";
    const arr = value.split(",");

    arr.forEach((i) => {
      if (i !== "") {
        html += `<span>${i}</span>`;
      }
    })

    tagDiv.innerHTML = html;
  }

  const highlightTag = function (tag) {
    tag.classList.add("active");
  }

  const unhightlightTag = function (tag) {
    tag.classList.remove("active");
  }


  textarea.addEventListener("keydown", function (e) {

    createHtml(textarea.value, tagDiv);

    if (e.key === "Enter") {
      let hightlightTimesLeft = 10;

      const interval = setInterval(() => {
        const tag = randomTag(tagDiv.childNodes);

        highlightTag(tag);


        if (hightlightTimesLeft === 0) {
          clearInterval(interval);
        } else {

          //Cancel highlight
          setTimeout(() => {
            unhightlightTag(tag);
          }, 100);
        }

        hightlightTimesLeft--;
      }, 100);

    }
  })

})();