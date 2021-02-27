//Check the form only when submit
const registerForm = document.querySelector(".form");
const submitButton = document.querySelector("button");

const checkStrategys = {
    isNotEmpty: function (value, errMsg) {
        if (value === "") {
            return errMsg
        }
    },
    validEmail: function (value, errMsg) {
        if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
            return errMsg
        }
    },
    validPassword: function (value, errMsg) {
        if (!/^\w{5,17}$/.test(value)) {
            return errMsg
        }
    },
    confirmPassword: function (valueNew, errMsg) {
        const valueOld = registerForm.password.value;
        if (valueOld !== valueNew || valueNew === "") {
            return errMsg
        }
    }
}

const validator = (function () {
    let cache = [];
    return {
        add: function (dom, arr) {
            for (let i = 0, item; item = arr[i++];) {
                const {
                    strategy,
                    errMsg
                } = item;
                cache.push(function () {
                    const notValid = checkStrategys[strategy](dom.value, errMsg);
                    return [dom, notValid];
                })
            }

        },
        start: function () {
            let formIsValid = true;
            for (var i = 0, validatorFunc; validatorFunc = cache[i++];) {
                const [dom, notValid] = validatorFunc();
                if (notValid) {
                    dom.nextElementSibling.innerText = notValid;
                    dom.classList.add("error");
                    formIsValid = false;
                } else {
                    dom.classList.add("valid");
                }

            }
            return formIsValid
        }

    }
})()

validator.add(registerForm.username, [{
    strategy: "isNotEmpty",
    errMsg: "Please enter username"
}]);
validator.add(registerForm.email, [{
    strategy: "isNotEmpty",
    errMsg: "Please enter email"
}, {
    strategy: "validEmail",
    errMsg: "Email is not valid"
}]);
validator.add(registerForm.password, [{
    strategy: "validEmail",
    errMsg: "Password must to be more than 6 letters and less than 11 letters"
}])

validator.add(registerForm.confirmPassword, [{
    strategy: "confirmPassword",
    errMsg: "Password doesn't match"
}])

registerForm.onsubmit = function () {
    const formIsValid = debounce(validator.start, 2000, true)();
    if (!formIsValid) {
        return false;
    }
};

const debounce = function (func, wait, immediate) {
    var timeout, result;

    return function () {
        const context = this;
        clearTimeout(timeout)
        if (immediate) {
            const callNow = !timeout;
            timeout = setTimeout(()=>{
                timeout = null;
            }, wait)
            if (callNow) {
                result = func();
            }
        } else {
            timeout = setTimeout(function () {
                func.apply(context)
            }, wait);
        }
    }
}