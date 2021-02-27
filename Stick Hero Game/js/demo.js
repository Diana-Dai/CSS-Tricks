const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const restartButton = document.querySelector("#restart");
const introductionButton = document.querySelector("#introduction");
const scoreButton = document.querySelector("#score");
const perfectNotification = document.querySelector("#perfect");
const recordButton = document.querySelector("#record");
const newRecordButton = document.querySelector("#newRecord");

const platformHeight = 200;
const _perfectAreaSize = 10

const animateDatas = {
    phase: undefined, // "waiting" || "stretching" || "turning" || "walking" || "transitioning" || "falling"
    score: 0,
    sceneOffset: 0
}



class GetAndDrawController {
    constructor() {
        this.treesList = []; //{x: , color: }
        this.platformsList = []; //{x: , width: }
        this.hillsList = [{
            height: 150,
            amplitude: 10,
            stretch: 1,
            color: "#95C629"
        }, {
            height: 120,
            amplitude: 20,
            stretch: 0.5,
            color: "#659F1C"
        }]
        this.sticksList = []; //{x: , length: , rotation: }
        this.heroList = {}; //{x: , y: }
        this.heroDistanceFromEdge = 4;
    }
    drawElements(element) {
        const args = this[element + "List"];
        drawElementsFuncs[element](args);
    }
    generateElements(element) {
        generateElementsFuncs[element]();
    }


};

const drawElementsFuncs = {
    platforms: (function () {
        let _platformHeight = 200;

        const _perfectHits = function (x, width) {
            ctx.fillStyle = "red";
            ctx.fillRect(
                x + width / 2 - _perfectAreaSize / 2,
                0,
                _perfectAreaSize,
                _perfectAreaSize
            );
        }
        return function (list) {
            list.forEach(({
                x,
                width
            }) => {
                ctx.fillStyle = "#663300";
                ctx.fillRect(x, 0, width, _platformHeight);
                _perfectHits(x, width);
            })
        }
    })(),
    trees: function (list) {
        let _trunkHeight = 5,
            _trunkWidth = 2,
            _crownHeight = 25,
            _crownWidth = 10;


        list.forEach(({
            x,
            color
        }) => {
            ctx.save();
            const treeCenterPosX = x + _crownWidth / 2 - animateDatas.sceneOffset;

            //FIX 
            const treeCenterPosY = this._getPosY(x, 150, 10, 1) - _trunkHeight;
            ctx.translate(treeCenterPosX, treeCenterPosY);

            //Draw tree trunk
            ctx.fillStyle = "#663300";
            ctx.fillRect(-_trunkWidth / 2, 0, _trunkWidth, _trunkHeight);

            //Draw tree crown
            ctx.beginPath();
            ctx.moveTo(-_crownWidth / 2, 0);
            ctx.lineTo(0, -_crownHeight);
            ctx.lineTo(_crownWidth / 2, 0);
            ctx.lineTo(-_crownWidth / 2, 0);
            ctx.fillStyle = color;
            ctx.fill();

            ctx.restore();
        })
    },
    hills: function (list) {
        list.forEach(({
            height,
            amplitude,
            stretch,
            color
        }) => {
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.moveTo(window.innerWidth, window.innerHeight);
            for (let i = window.innerWidth; i >= 0; i--) {
                ctx.lineTo(i, this._getPosY(i + animateDatas.sceneOffset, height, amplitude, stretch));
            };
            ctx.lineTo(0, window.innerHeight);
            ctx.fill();
        })
    },
    hero: (function () {
        const _width = 17,
            _height = 30,
            _distanceFromEdge = 4;

        const _drawRoundedRect = function (x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x, y + radius);
            ctx.lineTo(x, y + height - radius);
            ctx.arcTo(x, y + height, x + radius, y + height, radius);
            ctx.lineTo(x + width - radius, y + height);
            ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
            ctx.lineTo(x + width, y + radius);
            ctx.arcTo(x + width, y, x + width - radius, y, radius);
            ctx.lineTo(x + radius, y);
            ctx.arcTo(x, y, x, y + radius, radius);
            ctx.fill();
        }

        return function (list) {
            const [x, y] = [list.x, list.y];
            ctx.save();
            ctx.fillStyle = "black";

            //Move canvas to the position of Hero
            ctx.translate(
                x - _distanceFromEdge - _width / 2,
                y - _height / 2
            );

            // Body
            _drawRoundedRect(
                -_width / 2,
                -_height / 2,
                _width,
                _height - 4,
                5
            );

            // Legs
            const legDistance = 5;
            ctx.beginPath();
            ctx.arc(legDistance, 11.5, 3, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(-legDistance, 11.5, 3, 0, Math.PI * 2, false);
            ctx.fill();

            // Eye
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.arc(5, -7, 3, 0, Math.PI * 2, false);
            ctx.fill();

            // Band
            ctx.fillStyle = "red";
            ctx.fillRect(-_width / 2 - 1, -12, _width + 2, 4.5);
            ctx.beginPath();
            ctx.moveTo(-9, -14.5);
            ctx.lineTo(-17, -18.5);
            ctx.lineTo(-14, -8.5);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(-10, -10.5);
            ctx.lineTo(-15, -3.5);
            ctx.lineTo(-5, -7);
            ctx.fill();

            ctx.restore();
        }
    })(),
    sticks: function (list) {
        list.forEach(({
            x,
            length,
            rotation
        }) => {
            ctx.save();
            ctx.translate(x, 0)
            ctx.rotate(Math.PI / 180 * rotation);

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -length);
            ctx.stroke()

            ctx.restore();
        })
    },
    background: function () {
        const gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
        gradient.addColorStop(0, "#70af85");
        gradient.addColorStop(1, "#c6ebc9");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    },
    _getPosY: function () {
        [posX, hillBaseHeight, hillAmplitude, hillStretch] = [...arguments];
        const hillHeight = Math.sin(Math.PI / 180 * posX * hillStretch) * hillAmplitude + hillBaseHeight;
        return window.innerHeight - hillHeight;
    }

};

