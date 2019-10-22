const PARTICLE_SPEED = 2;	// pixels per second
const NUM_PARTICLES = 1000;

var stage = new Konva.Stage({
	container: 'root',
	width: 400,
	height: 400,
});

var layer = new Konva.Layer();

// Root numbers represent x coords,
// nested represent y coords
const adjacencyMap = {};

// Initialize with one fixed particle
layer.add(makeFixed({
	x: stage.width() / 2,
	y: stage.height() / 2,
}));

for (let i = 0; i < NUM_PARTICLES; i++) {
	createWalkingParticle(layer);
}

stage.add(layer);
layer.draw();

/** FUNCTIONS **/

function makeParticle(coords) {
	return new Konva.Rect({
		x: coords.x,
		y: coords.y,
		width: 1,
		height: 1,
		fill: 'blue',
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

function createWalkingParticle(layer) {
	const particle = makeParticle({
		x: Math.random() * stage.width(),
		y: Math.random() * stage.height(),
	});

	layer.add(particle);
	randomWalk(particle, layer);
}

function randomWalk(particle, layer) {
	const anim = new Konva.Animation((frame) => {
		const pos = {
			x: particle.x(),
			y: particle.y(),
		};

		// Check for intersection with fixed
		if (isFixedAdjacent(Math.floor(pos.x), Math.floor(pos.y))) {
			anim.stop();
			layer.add(makeFixed(pos));
			createWalkingParticle(layer);
			particle.destroy();
			layer.draw();
			return;
		}

		const xrand = Math.random();
		const yrand = Math.random();

		if (xrand < 0.5) {
			particle.x(pos.x + PARTICLE_SPEED)
		} else {
			particle.x(pos.x - PARTICLE_SPEED)
		}

		if (yrand < 0.5) {
			particle.y(pos.y + PARTICLE_SPEED)
		} else {
			particle.y(pos.y - PARTICLE_SPEED)
		}

	}, layer);
	anim.start();
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