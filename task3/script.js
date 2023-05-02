const POPULATION_SIZE = 100;
const MUTATION_RATE = 0.1;
const TOURNAMENT_SIZE = 5;

// 画布大小
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

// 城市数量
const CITY_COUNT = 20;

// 城市半径
const CITY_RADIUS = 5;

// 遗传算法对象
let ga;

// 画布对象
let canvas;

// 当前最优路径
let bestPath;

// 当前最优距离
let bestDist;

// 初始化函数
function init() {
    // 初始化画布
    canvas = document.getElementById("canvas");
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // 创建遗传算法对象
    ga = new GeneticAlgorithm(POPULATION_SIZE, MUTATION_RATE, TOURNAMENT_SIZE, CITY_COUNT, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 绑定按钮事件
    document.getElementById("startBtn").addEventListener("click", start);
    document.getElementById("stopBtn").addEventListener("click", stop);
    document.getElementById("resetBtn").addEventListener("click", reset);

    // 初始化最优路径和最优距离
    bestPath = [];
    bestDist = Infinity;

    // 绘制初始城市
    drawCities(ga.cities);
}

// 开始运行遗传算法
function start() {
    ga.running = true;
    run();
}

// 停止运行遗传算法
function stop() {
    ga.running = false;
}

// 重置遗传算法
function reset() {
    ga.reset();
    bestPath = [];
    bestDist = Infinity;
    document.getElementById("generationNum").textContent = 0;
    document.getElementById("bestDist").textContent = 0;
    document.getElementById("bestPath").innerHTML = "";
    drawCities(ga.cities);
}

// 运行遗传算法
function run() {
    if (!ga.running) return;

    // 进行一次进化
    ga.evolve();

    // 获取最优路径和最优距离
    const currentBestPath = ga.getBestPath();
    const currentBestDist = ga.getBestDistance();

    // 如果当前最优路径更好，则更新最优路径和最优距离
    if (currentBestDist < bestDist) {
        bestPath = currentBestPath;
        bestDist = currentBestDist;
        updateBestPath();
    }

    // 更新代数和最优距离
    document.getElementById("generationNum").textContent = ga.generation;
    document.getElementById("bestDist").textContent = bestDist.toFixed(2);

    // 绘制当前种群最优路径
    drawPath(currentBestPath);

    // 继续运行遗传算法
    requestAnimationFrame(run);
}

// 绘制城市
function drawCities(cities) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = "#000";

    for (let i = 0; i < cities.length; i++) {
        const city = cities[i];
        ctx.beginPath();
        ctx.arc(city.x, city.y, CITY_RADIUS, 0, 2 * Math.PI);
        ctx.fill();
    }
}

// 绘制路径
function drawPath(path) {
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#f00";
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < path.length; i++) {
        const city = path[i];
        ctx.lineTo(city.x, city.y);
    }

    ctx.closePath();
    ctx.stroke();
}

// 更新最优路径
function updateBestPath() {
    const bestPathEl = document.getElementById("bestPath");
    bestPathEl.innerHTML = "";

    for (let i = 0; i < bestPath.length; i++) {
        const city = bestPath[i];
        const li = document.createElement("li");
        li.textContent = `(${city.x}, ${city.y})`;
        bestPathEl.appendChild(li);
    }
}

// 初始化
init();