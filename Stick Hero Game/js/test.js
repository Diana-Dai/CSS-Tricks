const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const restartButton = document.querySelector("#restart");
const introductionButton = document.querySelector("#introduction");
const socreElement = document.querySelector("#score");
const getPosY = function (posX, hillBaseHeight, hillAmplitude, hillStretch) {
    const hillHeight = Math.sin(Math.PI / 180 * posX * hillStretch) * hillAmplitude + hillBaseHeight;
    return window.innerHeight - hillHeight;
}
let sceneOffset = 0;
let lastTimeStamp, phase = "waiting";
let nextPlatform;

class Platform {
    constructor() {
        this.height = 200;
    }
    draw(x, width) {
        ctx.fillStyle = "#663300";
        ctx.fillRect(x, 0, width, this.height);
    }
    generate() {
        const minWidth = 20,
            maxWidth = 40,
            minGap = 50,
            maxGap = 200;
        const width = Math.random() * (maxWidth - minWidth) + minWidth;
        const gap = Math.random() * (maxGap - minGap) + minGap;
        const x = Platform.list[Platform.list.length - 1].x + Platform.list[Platform.list.length - 1].width + gap;
        Platform.list.push({
            x,
            width
        });
    }
}
class Tree {
    constructor() {
        this._trunkHeight = 5;
        this._trunkWidth = 2;
        this._crownHeight = 25;
        this._crownWidth = 10;
        this.color = ["#95C629", "#659F1C"];
    }
    draw(x, y, color) {
        ctx.save();
        const treeCenterPosX = x + this._crownWidth / 2 - sceneOffset;
        const treeCenterPosY = y - this._trunkHeight;
        ctx.translate(treeCenterPosX, treeCenterPosY);
        //Draw tree trunk
        ctx.fillStyle = "#663300";
        ctx.fillRect(-this._trunkWidth / 2, 0, this._trunkWidth, this._trunkHeight);
        //Draw tree crown
        ctx.beginPath();
        ctx.moveTo(-this._crownWidth / 2, 0);
        ctx.lineTo(0, -this._crownHeight);
        ctx.lineTo(this._crownWidth / 2, 0);
        ctx.lineTo(-this._crownWidth / 2, 0);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.restore();
    }
    generate() {
        const lastTree = Tree.list[Tree.list.length - 1];
        const colorNum = Math.floor(Math.random() * 2);
        const minGap = 50,
            maxGap = 200;
        const randomX = Math.floor(Math.random() * (maxGap - minGap) + minGap);
        const posX = lastTree ? lastTree.x + randomX : randomX;
        Tree.list.push({
            x: posX,
            y: getPosY(posX, 150, 10, 1),
            color: this.color[colorNum]
        });
    }

}
class Hill {
    constructor(baseHeight, amplitude, stretch, color) {
        this.height = baseHeight;
        this.amplitude = amplitude;
        this.stretch = stretch;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.moveTo(window.innerWidth, window.innerHeight);
        for (let i = window.innerWidth; i >= 0; i--) {
            ctx.lineTo(i, getPosY(i + sceneOffset, this.height, this.amplitude, this.stretch));
        };
        ctx.lineTo(0, window.innerHeight);
        ctx.fill();
    }
}
class Hero {
    constructor() {
        this.width = 17,
            this.height = 30;
    }
    draw(x, y) {
        ctx.save();
        ctx.fillStyle = "black";
        ctx.translate(
            x - Hero.distanceFromEdge - this.width / 2,
            y - this.height / 2
        );

        // Body
        this._drawRoundedRect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height - 4,
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
        ctx.fillRect(-this.width / 2 - 1, -12, this.width + 2, 4.5);
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

    _drawRoundedRect(x, y, width, height, radius) {
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

}
class Stick {
    draw(x, length, rotation) {
        ctx.save();
        ctx.translate(x, 0)
        ctx.rotate(Math.PI / 180 * rotation);

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -length);
        ctx.stroke()

        ctx.restore();
    }
}
class Draw {
    setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    _background() {
        const gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
        gradient.addColorStop(0, "#70af85");
        gradient.addColorStop(1, "#c6ebc9");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }
    backgroundAndHillsAndTrees() {
        ctx.save();
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this._background();

        const hillBack = new Hill(150, 10, 1, "#95C629");
        const hillFront = new Hill(120, 20, 0.5, "#659F1C");
        const tree = new Tree();

        hillBack.draw();
        hillFront.draw();

        Tree.list.forEach(({
            x,
            y,
            color
        }) => tree.draw(x, y, color));
    }

