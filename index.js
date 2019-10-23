const NUM_PARTICLES = 100000;
const PARTICLE_SPEED = 2;
const UPDATE_RATE = 10;	// milliseconds

var canvas;
const adjacencyMap = {};

function init() {
	initCanvas();
	initParticles();
}

function initCanvas() {
	canvas = new Cathanvas('root', {
		width: 500,
		height: 500,
	});
}

function initParticles() {
	createFixedSegment({
		x: canvas.width / 2,
		y: canvas.height / 2,
	});

	for (let i = 0; i < NUM_PARTICLES; i++) {
		createWalker();
	}
}

function createFixedSegment(coords) {
	addToAdjacencyMap(Math.floor(coords.x), Math.floor(coords.y));
	canvas.drawDot(coords, '#FFFFFF');
}

function addToAdjacencyMap(x, y) {
	const adj = [
		{
			x: x + 1,
			y: y,
		},
		{
			x: x - 1,
			y: y,
		},
		{
			x: x,
			y: y + 1,
		},
		{
			x: x,
			y: y - 1,
		},
	];
	adj.forEach(point => {
		if (adjacencyMap[point.x]) {
			adjacencyMap[point.x][point.y] = true;
		} else {
			adjacencyMap[point.x] = {[point.y]: true}
		}
	});
}

function createWalker() {
	const walker = {
		x: Math.random() * canvas.width,
		y: Math.random() * canvas.height,
	};
	startWalk(walker);
}

function startWalk(walker) {
	function walk() {
		if (isFixedAdjacent(Math.floor(walker.x), Math.floor(walker.y))) {
			createFixedSegment(walker);
			createWalker();	// Experimental - more walkers per surface area
			restartWalk(walker);
			return;
		}

		const xrand = Math.random();
		const yrand = Math.random();
		if (xrand < 0.5) {
			walker.x = stayInsideCanvas(walker.x + PARTICLE_SPEED, 'x')
		} else {
			walker.x = stayInsideCanvas(walker.x - PARTICLE_SPEED, 'x')
		}

		if (yrand < 0.5) {
			walker.y = stayInsideCanvas(walker.y + PARTICLE_SPEED, 'y')
		} else {
			walker.y = stayInsideCanvas(walker.y - PARTICLE_SPEED, 'y')
		}
	}
	setInterval(walk, UPDATE_RATE);
}

function restartWalk(walker) {
	walker.x = Math.random() * canvas.width;
	walker.y = Math.random() * canvas.height;
}

function isFixedAdjacent(x, y) {
	return adjacencyMap[x] && adjacencyMap[x][y];
}

function stayInsideCanvas(n, axis) {
	if (axis === 'x') {
		if (n < 0) { return 0; }
		if (n > canvas.width) { return canvas.width; }
	}

	if (axis === 'y') {
		if (n < 0) { return 0; }
		if (n > canvas.height) { return canvas.height; }
	}

	return n;
}