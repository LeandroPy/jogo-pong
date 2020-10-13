
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const soundTrack = new Audio('./sounds/soundTrack.mp3');
const racketShockSoundWithCircle = new Audio('./sounds/racketCollision.mp3');
const scoreSound = new Audio('./sounds/scoreSound.mp3');

let leftRacket = {
    x: 5,
    y: 150,
    speed: 15,
    points: 0
}

let rightRacket;

let otherPlayer = {
    x: 585,
    y: 150,
    speed: 15,
    points: 0
}

let computer = {
    x: 585,
    y: 150,
    speed: 0,
    points: 0
}

let circleSpeedForX = 6;
let circleSpeedForY = 6;
let xCircle = 300;
let yCircle = 200;
let radiusCircle = 15;

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
    ctx.fillText(leftRacket.points, 278, 26);
    ctx.fillText(rightRacket.points, 321, 26);
}

function drawBlock() {
    ctx.clearRect(0, 0, 600, 400);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 600, 400);

    drawMidField()

}

function drawMidField() {
    drawRect(300, 5, 10, 40, 'white');
    drawRect(300, 55, 10, 40, 'white');
    drawRect(300, 105, 10, 40, 'white');
    drawRect(300, 155, 10, 40, 'white');
    drawRect(300, 205, 10, 40, 'white');
    drawRect(300, 255, 10, 40, 'white');
    drawRect(300, 305, 10, 40, 'white');
    drawRect(300, 355, 10, 40, 'white');
}

function checkCollisionOfCircleWithTheWall() {
    if (xCircle + radiusCircle > canvas.width || xCircle - radiusCircle < 0) { circleSpeedForX *= -1; }
    if (yCircle + radiusCircle > canvas.height || yCircle - radiusCircle < 0) { circleSpeedForY *= -1; }
}

function checkColisionOfCircleWithTheRacket() {
    if (xCircle - radiusCircle <= leftRacket.x + widthRacket
        && yCircle - radiusCircle <= leftRacket.y + heightRacket
        && yCircle + radiusCircle >= leftRacket.y) {
        circleSpeedForX *= -1;
        racketShockSoundWithCircle.play();
    }

    if (xCircle >= rightRacket.x - widthRacket
        && yCircle + radiusCircle > rightRacket.y
        && yCircle - radiusCircle < rightRacket.y + heightRacket) {
        circleSpeedForX *= -1
        racketShockSoundWithCircle.play();
    }

}

function checksIfPointHappened() {
    if (xCircle > 585) {
        leftRacket.points += 1;
        scoreSound.play();
    } else if (xCircle < 15) {
        rightRacket.points += 1;
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
    drawRect(xRacket, yRacket, widthRacket, heightRacket, color)
}

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}


function moveRacketRight() {
    rackeRightSpeed = yCircle - rightRacket.y - widthRacket / 2;
    rightRacket.y += rackeRightSpeed;
}

function screenUpdate() {
    drawBlock();

    drawRacket(leftRacket.x, leftRacket.y, widthRacket, heightRacket, 'white');
    drawRacket(rightRacket.x, rightRacket.y, widthRacket, heightRacket, 'white');
    drawCircle(xCircle, yCircle, radiusCircle, 'white');
    drawScoreboard();

    moveCircle()
    if (rightRacket === computer) moveRacketRight();

    requestAnimationFrame(screenUpdate);
}

function moveRacket(keyPressed) {

    const acceptedMoves = {
        ArrowUp() {
            if ((leftRacket.y - leftRacket.speed) > 0) leftRacket.y -= leftRacket.speed;
        },
        ArrowDown() {
            if ((leftRacket.y + heightRacket + leftRacket.speed) < canvas.height) leftRacket.y += leftRacket.speed;
        },
        w() {
            if (rightRacket === otherPlayer && ((rightRacket.y - rightRacket.speed) > 0)) rightRacket.y -= rightRacket.speed
        },
        s() {
            if (rightRacket === otherPlayer && ((rightRacket.y + heightRacket + rightRacket.speed) < canvas.height)) rightRacket.y += rightRacket.speed;
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

function init() {
    resetGame();
    initSoundTrack()

    canvas.width = 600;
    canvas.height = 400;

    screenUpdate();

    keyboardListener()

}

function chooseComputerToSecondPlayer() {
    rightRacket = computer;
    init();
}

function chooseOtherPlayerToSecondPlayer() {
    rightRacket = otherPlayer;
    init();
}

function resetGame() {
    leftRacket = {
        x: 5,
        y: 150,
        speed: 15,
        points: 0
    }
    xCircle = 300;
    yCircle = 200;
    circleSpeedForX = 1;
    circleSpeedForY = 1;

    computer.x = 585
    computer.y = 150
    computer.speed = 0
    computer.points = 0

    otherPlayer.x = 585
    otherPlayer.y = 150
    otherPlayer.speed = 15
    otherPlayer.points = 0

    rightRacket = rightRacket
}