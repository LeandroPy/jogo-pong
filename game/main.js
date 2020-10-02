
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const soundTrack = new Audio('./sounds/soundTrack.mp3');
const racketShockSoundWithCircle = new Audio('./sounds/racketCollision.mp3');
const scoreSound = new Audio('./sounds/scoreSound.mp3');

let meusPontos = 0;
let outrosPontos = 0;

let circleSpeedForX = 6;
let circleSpeedForY = 6;
let xCircle = 300;
let yCircle = 200;
let radiusCircle = 15;

let xRacketLeft = 5;
let yRacketLeft = 150;
let rackeLeftSpeed = 15;

let xRacketRight = 585;
let yRacketRight = 150;
let rackeRightSpeed;

let widthRacket = 10;
let heightRacket = 90;

function drawCircle(xCircle, yCircle, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(xCircle, yCircle, radius, 0, 2 * Math.PI);
    ctx.fill();
}

function drawScoreboard() {
    ctx.fillStyle = 'white';
    ctx.fillText(meusPontos, 278, 26);
    ctx.fillText(outrosPontos, 321, 26);
}

function clearScreen() {
    ctx.clearRect(0, 0, 600, 400);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 600, 400);
}

function checkCollisionOfCircleWithTheWall() {
    if (xCircle + radiusCircle > canvas.width || xCircle - radiusCircle < 0) { circleSpeedForX *= -1; }
    if (yCircle + radiusCircle > canvas.height || yCircle - radiusCircle < 0) { circleSpeedForY *= -1; }
}

function checkColisionOfCircleWithTheRacket() {
    if (xCircle - radiusCircle < xRacketLeft + widthRacket
        && yCircle - radiusCircle < yRacketLeft + heightRacket
        && yCircle + radiusCircle > yRacketLeft) {
        circleSpeedForX *= -1;
        racketShockSoundWithCircle.play();
    }

    if (xCircle + radiusCircle > xRacketRight - widthRacket
        && yCircle + radiusCircle > yRacketRight
        && yCircle - radiusCircle < yRacketRight + heightRacket) {
        circleSpeedForX *= -1
        racketShockSoundWithCircle.play();
    }

}

function checksIfPointHappened() {
    if (xCircle > 585) {
        meusPontos += 1;
        scoreSound.play();
    } else if (xCircle < 15) {
        outrosPontos += 1;
        scoreSound.play();
    }
}


function moveCircle() {
    checkColisionOfCircleWithTheRacket()
    checkCollisionOfCircleWithTheWall()
    checksIfPointHappened()
    xCircle += circleSpeedForX;
    yCircle += circleSpeedForY;
}

function drawRacket(xRacket, yRacket, widthRacket, heightRacket, color) {
    ctx.fillStyle = color;
    ctx.fillRect(xRacket, yRacket, widthRacket, heightRacket);
}

function moveRacketRight() {
    rackeRightSpeed = yCircle - yRacketRight - widthRacket / 2 - 30;
    yRacketRight += rackeRightSpeed;
}

function screenUpdate() {
    clearScreen();

    drawRacket(xRacketLeft, yRacketLeft, widthRacket, heightRacket, 'white');
    drawRacket(xRacketRight, yRacketRight, widthRacket, heightRacket, 'white');
    drawCircle(xCircle, yCircle, radiusCircle, 'white');
    drawScoreboard();

    moveCircle()
    moveRacketRight();

    requestAnimationFrame(screenUpdate);
}

function moveRacket(keyPressed) {

    const acceptedMoves = {
        ArrowUp() {
            if ((yRacketLeft - rackeLeftSpeed) > 0) { yRacketLeft -= rackeLeftSpeed; }
        },
        ArrowDown() {
            if ((yRacketLeft + heightRacket + rackeLeftSpeed) < canvas.height) { yRacketLeft += rackeLeftSpeed; }
        }
    }

    const command = acceptedMoves[keyPressed];

    if (command) { command(); }

}

function initSoundTrack() {
    soundTrack.play();
    soundTrack.loop = true;
}

function keyboardListener() {
    document.addEventListener('keydown', (event) => {
        moveRacket(event.key);
    })
}

(function init() {

    initSoundTrack()

    canvas.width = 600;
    canvas.height = 400;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 600, 400);

    screenUpdate();

    keyboardListener()

})()