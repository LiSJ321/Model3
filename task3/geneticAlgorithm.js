// 城市对象
class City {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// 路径对象
class Path {
    constructor(cities) {
        this.cities = cities;
        this.distance = 0;
    }

    // 计算路径长度
    calculateDistance() {
        let sum = 0;

        for (let i = 0; i < this.cities.length - 1; i++) {
            const city1 = this.cities[i];
            const city2 = this.cities[i + 1];
            const dx = city2.x - city1.x;
            const dy = city2.y - city1.y;
            sum += Math.sqrt(dx * dx + dy * dy);
        }

        this.distance = sum;
    }

    // 交叉操作
    crossover(path) {
        const start = Math.floor(Math.random() * this.cities.length);
        const end = Math.floor(Math.random() * this.cities.length);

        const childCities = [];
        for (let i = 0; i < this.cities.length; i++) {
            if (start < end && i > start && i < end) {
                childCities.push(path.cities[i]);
            } else if (start > end) {
                if (!(i < start && i > end)) {
                    childCities.push(path.cities[i]);
                }
            }
        }

        for (let i = 0; i < this.cities.length; i++) {
            if (!childCities.includes(this.cities[i])) {
                childCities.push(this.cities[i]);
            }
        }

        return new Path(childCities);
    }

    // 变异操作
    mutate() {
        const index1 = Math.floor(Math.random() * this.cities.length);
        const index2 = Math.floor(Math.random() * this.cities.length);

        const temp = this.cities[index1];
        this.cities[index1] = this.cities[index2];
        this.cities[index2] = temp;
    }
}

// 遗传算法对象
class GeneticAlgorithm {
    constructor(populationSize, mutationRate, tournamentSize, cityCount, canvasWidth, canvasHeight) {
        this.populationSize = populationSize;
        this.mutationRate = mutationRate;
        this.tournamentSize = tournamentSize;
        this.cityCount = cityCount;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.cities = [];
        this.population = [];
        this.running = false;
        this.generation = 0;
        this.bestPath = null;
        this.bestDistance = Infinity;

        // 初始化城市
        for (let i = 0; i < this.cityCount; i++) {
            const x = Math.floor(Math.random() * (this.canvasWidth - 20)) + 10;
            const y = Math.floor(Math.random() * (this.canvasHeight - 20)) + 10;
            this.cities.push(new City(x, y));
        }

        // 初始化种群
        for (let i = 0; i < this.populationSize; i++) {
            const cities = this.cities.slice();
            cities.sort(() => Math.random() - 0.5);
            const path = new Path(cities);
            path.calculateDistance();
            this.population.push(path);
        }
    }

    // 进化函数
    evolve() {
        // 选择下一代
        const nextGeneration = [];

        for (let i = 0; i < this.populationSize; i++) {
            const parent1 = this.tournamentSelection();
            const parent2 = this.tournamentSelection();
            const child = parent1.crossover(parent2);

            if (Math.random() < this.mutationRate) {
                child.mutate();
            }

            child.calculateDistance();
            nextGeneration.push(child);
        }

        // 更新种群
        this.population = nextGeneration;
        this.generation++;
    }

    // 锦标赛选择
    tournamentSelection() {
        let bestPath = null;
        let bestDistance = Infinity;

        for (let i = 0; i < this.tournamentSize; i++) {
            const path = this.population[Math.floor(Math.random() * this.populationSize)];

            if (path.distance < bestDistance) {
                bestPath = path;
                bestDistance = path.distance;
            }
        }

        return bestPath;
    }

    // 获取当前种群最优路径
    getBestPath() {
        let bestPath = null;
        let bestDistance = Infinity;

        for (let i = 0; i < this.populationSize; i++) {
            const path = this.population[i];

            if (path.distance < bestDistance) {
                bestPath = path.cities;
                bestDistance = path.distance;
            }
        }

        return bestPath;
    }

    // 获取当前种群最优距离
    getBestDistance() {
        let bestDistance = Infinity;

        for (let i = 0; i < this.populationSize; i++) {
            const path = this.population[i];

            if (path.distance < bestDistance) {
                bestDistance = path.distance;
            }
        }

        return bestDistance;
    }

    // 重置种群
    reset() {
        this.population = [];

        for (let i = 0; i < this.populationSize; i++) {
            const cities = this.cities.slice();
            cities.sort(() => Math.random() - 0.5);
            const path = new Path(cities);
            path.calculateDistance();
            this.population.push(path);
        }

        this.generation = 0;
        this.bestPath = null;
        this.bestDistance = Infinity;
    }
}