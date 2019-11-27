let canvas;
let dragon = [];
let UNIT_LENGTH = 5;
const ANIM_RATE = 1000;
const R = [[0, -1], [1, 0]];


let animLoop = true;

function init() {
	initCanvas();
	initDragon();
	// initAnimation();
	initIntervalAnimation();
}

function initCanvas() {
	canvas = new Cathanvas('root', {
		width: 500,
		height: 500,
	});
}

function initDragon() {
	dragon.push([canvas.center.x, canvas.center.y]);
	dragon.push([canvas.center.x, canvas.center.y + UNIT_LENGTH]);
}

function initAnimation() {
	requestAnimationFrame(animateDragon);
}

function initIntervalAnimation() {
	animLoop = setInterval(intervalAnimateDragon, ANIM_RATE);
}

function animateDragon() {
	canvas.context.clearRect(0, 0, canvas.width, canvas.height);
	for (let i = 0; i < dragon.length - 1; i += 2) {
		canvas.drawLineFrom(dragon[i], dragon[i + 1], '#FFFFFF');
	}
	iterateDragon();
	if (animLoop) {
		requestAnimationFrame(animateDragon);
	}
}

function intervalAnimateDragon() {
	canvas.context.clearRect(0, 0, canvas.width, canvas.height);
	for (let i = 0; i < dragon.length - 1; i += 2) {
		canvas.drawLineFrom(dragon[i], dragon[i + 1], '#FFFFFF');
	}
	iterateDragon();
}

function iterateDragon() {
	const offset = [dragon[dragon.length - 1][0] - dragon[0][0], dragon[dragon.length - 1][1] - dragon[0][1]]
	const nextDragon = translate(rotateClockwise(dragon), offset);
	dragon = dragon.concat(nextDragon);
}

/**
 *
 * @param vector [[x y], [x, y]]
 * @param modifier [x, y]
 */
function translate(vector, modifier) {
	return vector.map(coord => [
		coord[0] + modifier[0],
		coord[1] + modifier[1]
	]);
}

function rotateClockwise(vector, angle=90) {
	// TODO: make vector diagonal?
	const offset = [-vector[0][0], -vector[0][1]];


	for (let i = 0; i < vector.length - 1; i += 2) {
		// Move to center
		let v = translate([vector[i], vector[i + 1]], offset);
		v = transpose(v);	// transpose x and y

		// Rotate around origin
		const product = dotProduct(R, v);

		// Move back to location
		v = transpose(translate(product, [-offset[0], -offset[1]]));

		// Reassign value
		vector[i] = v[0];
		vector[i + 1] = v[1];
	}
	return vector;
}

/**
 * [[x, y], [x, y]] -> [[x, x],[y, y]]
 * [[x, x],[y, y]] -> [[x, y],[x, y]]
 * @param v
 */
function transpose(v) {
	return [[v[0][0], v[1][0]], [v[0][1], v[1][1]]];
}



// [ x1, y1 ]
// [ x2, y2 ]
// NOTE: This function only works for two-column source, two-row target.
function dotProduct(source, target, rows) {
	if (source.length !== target.length) {
		console.error("Cannot perform dot product of unequal count", source, target);
		throw new Error ("Cannot perform dot product of unequal count");
	}

	const v1 = [];
	const v2 = [];

	v1.push((source[0][0] * target[0][0]) + (source[0][1] * target[1][0]));
	v1.push((source[0][0] * target[0][1]) + (source[0][1] * target[1][1]))

	v2.push((source[1][0] * target[0][0]) + (source[1][1] * target[1][0]));
	v2.push((source[1][0] * target[0][1]) + (source[1][1] * target[1][1]))

	return [v1, v2];
}

function stopGrowing() {
	clearInterval(animLoop);
	animLoop = false;
}