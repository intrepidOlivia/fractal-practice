const NUM_PARTICLES = 10000;
const PARTICLE_SPEED = 2;
const UPDATE_RATE = 10;	// milliseconds
const COLOR_SHIFT_RATE = 3;

var canvas;
const adjacencyMap = {};
let isGrowing = true;
const color = [123, 123, 123];

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
	canvas.drawDot(coords, `rgb(${color[0]},${color[1]},${color[2]})`);
	mutateAllColors();
}

/**
 * Mutates the color of the next pixel, one value (r, g, or b) at a time
 */
function mutateColor() {
	// pick between r g and b
	let val;
	let roll = Math.random() * 3;
	if (roll < 1) {
		val = 0;
	} else if (roll < 2) {
		val = 1;
	} else {
		val = 2;
	}

	// increase value up or down an amount
	roll = Math.random() * 2;
	if (roll < 1) {
		color[val] = stayInsideColor(color[val] + COLOR_SHIFT_RATE);
	} else {
		color[val] = stayInsideColor(color[val] - COLOR_SHIFT_RATE);
	}
}

/**
 * Mutates the color of the next pixel, all values (r, g, and b) at a time
 */
function mutateAllColors() {
	for (let i = 0; i < color.length; i++) {
		let roll = Math.random() * 2;
		if (roll < 1) {
			color[i] = stayInsideColor(color[i] + COLOR_SHIFT_RATE);
		} else {
			color[i] = stayInsideColor(color[i] - COLOR_SHIFT_RATE);
		}
	}
}

function stayInsideColor(value) {
	if (value < 0) { return 0; }
	if (value > 255) { return 255; }
	return value;
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
		{
			x: x + 1,
			y: y + 1,
		},
		{
			x: x + 1,
			y: y - 1,
		},
		{
			x: x - 1,
			y: y + 1,
		},
		{
			x: x - 1,
			y: y - 1,
		}
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
	let loopId;
	function walk() {
		if (!isGrowing) {
			clearInterval(loopId);
			return;
		}

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
	loopId = setInterval(walk, UPDATE_RATE);
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

function stopGrowing() {
	isGrowing = false;
}