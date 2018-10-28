const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const inside = document.getElementById('inside');
const total = document.getElementById('total');
const estimatedArea = document.getElementById('estimatedArea');
const buttonStart = document.getElementById('start');
const buttonStop = document.getElementById('stop');
const buttonNew = document.getElementById('new');

let rectangleX;
let rectangleY;
let alreadyRan = false;

const canvasArea = canvas.width * canvas.height;

function drawRectangle(bottomRightX, bottomRightY) {
    rectangleX = bottomRightX;
    rectangleY = bottomRightY;
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(0, rectangleY);
    context.lineTo(rectangleX, rectangleY);
    context.lineTo(rectangleX, 0);
    context.lineTo(0, 0);
    context.stroke();
    document.getElementById('realArea').textContent = rectangleX * rectangleY;
}

function start() {
    if (alreadyRan) {
        resetCanvas();
    }
    changeButtonsState();
    alreadyRan = true;
    solutions = areaApproximation(points());
    window.requestAnimationFrame(next);
}

function* points() {
    while (true) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const isInside = x <= rectangleX && y <= rectangleY;
        yield {
            x: x,
            y: y,
            isInside: isInside
        };
    }
}

function* areaApproximation(points) {
    let insideRectangle = 0;
    let all = 0;
    for (let point of points) {
        all++;
        if (point.isInside) {
            insideRectangle++;
        }
        yield {
            x: point.x,
            y: point.y,
            inside: insideRectangle,
            isInside: point.isInside,
            all: all,
            approximation: canvasArea * (insideRectangle / all)
        };
    }
}

function next() {
    let currentItem;
    for (let item of take(100, solutions)) {
        context.fillStyle = item.isInside ? 'red' : 'silver';
        context.fillRect(item.x, item.y, 1, 1);
        currentItem = item;
    }
    inside.textContent = currentItem.inside;
    total.textContent = currentItem.all;
    estimatedArea.textContent = currentItem.approximation;
    window.requestId = window.requestAnimationFrame(next);
}

function* take(count, seq) {
    for (let i = 0; i < count; i++) {
        yield seq.next().value;
    }
}

function stop() {
    changeButtonsState();
    cancelAnimation();
    logInfo();
}

function changeButtonsState() {
    buttonStart.disabled = !buttonStart.disabled;
    buttonStop.disabled = !buttonStop.disabled;
    buttonNew.disabled = !buttonNew.disabled;
}

function cancelAnimation() {
    window.cancelAnimationFrame(window.requestId);
}

function logInfo() {
    console.log(`Estimated area: ${estimatedArea.textContent}`);
    const dist = Math.abs(Number(estimatedArea.textContent) - rectangleX * rectangleY);
    console.log(`Stopped approximation. Distance of approximation to actual area after ${total.textContent} iterations: ${dist}`);
}

function resetCanvas() {
    clearCanvas();
    drawRectangle(rectangleX, rectangleY);
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function generateNewRectangle() {
    clearCanvas();
    const width = Math.floor(Math.random() * canvas.width);
    const height = Math.floor(Math.random() * canvas.height);
    drawRectangle(width, height);
    inside.textContent = '';
    total.textContent = '';
    estimatedArea.textContent = '';
}

let solutions;

(function init() {
    buttonStart.addEventListener('click', start);
    buttonStop.addEventListener('click', stop);
    buttonNew.addEventListener('click', generateNewRectangle);
    drawRectangle(Math.floor(Math.random() * canvas.width), Math.floor(Math.random() * canvas.height));
})();
