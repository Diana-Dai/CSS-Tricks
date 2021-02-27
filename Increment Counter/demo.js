(function () {
  const counters = document.querySelectorAll(".counter")
  const twitterCounter = counters[0];
  const youtubeCounter = counters[1];
  const facebookCounter = counters[2];
  console.log("1");
  const counterFunc = function (counter, number) {
    let countingNumber = 0;
    debugger
    const timeInverval = setInterval(()=>{
        if(countingNumber === number){
          clearInterval(timeInverval);
        }
        counter.innerText = countingNumber;

        countingNumber += 100;
    }, 10)
    }

    counterFunc(twitterCounter, 12200);
    counterFunc(youtubeCounter, 2200);
    counterFunc(facebookCounter, 1200);

})();