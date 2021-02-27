const clipboardBtn = document.getElementById("clipboard");
const resultElm = document.getElementById("result");
const lengthElm = document.getElementById("length");
const uppercaseElm = document.getElementById("uppercase");
const lowercaseElm = document.getElementById("lowercase");
const numbersElm = document.getElementById("numbers");
const symbolsElm = document.getElementById("symbols");
const submitBtn = document.getElementById("submit");

const addSettings = [uppercaseElm.checked, lowercaseElm.checked, numbersElm.checked, symbolsElm.checked];

const passwordfuns = [getRandomLower, getRandomUpper, getRandomNumber, getRandomSymbol];

const getPassword = (function () {
  let getPassowrdFuncs = [],
    res = "";

  //Filter the functions
  addSettings.forEach((setting, i) => {
    if (setting) {
      getPassowrdFuncs.push(passwordfuns[i]);
    }
  })

  return function (length) {
    res = "";
    for (let i = 0; i < length; i++) {
      const randomNum = Math.floor(Math.random() * 4);
      console.log(randomNum)
      res += getPassowrdFuncs[randomNum]();
    }
    console.log(res.length)
    return res
  }

})();

const copyPassword = function () {
  const textarea = document.createElement("textarea");
  const password = resultElm.innerText;

  if(!password){return}

  textarea.value = password;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
  alert('Password copied to clipboard!');
}

submitBtn.addEventListener("click", function () {
  resultElm.innerText = getPassword(lengthElm.value);
})

clipboardBtn.addEventListener("click", copyPassword)

function getRandomLower() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 97)
}

function getRandomUpper() {
  return String.fromCharCode(Math.floor(Math.random() * 26) + 65)
}

function getRandomNumber() {
  return String.fromCharCode(Math.floor(Math.random() * 10) + 48)
}

function getRandomSymbol() {
  const symbols = '!@#$%^&*(){}[]=<>/,.'
  return symbols[Math.floor(Math.random() * symbols.length)]
}