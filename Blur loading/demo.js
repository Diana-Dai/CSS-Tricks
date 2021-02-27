(function () {
    const bgElement = document.querySelector(".bg");
    const counterElement = document.querySelector(".counter");

    const countTime = 5;

    let time = 0;

    const interval = setInterval(()=>{
      if(time === 100){        
        clearInterval(interval);
      }
      if(time === 80){
        bgElement.style.filter = "blur(0)";
        counterElement.style.opacity = 0;
      }
      counterElement.innerHTML = `${time++}%`;
    },20)
    
})();