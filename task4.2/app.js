const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// 初始化控制面板
const antCountInput = document.getElementById('ant-count');
const evaporationRateInput = document.getElementById('evaporation-rate');
const alphaInput = document.getElementById('alpha');
const betaInput = document.getElementById('beta');
const startButton = document.getElementById('start-button');
const resetButton = document.getElementById('reset-button');

// 初始化参数
let antCount = antCountInput.value;
let evaporationRate = evaporationRateInput.value;
let alpha = alphaInput.value;
let beta = betaInput.value;

// 初始化蚁群
let ants = [];

// 初始化城市
const cityCount = 20;
const cities = [];
for (let i = 0; i < cityCount; i++) {
    cities.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height
    });
}

// 初始化路径
let path = [];

// 绘制城市
function drawCities() {
    ctx.fillStyle = '#f00';
    for (let i = 0; i < cities.length; i++) {
        ctx.beginPath();
        ctx.arc(cities[i].x, cities[i].y, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}

// 绘制路径
function drawPath() {
    ctx.strokeStyle = '#00f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cities[path[0]].x, cities[path[0]].y);
    for (let i = 1; i < path.length; i++) {
        ctx.lineTo(cities[path[i]].x, cities[path[i]].y);
    }
    ctx.closePath();
    ctx.stroke();
}

// 计算距离
function distance(city1, city2) {
    const dx = city1.x - city2.x;
    const dy = city1.y - city2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// 计算路径长度
function pathLength(path) {
    let length = 0;
    for (let i = 1; i < path.length; i++) {
        length += distance(cities[path[i - 1]], cities[path[i]]);
    }
    length += distance(cities[path[path.length - 1]], cities[path[0]]);
    return length;
}

// 初始化蚂蚁
function initAnts() {
    ants = [];
    for (let i = 0; i < antCount; i++) {
        ants.push({
            path: [],
            visited: new Array(cityCount).fill(false),
            currentPosition: Math.floor(Math.random() * cityCount),
            pathLength: Infinity
        });
        ants[i].visited[ants[i].currentPosition] = true;
        ants[i].path.push(ants[i].currentPosition);
    }
}

// 更新蚂蚁
function updateAnts() {
    for (let i = 0; i < ants.length; i++) {
        const ant = ants[i];
        if (ant.path.length === cityCount) {
            // 蚂蚁已经遍历完所有城市
            const length = pathLength(ant.path);
            if (length < pathLength(path)) {
                // 更新最优路径
                path = ant.path;
            }
            ant.pathLength = length;
            ant.path = [];
            ant.visited = new Array(cityCount).fill(false);
            ant.currentPosition = Math.floor(Math.random() * cityCount);
            ant.visited[ant.currentPosition] = true;
            ant.path.push(ant.currentPosition);
        } else {
            // 选择下一个城市
            const pheromoneLevels = new Array(cityCount).fill(0);
            let total = 0;
            for (let j = 0; j < cityCount; j++) {
                if (!ant.visited[j]) {
                    pheromoneLevels[j] = Math.pow(pheromones[ant.currentPosition][j], alpha) * Math.pow(1 / distance(cities[ant.currentPosition], cities[j]), beta);
                    total += pheromoneLevels[j];
                }
            }
            const r = Math.random() * total;
            let sum = 0;
            let nextCity;
            for (let j = 0; j < cityCount; j++) {
                if (!ant.visited[j]) {
                    sum += pheromoneLevels[j];
                    if (sum >= r) {
                        nextCity = j;
                        break;
                    }
                }
            }
            ant.visited[nextCity] = true;
            ant.currentPosition = nextCity;
            ant.path.push(nextCity);
        }
    }
}

// 更新信息素
function updatePheromones() {
    for (let i = 0; i < cityCount; i++) {
        for (let j = i + 1; j < cityCount; j++) {
            let delta = 0;
            for (let k = 0; k < ants.length; k++) {
                if (ants[k].path.includes(i) && ants[k].path.includes(j)) {
                    delta += 1 / ants[k].pathLength;
                }
            }
            pheromones[i][j] = (1 - evaporationRate) * pheromones[i][j] + delta;
            pheromones[j][i] = pheromones[i][j];
        }
    }
}

// 绘制信息素
function drawPheromones() {
    const maxPheromone = Math.max(...pheromones.flat());
    for (let i = 0; i < cityCount; i++) {
        for (let j = i + 1; j < cityCount; j++) {
            const x1 = cities[i].x;
            const y1 = cities[i].y;
            const x2 = cities[j].x;
            const y2 = cities[j].y;
            const alpha = pheromones[i][j] / maxPheromone;
            ctx.strokeStyle = `rgba(0, 255, 0, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }
}

// 初始化信息素
let pheromones = new Array(cityCount).fill(null).map(() => new Array(cityCount).fill(1));

// 开始按钮点击事件
startButton.addEventListener('click', () => {
    antCount = antCountInput.value;
    evaporationRate = evaporationRateInput.value;
    alpha = alphaInput.value;
    beta = betaInput.value;
    initAnts();
    path = [];
    for (let i = 0; i < cityCount; i++) {
        path.push(i);
    }
    path.push(0);
    let iteration = 0;
    const intervalId = setInterval(() => {
        updateAnts();
        updatePheromones();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCities();
        drawPath();
        drawPheromones();
        iteration++;
        if (iteration === 1000) {
            clearInterval(intervalId);
        }
    }, 10);
});

// 重置按钮点击事件
resetButton.addEventListener('click', () => {
    ants = [];
    pheromones = new Array(cityCount).fill(null).map(() => new Array(cityCount).fill(1));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCities();
});