const getAndDrawController = new GetAndDrawController();

const generateElementsFuncs = {
    platforms: (function () {
        const _minWidth = 20,
            _maxWidth = 60,
            _minGap = 50,
            _maxGap = 200;

        const generator = function () {
            const width = Math.random() * (_maxWidth - _minWidth) + _minWidth;
            const gap = Math.random() * (_maxGap - _minGap) + _minGap;

            const platformList = getAndDrawController.platformsList;
            const platformListLast = platformList[platformList.length - 1];

            const x = platformListLast.x + platformListLast.width + gap;
            platformList.push({
                x,
                width
            });

        }

        return function (number) {
            for (let i = 0; i < number; i++) {
                generator();
            }
        }

    })(),
    trees: (function () {
        const _color = ["#95C629", "#659F1C"],
            _minGap = 50,
            _maxGap = 100;

        const generator = function () {
            const colorNum = Math.floor(Math.random() * 2);
            const randomX = Math.floor(Math.random() * (_maxGap - _minGap) + _minGap);

            const treesList = getAndDrawController.treesList;
            const lastTree = treesList[treesList.length - 1];

            const x = lastTree ? lastTree.x + randomX : randomX;
            treesList.push({
                x,
                color: _color[colorNum]
            });
        }

        return function (number) {
            for (let i = 0; i < number; i++) {
                generator();
            }
        }
    })()
};

const draw = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //draw background\hills\trees
    ctx.save();
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    getAndDrawController.drawElements("background");
    getAndDrawController.drawElements("hills");
    getAndDrawController.drawElements("trees");

    ctx.restore();

    //draw platforms\hero\sticks
    ctx.save();
    ctx.translate((window.innerWidth - 400) / 2 - animateDatas.sceneOffset, window.innerHeight - platformHeight);

    getAndDrawController.drawElements("hero");
    getAndDrawController.drawElements("platforms");
    getAndDrawController.drawElements("sticks");

    ctx.restore();

};

const resetGame = function () {
    animateDatas.sceneOffset = 0;
    restartButton.classList.add("hide");
    animateDatas.phase = "waiting";
    animateDatas.score = 0;
    scoreButton.innerHTML = animateDatas.score;

    getAndDrawController.platformsList = [{
        x: 10,
        width: 30
    }];

    const firstPlatform = getAndDrawController.platformsList[0]
    getAndDrawController.sticksList = [{
        x: firstPlatform.x + firstPlatform.width,
        length: 0,
        rotation: 0
    }];

    const heroX = firstPlatform.x + firstPlatform.width;
    getAndDrawController.heroList = {
        x: heroX,
        y: 0
    };

    generateElementsFuncs.platforms(5);

    generateElementsFuncs.trees(5);

    draw();
};


(function () {
    recordButton.innerHTML = "record" + " " + localStorage.getItem("record");

    resetGame();

    //Set event listeners
    restartButton.addEventListener("click", (e) => {
        resetGame();
        e.preventDefault();
        restartButton.classList.add("hide");
    })
    window.addEventListener("mousedown", () => {
        if (animateDatas.phase === "waiting") {
            introductionButton.style.opacity = 0;
            lastTimeStamp = undefined;
            animateDatas.phase = "stretching";
            window.requestAnimationFrame(animate);
        }
    })
    window.addEventListener("mouseup", () => {
        if (animateDatas.phase === "stretching") {
            animateDatas.phase = "turning";
        }
    })
    window.addEventListener("resize", () => {
        draw();
    });

})()

