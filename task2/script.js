const canvasContainer = document.getElementById('canvasContainer');
const numClustersInput = document.getElementById('numClusters');
let canvasSize = 200;
let numClusters = 3;
let points = [];
let clusters = [];
const colors = ['#FF5733', '#C70039', '#900C3F', '#581845', '#FFC300', '#DAF7A6', '#FF5733', '#C70039', '#900C3F', '#581845', '#FF8C00', '#FFD700', '#00FFFF', '#008080', '#4B0082', '#800080'];

function createCanvas() {
    canvasSize = document.getElementById('canvasSize').value;
    numClusters = numClustersInput.value;
    points = [];
    clusters = [];
    let table = '<table>';
    for (let i = 0; i < canvasSize; i++) {
        table += '<tr>';
        for (let j = 0; j < canvasSize; j++) {
            table += `<td id="${i}-${j}" onclick="togglePoint(${i}, ${j})"></td>`;
        }
        table += '</tr>';
    }
    table += '</table>';
    canvasContainer.innerHTML = table;
}

function togglePoint(x, y) {
    const td = document.getElementById(`${x}-${y}`);
    if (td.style.backgroundColor === '') {
        td.style.backgroundColor = getRandomColor();
        points.push({ x, y });
    } else {
        td.style.backgroundColor = '';
        points = points.filter(point => point.x !== x || point.y !== y);
    }
}

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function clusterPoints() {
    if (points.length === 0) {
        alert('Please place some points on the canvas.');
        clusters.push({
            x: Math.floor(Math.random() * canvasSize),
            y: Math.floor(Math.random() * canvasSize),
            color: colors[i]
        });
        return;
    }
    clusters = [];
    for (let i = 0; i < numClusters; i++) {
        clusters.push({
            x: Math.floor(Math.random() * canvasSize),
            y: Math.floor(Math.random() * canvasSize),
            color: colors[i]
        });
    }
    while (true) {
        const oldClusters = JSON.parse(JSON.stringify(clusters));
        points.forEach(point => {
            let closestCluster = null;
            let closestDistance = Infinity;
            clusters.forEach(cluster => {
                const distance = Math.sqrt(Math.pow(cluster.x - point.x, 2) + Math.pow(cluster.y - point.y, 2));
                if (distance < closestDistance) {
                    closestCluster = cluster;
                    closestDistance = distance;
                }
            });
            point.cluster = closestCluster;
        });
        clusters.forEach(cluster => {
            const clusterPoints = points.filter(point => point.cluster === cluster);
            if (clusterPoints.length > 0) {
                const averageX = clusterPoints.reduce((sum, point) => sum + point.x, 0) / clusterPoints.length;
                const averageY = clusterPoints.reduce((sum, point) => sum + point.y, 0) / clusterPoints.length;
                cluster.x = Math.round(averageX);
                cluster.y = Math.round(averageY);
            }
        });
        if (JSON.stringify(clusters) === JSON.stringify(oldClusters)) {
            break;
        }
    }
    points.forEach(point => {
        let closestCluster = null;
        let closestDistance = Infinity;
        clusters.forEach(cluster => {
            const distance = Math.sqrt(Math.pow(cluster.x - point.x, 2) + Math.pow(cluster.y - point.y, 2));
            if (distance < closestDistance) {
                closestCluster = cluster;
                closestDistance = distance;
            }
        });
        point.cluster = closestCluster;
    });
    points.forEach(point => {
        const td = document.getElementById(`${point.x}-${point.y}`);
        td.style.backgroundColor = point.cluster.color;
    });
}

function clearCanvas() {
    points.forEach(point => {
        const td = document.getElementById(`${point.x}-${point.y}`);
        td.style.backgroundColor = '';
    });
    points = [];
    clusters = [];
}