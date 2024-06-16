// Get canvas element and its 2d rendering context
const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

// Function to resize the canvas to fit the window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initially resize the canvas and set its background color
resizeCanvas();
canvas.style.backgroundColor = "blue";

// Define variables for map dimensions, zoom level, and other parameters
let mapX = 2280;
let mapY = 2145;
console.log(mapX, mapY);
let mapPoints = [];
let mapBorder = [];
let zoomPrecent = 1.2;
let currZoom = 0;
const maxZoom = 4;
const minZoom = -2;

let lineArray = [];

const pointColor = '#4e3b00';
const pointRadius = 5;
const pointBorder = 2;
const pointsMesh = 20;
const moveSpeed = 3;
const density = 15;

// Array to store active keys and mouse position
let activeKeys = [];
let mouseX = 0, mouseY = 0;

let exp = new Date(2147483647 * 1000).toUTCString();

// Event listeners for zooming, resizing canvas, and keyboard/mouse input
canvas.addEventListener("wheel", handleZoom);
window.addEventListener('resize', resizeCanvas);
canvas.addEventListener('mousemove', updateMousePos);
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

//Cookie operation functions
function setCookie(name,value){
    document.cookie = name+"="+(value)+";expires="+exp+";";
}
function deleteCookie(name){
    document.cookie = name+"= null;expires='Mon, 1 Jan 2000 00:00:00 GMT';";
}
function getCookie(name){
    const cDecoded = decodeURIComponent(document.cookie);
    const cArray = cDecoded.split("; ");
    let result = null;
    cArray.forEach(element => {
        if(element.indexOf(name) == 0){
            result = element.substring(name.length + 1)
        }
    })
    return result;
}

// Function to handle zooming based on mouse wheel input
function handleZoom(event) {
    let delta = event.deltaY > 0 ? -1 : 1;
    if ((currZoom + delta) <= maxZoom && (currZoom + delta) >= minZoom) {
        currZoom += delta;
        const zoomFactor = delta > 0 ? zoomPrecent : 1 / zoomPrecent;
        mapPoints.forEach(point => {
            point[0] = (point[0] * zoomFactor) - (canvas.width * (zoomFactor - 1)) / 2;
            point[1] = (point[1] * zoomFactor) - (canvas.height * (zoomFactor - 1)) / 2;
            point[2] *= zoomFactor;
            point[5] *= zoomFactor;
        });
        lineArray.forEach(line => {
            line[0] = (line[0] * zoomFactor) - (canvas.width * (zoomFactor - 1)) / 2;
            line[1] = (line[1] * zoomFactor) - (canvas.height * (zoomFactor - 1)) / 2;
            line[2] = (line[2] * zoomFactor) - (canvas.width * (zoomFactor - 1)) / 2;
            line[3] = (line[3] * zoomFactor) - (canvas.height * (zoomFactor - 1)) / 2;
        });
        mapBorder[0] = (mapBorder[0] * zoomFactor) - (canvas.width * (zoomFactor - 1)) / 2;
        mapBorder[1] = (mapBorder[1] * zoomFactor) - (canvas.height * (zoomFactor - 1)) / 2;
        mapBorder[2] = (mapBorder[2] * zoomFactor) - (canvas.width * (zoomFactor - 1)) / 2;
        mapBorder[3] = (mapBorder[3] * zoomFactor) - (canvas.height * (zoomFactor - 1)) / 2;
        mapBorder[4] *= zoomFactor;
    }
}

// Function to handle key press events
function handleKeyDown(event) {
    if (!activeKeys.includes(event.key)) activeKeys.push(event.key);
}

// Function to handle key release events
function handleKeyUp(event) {
    const index = activeKeys.indexOf(event.key);
    if (index !== -1) activeKeys.splice(index, 1);
}

// Function to update mouse position
function updateMousePos(event) {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
}

// Function to generate a random integer within a range
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Function to handle player movement
function playerMove() {
    activeKeys.forEach(key => {
        let moveX = 0, moveY = 0;
        switch (key) {
            case 'w': moveY = moveSpeed * zoomPrecent; break;
            case 's': moveY = -moveSpeed * zoomPrecent; break;
            case 'a': moveX = moveSpeed * zoomPrecent; break;
            case 'd': moveX = -moveSpeed * zoomPrecent; break;
        }
        mapPoints.forEach(point => {
            point[0] += moveX;
            point[1] += moveY;
        });
        lineArray.forEach(line => {
            line[0] += moveX;
            line[1] += moveY;
            line[2] += moveX;
            line[3] += moveY;
        });
        mapBorder[0] += moveX;
        mapBorder[1] += moveY;
        mapBorder[2] += moveX;
        mapBorder[3] += moveY;
    });
}