    platformAndSticksAndHero() {
        const platform = new Platform();
        const hero = new Hero();
        const stick = new Stick();

        ctx.save();
        ctx.translate((window.innerWidth - 400) / 2 - sceneOffset, window.innerHeight - platform.height);

        hero.draw(Hero.x, Hero.y);
        Platform.list.forEach(({
            x,
            width
        }) => platform.draw(x, width));
        Stick.list.forEach(({
            x,
            length,
            rotation
        }) => stick.draw(x, length, rotation));

        ctx.restore();
    }

}


Tree.list = [];
Platform.list = [];
Stick.list = [];
Hero.x = 0;
Hero.y = 0;
Hero.distanceFromEdge = 4;
const platform = new Platform();
const tree = new Tree();
const draw = new Draw();
let score = 0;
const resetGame = function () {
    sceneOffset = 0;
    restartButton.classList.add("hide");
    phase = "waiting";
    socreElement.innerHTML = score;
    
    Platform.list = [{
        x: 10,
        width: 30
    }];
    Stick.list = [{
        x: Platform.list[0].x + Platform.list[0].width,
        length: 0,
        rotation: 0
    }];

    let treeAmount = 6;
    for (let i = 0; i <= treeAmount; i++) {
        tree.generate();
    }

    let platformAmount = 5;
    for (let i = 0; i <= platformAmount; i++) {
        platform.generate();
    }

    Hero.x = Platform.list[0].x + Platform.list[0].width;
    Hero.y = 0;
    draw.setCanvasSize();
    draw.backgroundAndHillsAndTrees();
    draw.platformAndSticksAndHero();

}
resetGame()
restartButton.addEventListener("click", (e) => {
    resetGame();
    e.preventDefault();
    e.target.classList.add("hide");
})
window.addEventListener("mousedown", () => {
    if (phase === "waiting") {
        introductionButton.style.opacity = 0;
        lastTimeStamp = undefined;
        phase = "stretching";
        window.requestAnimationFrame(animate);
    }
})
window.addEventListener("mouseup", () => {
    if (phase === "stretching") {
        phase = "turning";
    }
})
window.addEventListener("resize", () => {
    draw.setCanvasSize();
    draw.backgroundAndHillsAndTrees();
    draw.platformAndSticksAndHero();
});

const animate = function (timeStamp) {
    if (!lastTimeStamp) {
        lastTimeStamp = timeStamp;
        window.requestAnimationFrame(animate);
        return;
    }
    const timeStampDiference = timeStamp - lastTimeStamp;
    switch (phase) {
        case "waiting":
            return;
        case "stretching":
            const stickLength = timeStampDiference / 4;
            Stick.list[Stick.list.length - 1].length += stickLength;
            break;
        case "turning":
            const rotation = timeStampDiference / 4;
            Stick.list[Stick.list.length - 1].rotation += rotation;
            if (Stick.list[Stick.list.length - 1].rotation > 90) {
                Stick.list[Stick.list.length - 1].rotation = 90;
                [nextPlatform] = stickHitThePlatform(Stick.list[Stick.list.length - 1]);
                phase = "walking";
            }
            break;
        case "walking":
            const walkingDistance = timeStampDiference / 4;
            Hero.x += walkingDistance;
            if (nextPlatform) {

                const heroNeedToPoint = nextPlatform.x + nextPlatform.width - Hero.distanceFromEdge;
                if (Hero.x >= heroNeedToPoint) {
                    score += 1;
                    socreElement.innerHTML = score;
                    Hero.x = heroNeedToPoint;
                    phase = "transitioning";
                    Stick.list.push({
                        x: nextPlatform.x + nextPlatform.width,
                        length: 0,
                        rotation: 0
                    });
                }
            } else {
                const heroNeedToPoint = Stick.list[Stick.list.length - 1].x + Stick.list[Stick.list.length - 1].length + Hero.distanceFromEdge;
                if (Hero.x >= heroNeedToPoint) {
                    Hero.x = heroNeedToPoint;
                    phase = "falling";
                }

            }
            break;
        case "transitioning":
            const transitionDistance = timeStampDiference / 4;
            sceneOffset += transitionDistance;
            const sceneOffSetMax = Stick.list[Stick.list.length - 2].x + Stick.list[Stick.list.length - 2].length;
            if (sceneOffset >= sceneOffSetMax) {
                sceneOffset = sceneOffSetMax;
                phase = "waiting";
                platform.generate();
                platform.generate();
                tree.generate();
                tree.generate();
            }
            break;
        case "falling":
            const fallDistance = timeStampDiference / 1.5;
            const rotationDegree = timeStampDiference /4;
            Hero.y += fallDistance;
            Stick.list[Stick.list.length - 1].rotation += rotationDegree;
            if (Stick.list[Stick.list.length - 1].rotation > 180) {
                Stick.list[Stick.list.length - 1].rotation = 180;
                setTimeout(() => {
                    restartButton.classList.remove("hide");
                }, 500);
                return;
            }
            
    }
    draw.backgroundAndHillsAndTrees();
    draw.platformAndSticksAndHero();
    window.requestAnimationFrame(animate);
    lastTimeStamp = timeStamp;
}


const stickHitThePlatform = function (stick) {
    let nextPlatform = Platform.list.filter(platform => {
        return platform.x < stick.x + stick.length && stick.x + stick.length < platform.x + platform.width;
    })
    return nextPlatform;
}
