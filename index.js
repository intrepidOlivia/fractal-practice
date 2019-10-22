const PARTICLE_SPEED = 2;	// pixels per second
const NUM_PARTICLES = 1000;

var stage;
var layer;

// Root numbers represent x coords,
// nested represent y coords
const adjacencyMap = {};

/** FUNCTIONS **/

function initStage() {
	stage = new Konva.Stage({
		container: 'root',
		width: 400,
		height: 400,
	});
	layer = new Konva.Layer();
	initParticles(layer);
	stage.add(layer);
	layer.draw();
}

function initParticles() {
	// Initialize with one fixed particle
	createFixedSegment({
		x: stage.width() / 2,
		y: stage.height() / 2,
	});

	for (let i = 0; i < NUM_PARTICLES; i++) {
		createWalkingParticle(layer);
		// createUnrenderedWalker();
	}
}

function makeParticle(options) {
	return new Konva.Rect({
		x: options.x,
		y: options.y,
		width: 1,
		height: 1,
		fill: options.fill || 'blue',
	});
}

function makeFixedPoint(coords) {
	var fixed = new Konva.Rect({
		x: coords.x,
		y: coords.y,
		width: 1,
		height: 1,
		fill: '#FFFFFF',
	});
	return fixed;
}

function createFixedSegment(coords) {
	addToAdjacencyMap(Math.floor(coords.x), Math.floor(coords.y));
	layer.add(makeFixedPoint(coords));
}

function createWalkingParticle(layer, options) {
	const particle = makeParticle({
		x: Math.random() * stage.width(),
		y: Math.random() * stage.height(),
		...options,
	});

	layer.add(particle);
	randomWalk(particle, layer, options);
}

function createUnrenderedWalker() {
	const walker = {
		x: Math.random() * stage.width(),
		y: Math.random() * stage.height(),
	};
	startUnrenderedWalk(walker);
}

function randomWalk(particle, layer, options) {
	const anim = new Konva.Animation((frame) => {
		const pos = {
			x: particle.x(),
			y: particle.y(),
		};

		// Check for intersection with fixed
		if (isFixedAdjacent(Math.floor(pos.x), Math.floor(pos.y))) {
			createFixedSegment(pos);
			reWalk(particle, pos, layer);
			return;
		}
		walkParticle(particle, pos, true);

	}, layer);
	anim.start();
}

function reWalk(particle, pos, layer) {
	createWalkingParticle(layer, { fill: 'green' });
	particle.x(Math.random() * stage.width());
	particle.y(Math.random() * stage.height());
	layer.draw();
	return;
}

function reWalkUnderendered(walker, layer) {
	layer.add(makeFixedPoint(walker));
	walker.x = Math.random() * stage.width();
	walker.y = Math.random() * stage.height();

	layer.draw();
	return;
}

function walkParticle(particle, pos, isRendered) {
	const xrand = Math.random();
	const yrand = Math.random();

	if (isRendered) {

		if (xrand < 0.5) {
			particle.x(stayInsideStage(pos.x + PARTICLE_SPEED, 'x'))
		} else {
			particle.x(stayInsideStage(pos.x - PARTICLE_SPEED, 'x'))
		}

		if (yrand < 0.5) {
			particle.y(stayInsideStage(pos.y + PARTICLE_SPEED, 'y'))
		} else {
			particle.y(stayInsideStage(pos.y - PARTICLE_SPEED, 'y'))
		}
	} else {
		const walker = particle;
		if (xrand < 0.5) {
			walker.x = stayInsideStage(pos.x + PARTICLE_SPEED, 'x')
		} else {
			walker.x = stayInsideStage(pos.x - PARTICLE_SPEED, 'x')
		}

		if (yrand < 0.5) {
			walker.y = stayInsideStage(pos.y + PARTICLE_SPEED, 'y')
		} else {
			walker.y = stayInsideStage(pos.y - PARTICLE_SPEED, 'y')
		}
	}
}

function startUnrenderedWalk(walker, options) {
	function unrenderedWalk() {
		const pos = { x: walker.x, y: walker.y};
		if (isFixedAdjacent(Math.floor(walker.x), Math.floor(walker.y))) {
			createFixedSegment(pos);
			reWalkUnderendered(walker, layer);
			return;
		}
		walkParticle(walker, pos, false);
	}
	setInterval(unrenderedWalk, 10);
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

function isFixedAdjacent(x, y) {
	return adjacencyMap[x] && adjacencyMap[x][y];
}

function stayInsideStage(n, axis) {
	const width = stage.width();
	const height = stage.height();

	if (axis === 'x') {
		if (n < 0) { return 0; }
		if (n > width) { return width; }
	}

	if (axis === 'y') {
		if (n < 0) { return 0; }
		if (n > height) { return height; }
	}

	return n;
}