// Function to generate the map
function generateMap() {
    const translateX = (canvas.width - mapX) / 2;
    const translateY = (canvas.height - mapY) / 2;
    const distX = mapX / pointsMesh;
    const distY = mapY / pointsMesh;
    let toCookie = "";

    mapBorder.push(translateX, translateY, mapX + translateX, mapY + translateY, pointBorder);
    toCookie = `${translateX}, ${translateY}, ${mapX + translateX}, ${mapY + translateY}, ${pointBorder}`;
    setCookie("border",toCookie);
    toCookie = '';
    for (let y = distY / 2; y <= mapY; y += distY) {
        for (let x = distX / 2; x <= mapX; x += distX) {
            if (randomInt(1, 100) <= density) {
                mapPoints.push([x + translateX, y + translateY, pointRadius, pointColor, 1, pointBorder]);
                
                toCookie = `${toCookie} ${x + translateX}, ${y + translateY}, ${pointRadius}, ${pointColor}, 1, ${pointBorder}+`;
            }
        }
    }
    setCookie("points",toCookie);
}

// Function to draw a point
function drawPoint(x, y, radius, color, opacity, borderSize) {
    c.beginPath();
    c.arc(x, y, radius, 0, 2 * Math.PI);
    c.fillStyle = color;
    c.strokeStyle = 'black';
    c.globalAlpha = opacity;
    c.lineWidth = borderSize;
    c.fill();
    c.stroke();
    c.globalAlpha = 1;
}

// Function to draw the map
function drawMap() {
    mapPoints.forEach(point => {
        if (point[0] + point[2] > 0 && point[0] - point[2] < canvas.width && point[1] + point[2] > 0 && point[1] - point[2] < canvas.height) {
            drawPoint(point[0], point[1], point[2], point[3], point[4], point[5]);
        }
    });
}

// Function to draw the map border
function drawBorder() {
    c.beginPath();
    c.rect(mapBorder[0], mapBorder[1], mapBorder[2] - mapBorder[0], mapBorder[3] - mapBorder[1]);
    c.lineWidth = mapBorder[4];
    c.strokeStyle = 'red';
    c.fillStyle = 'green';
    c.stroke();
    c.fill();
}
function drawLines() {
    lineArray.forEach(line => {
        c.beginPath();
        c.moveTo(line[0], line[1]);
        c.strokeStyle = line[4];
        c.globalAlpha = line[5];
        c.lineWidth = line[6];
        c.lineTo(line[2], line[3]);
        c.stroke();
        c.globalAlpha = 1;
    });
}

// Function to find the closest point to a given position
function closest(x, y, number) {
    let closestArr = mapPoints
        .map(point => [Math.hypot(point[0] - x, point[1] - y), point[0], point[1]])
        .filter(([, tempX, tempY]) => tempX !== x || tempY !== y)
        .sort(([a], [b]) => a - b);

        if (closestArr.length >= number) {
            return [closestArr[number][1], closestArr[number][2]];
        } else {
            return [x, y]; 
        }
}

// Function to draw a line from a point to its closest neighbor
function drawToClosest(x, y, number, color, alpha, width) {
    const [closestX, closestY] = closest(x, y, number);
    lineArray.push([x, y, closestX, closestY, color, alpha, width]);
}

// Function to update the canvas on each frame
function frame() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    playerMove();
    drawBorder();
    if (lineArray.length > 0) drawLines();
    // drawToClosest(mouseX, mouseY, 0, "yellow", 1, 3);
    // drawToClosest(mapPoints[15][0], mapPoints[15][1], 0, "yellow", 1, 3);
    drawMap();
}

// Generate the initial map if no exist
if (!getCookie("points") || !getCookie("border")) {
    generateMap();
} else {
    // Process cookiePoints
    const cookiePoints = getCookie("points")
        .split("+")
        .map(row => row.split(",").map((val, i) => {
            val = val.trim();
            return (i === 0 || i === 1) ? parseFloat(val) : (i === 2 || i === 4 || i === 5) ? parseInt(val) : val;
        }));

    mapPoints.push(...cookiePoints);

    // Process cookieBorder
    const cookieBorder = getCookie("border")
        .split(",")
        .map(w => parseInt(w.trim()));

    mapBorder.push(...cookieBorder);
}
// generateMap();

// Start the animation loop
setInterval(frame, 60);
setInterval(frame, 60);