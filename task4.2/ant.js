class Ant {
    constructor(id, graph, alpha, beta, q) {
        this.id = id;
        this.graph = graph;
        this.alpha = alpha;
        this.beta = beta;
        this.q = q;
        this.tour = [];
        this.visited = new Set();
        this.current = Math.floor(Math.random() * graph.nodes.length);
        this.tourLength = 0;
    }

    selectNext() {
        const currentNode = this.graph.nodes[this.current];
        const edges = currentNode.edges.filter(
            (edge) => !this.visited.has(edge.to)
        );

        if (edges.length === 0) {
            return null;
        }

        let total = 0;
        const probabilities = [];

        edges.forEach((edge) => {
            const pheromone = this.graph.pheromone[currentNode.id][edge.to];
            const distance = edge.distance;
            const probability =
                Math.pow(pheromone, this.alpha) * Math.pow(1 / distance, this.beta);
            probabilities.push({ edge, probability });
            total += probability;
        });

        probabilities.forEach((p) => {
            p.probability /= total;
        });

        let random = Math.random();
        let i = 0;
        let sum = probabilities[i].probability;

        while (sum < random) {
            i++;
            sum += probabilities[i].probability;
        }

        return probabilities[i].edge.to;
    }

    move() {
        const next = this.selectNext();

        if (next === null) {
            return false;
        }

        const currentNode = this.graph.nodes[this.current];
        const nextNode = this.graph.nodes[next];
        const edge = currentNode.edges.find((edge) => edge.to === next);

        this.tour.push(edge);
        this.visited.add(next);
        this.current = next;
        this.tourLength += edge.distance;

        return true;
    }

    depositPheromone() {
        const tourLength = this.tourLength;

        this.tour.forEach((edge) => {
            const from = edge.from;
            const to = edge.to;
            const pheromone = this.graph.pheromone[from][to];

            this.graph.pheromone[from][to] =
                (1 - this.q) * pheromone + this.q * (1 / tourLength);
        });
    }

    clear() {
        this.visited.clear();
        this.tour = [];
        this.tourLength = 0;
        this.current = Math.floor(Math.random() * this.graph.nodes.length);
    }

    run() {
        while (this.move()) {}

        this.depositPheromone();
    }
}