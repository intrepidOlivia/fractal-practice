const PARTICLE_SPEED = 2;	// pixels per second
const NUM_PARTICLES = 10000;

var stage = new Konva.Stage({
	container: 'root',
	width: 400,
	height: 400,
});

var layer = new Konva.Layer();

// Root numbers represent x coords,
// nested represent y coords
const adjacencyMap = {};

initParticles(layer);

stage.add(layer);
layer.draw();

/** FUNCTIONS **/

function initParticles(layer) {
	// Initialize with one fixed particle
	layer.add(makeFixed({
		x: stage.width() / 2,
		y: stage.height() / 2,
	}));

	for (let i = 0; i < NUM_PARTICLES; i++) {
		// createWalkingParticle(layer);
		createUnrenderedWalker();
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

function makeFixed(coords) {
	var fixed = new Konva.Rect({
		x: coords.x,
		y: coords.y,
		width: 1,
		height: 1,
		fill: '#FFFFFF',
	});
	addToAdjacencyMap(Math.floor(coords.x), Math.floor(coords.y));
	return fixed;
}

function createWalkingParticle(layer, options) {
	const particle = makeParticle({
		x: Math.random() * stage.width(),
		y: Math.random() * stage.height(),
		...options,
	});

	layer.add(particle);
	randomWalk(particle, layer, { fill: 'green' });
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
			anim.stop();
			layer.add(makeFixed(pos));
			createWalkingParticle(layer, options);
			particle.destroy();
			layer.draw();
			return;
		}

		const xrand = Math.random();
		const yrand = Math.random();

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

	}, layer);
	anim.start();
}

function startUnrenderedWalk(walker, options) {
	function unrenderedWalk() {
		if (isFixedAdjacent(Math.floor(walker.x), Math.floor(walker.y))) {
			layer.add(makeFixed(walker));
			// createWalkingGreenParticle(layer, options);
			// clearInterval(unrenderedWalk);
			walker.x = Math.random() * stage.width();
			walker.y = Math.random() * stage.height();

			layer.draw();
			return;
		}

		const xrand = Math.random();
		const yrand = Math.random();

		if (xrand < 0.5) {
			walker.x = stayInsideStage(walker.x + PARTICLE_SPEED, 'x')
		} else {
			walker.x = stayInsideStage(walker.x - PARTICLE_SPEED, 'x')
		}

		if (yrand < 0.5) {
			walker.y = stayInsideStage(walker.y + PARTICLE_SPEED, 'y')
		} else {
			walker.y = stayInsideStage(walker.y - PARTICLE_SPEED, 'y')
		}
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