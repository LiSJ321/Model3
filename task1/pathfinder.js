const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const ROWS = 20;
const COLS = 20;
const BLOCK_SIZE = canvas.width / ROWS;

let start = null;
let end = null;
let walls = [];

function drawGrid() {
    ctx.beginPath();
    for (let x = 0; x <= canvas.width; x += BLOCK_SIZE) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }
    for (let y = 0; y <= canvas.height; y += BLOCK_SIZE) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();
}

function drawBlock(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
}

function drawStartEnd() {
    if (start) {
        drawBlock(start.x, start.y, 'green');
    }
    if (end) {
        drawBlock(end.x, end.y, 'red');
    }
}

function drawWalls() {
    walls.forEach(wall => {
        drawBlock(wall.x, wall.y, 'black');
    });
}

function drawPath(path) {
    path.forEach(block => {
        drawBlock(block.x, block.y, 'blue');
    });
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function getDistance(a, b, heuristic) {
    if (heuristic === 'euclidean') {
        return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    } else if (heuristic === 'manhattan') {
        return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
    }
}

function getNeighbors(block) {
    const neighbors = [];
    const { x, y } = block;
    if (x > 0) neighbors.push({ x: x - 1, y });
    if (x < COLS - 1) neighbors.push({ x: x + 1, y });
    if (y > 0) neighbors.push({ x, y: y - 1 });
    if (y < ROWS - 1) neighbors.push({ x, y: y + 1 });
    return neighbors.filter(neighbor => !walls.some(wall => wall.x === neighbor.x && wall.y === neighbor.y));
}

function findPath(heuristic) {
    clearCanvas();
    drawGrid();
    drawStartEnd();
    drawWalls();

    const openSet = [start];
    const cameFrom = {};
    const gScore = {
        [`${start.x},${start.y}`]: 0 };
    const fScore = {
        [`${start.x},${start.y}`]: getDistance(start, end, heuristic) };

    while (openSet.length) {
        const current = openSet.reduce((a, b) => fScore[`${a.x},${a.y}`] < fScore[`${b.x},${b.y}`] ? a : b);
        if (current.x === end.x && current.y === end.y) {
            let path = [current];
            while (path[0].x !== start.x || path[0].y !== start.y) {
                path.unshift(cameFrom[`${path[0].x},${path[0].y}`]);
            }
            drawPath(path);
            break;
        }
        openSet.splice(openSet.indexOf(current), 1);
        getNeighbors(current).forEach(neighbor => {
            const tentativeGScore = gScore[`${current.x},${current.y}`] + 1;
            if (!gScore[`${neighbor.x},${neighbor.y}`] || tentativeGScore < gScore[`${neighbor.x},${neighbor.y}`]) {
                cameFrom[`${neighbor.x},${neighbor.y}`] = current;
                gScore[`${neighbor.x},${neighbor.y}`] = tentativeGScore;
                fScore[`${neighbor.x},${neighbor.y}`] = tentativeGScore + getDistance(neighbor, end, heuristic);
                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                }
            }
        });
    }
}

canvas.addEventListener('click', event => {
    const x = Math.floor(event.offsetX / BLOCK_SIZE);
    const y = Math.floor(event.offsetY / BLOCK_SIZE);
    if (!start) {
        start = { x, y };
    } else if (!end && (x !== start.x || y !== start.y)) {
        end = { x, y };
    } else if (x !== start.x || y !== start.y) {
        walls.push({ x, y });
    }
    clearCanvas();
    drawGrid();
    drawStartEnd();
    drawWalls();
});