const animateStrategys = (function () {
    let nextPlatform, hitsPerfectArea;

    const _stickHitThePlatform = function (stick) {
        let [nextPlatform] = getAndDrawController.platformsList.filter(platform => {
            return platform.x < stick.x + stick.length && stick.x + stick.length < platform.x + platform.width;
        });
        if (nextPlatform) {
            const perfectAreaStartPoint = nextPlatform.x + (nextPlatform.width - _perfectAreaSize) / 2;
            const perfectAreaEndPoint = nextPlatform.x + (nextPlatform.width + _perfectAreaSize) / 2;
            const stickHitPoint = stick.x + stick.length;
            if (stickHitPoint >= perfectAreaStartPoint && stickHitPoint <= perfectAreaEndPoint) {
                return [nextPlatform, true]
            }
        }
        return [nextPlatform, false];
    };

    const _lastItem = function (arr) {
        return arr[arr.length - 1]
    }
    return {
        waiting() {},
        stretching(timeStampDiference) {
            const stretchingSpeed = 4;
            const stickLength = timeStampDiference / stretchingSpeed;

            _lastItem(getAndDrawController.sticksList).length += stickLength;
        },
        turning(timeStampDiference) {
            const turningSpeed = 4;
            const rotation = timeStampDiference / turningSpeed;

            const lastStick = _lastItem(getAndDrawController.sticksList)

            lastStick.rotation += rotation;
            if (lastStick.rotation > 90) {

                lastStick.rotation = 90;
                [nextPlatform, hitsPerfectArea] = _stickHitThePlatform(lastStick);
                animateDatas.score += hitsPerfectArea ? 2 : 1;
                if (hitsPerfectArea) {
                    perfectNotification.animate([{
                            opacity: 0
                        },
                        {
                            opacity: 1,
                            offset: 0.4
                        },
                        {
                            opacity: 0
                        }
                    ], {
                        duration: 2000,
                        delay: 0,
                        fill: 'forwards',
                    });
                }

                scoreButton.innerHTML = animateDatas.score;
                return animateDatas.phase = "walking";
            }
        },
        walking(timeStampDiference) {
            const walkingSpeed = 4;

            const walkingDistance = timeStampDiference / walkingSpeed;

            getAndDrawController.heroList.x += walkingDistance;

            const lastStick = _lastItem(getAndDrawController.sticksList)
            if (nextPlatform) {

                const heroNeedToPoint = nextPlatform.x + nextPlatform.width - getAndDrawController.heroDistanceFromEdge;
                if (getAndDrawController.heroList.x >= heroNeedToPoint) {
                    getAndDrawController.heroList.x = heroNeedToPoint;

                    getAndDrawController.sticksList.push({
                        x: nextPlatform.x + nextPlatform.width,
                        length: 0,
                        rotation: 0
                    });

                    return animateDatas.phase = "transitioning";
                }
            } else {
                const heroNeedToPoint = lastStick.x + lastStick.length + getAndDrawController.heroDistanceFromEdge;
                if (getAndDrawController.heroList.x >= heroNeedToPoint) {
                    getAndDrawController.heroList.x = heroNeedToPoint;
                    return animateDatas.phase = "falling";
                }

            }
        },
        transitioning(timeStampDiference) {
            const transitionDistance = timeStampDiference / 4;
            animateDatas.sceneOffset += transitionDistance;
            const sceneOffsetMax = getAndDrawController.sticksList[getAndDrawController.sticksList.length - 2].x + getAndDrawController.sticksList[getAndDrawController.sticksList.length - 2].length;
            if (animateDatas.sceneOffset >= sceneOffsetMax) {
                animateDatas.sceneOffset = sceneOffsetMax;

                generateElementsFuncs.platforms(2);
                generateElementsFuncs.trees(2);

                return animateDatas.phase = "waiting";
            }
        },
        falling(timeStampDiference) {
            const lastStick = _lastItem(getAndDrawController.sticksList);
            const fallDistance = timeStampDiference / 1.5;
            const rotationDegree = timeStampDiference / 4;


            getAndDrawController.heroList.y += fallDistance;
            lastStick.rotation += rotationDegree;
            if (lastStick.rotation > 180) {
                lastStick.rotation = 180;

                //Check if break the record
                if (animateDatas.score > localStorage.getItem("record")) {
                    localStorage.setItem("record", animateDatas.score);
                    recordButton.innerHTML = "record" + " " + localStorage.getItem("record");
                    newRecordButton.animate([{
                            opacity: 0
                        },
                        {
                            opacity: 1,
                            offset: 0.4
                        },
                        {
                            opacity: 0
                        }
                    ], {
                        duration: 2000,
                        delay: 0,
                        fill: 'forwards',
                    });
                    setTimeout(() => {
                        restartButton.classList.remove("hide")
                    }, 2500);

                }
                restartButton.classList.remove("hide")


                return;
            }
        }
    }
})();


const animate = function (timeStamp) {
    if (!lastTimeStamp) {
        lastTimeStamp = timeStamp;
        window.requestAnimationFrame(animate);
        return;
    }

    const timeStampDiference = timeStamp - lastTimeStamp;

    // switch (phase) {
    //     case "waiting":
    //         return
    //     case "stretching":
    //         animateStrategys.stretching(timeStampDiference);
    //         break;
    //     case "turning":
    //         animateStrategys.turning(timeStampDiference);
    //         break;
    //     case "walking":
    //         animateStrategys.walking(timeStampDiference);
    //         break;
    //     case "transitioning":
    //         animateStrategys.transitioning(timeStampDiference);
    //         break;
    //     case "falling":
    //         animateStrategys.falling(timeStampDiference);

    // }

    eval(`animateStrategys.${animateDatas.phase}(${timeStampDiference})`);

    draw();
    window.requestAnimationFrame(animate);
    lastTimeStamp = timeStamp;
};