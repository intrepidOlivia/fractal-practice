let canvas;
let dragon = [];
let UNIT_LENGTH = 10;
const ANIM_RATE = 1000;

let animLoop;

function init() {
	initCanvas();
	initDragon();
	initAnimation();
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
	// canvas.drawLineFrom(dragon[0], dragon[1]);
}

function initAnimation() {
	animLoop = setInterval(animateDragon, ANIM_RATE);
}

function animateDragon() {
	canvas.context.clearRect(0, 0, canvas.width, canvas.height);
	for (let i = 0; i < dragon.length - 1; i += 2) {
		// let j = i;
		// canvas.drawLineFrom(dragon[j], dragon[j + 1], '#FFFFFF');
		canvas.drawLineFrom(dragon[i], dragon[i + 1], '#FFFFFF');
	}
	// iterateDragon();
}

function iterateDragon() {
	dragon = rotateClockwise(dragon);

	// offset all points by (initial point -> last point), then rotate around last point
	// const offset = [dragon[dragon.length - 1][0] - dragon[0][0], dragon[dragon.length - 1][1] - dragon[0][1]]
	// dragon = translate(dragon, offset);
}

/**
 *
 * @param vector [[x y], [x, y]]
 * @param modifier [x, y]
 */
function translate(vector, modifier) {
	vector.forEach(coord => {
		coord[0] += modifier[0]
		coord[1] += modifier[1]
	});
	return vector;
}

function rotateClockwise(vector, angle=90) {
	// TODO: make vector diagonal?
	const R = rotationMatrix(angle);
	console.log('Value of R with angle', angle, vector);

	for (let i = 0; i < vector.length - 1; i += 2) {
		// Move to center
		const offset = [-vector[i][0], -vector[i][1]];
		let v1 = translate(vector[i], offset);
		let v2 = translate(vector[i + 1], offset);

		// Rotate around origin
		const product = dotProduct(R, v1.concat(v2));

		// Move back to location
		v1 = translate(product.slice(0, 2), [-offset[0], -offset[1]]);
		v2 = translate(product.slice(2), [-offset[0], -offset[1]]);

		// Reassign value
		vector[i] = v1;
		vector[i + 1] = v2;
	}
	return vector;
}

const rotationMatrix = (angle) => [
	Math.cos(angle), Math.sin(angle),
	-1 * Math.sin(angle), Math.cos(angle)
];

// [ x1, y1 ]
// [ x2, y2 ]
// [ x3, y3 ]
// [ x4, y4 ]
// NOTE: This function only works for two-column source, two-row target.
function dotProduct(source, target, rows) {
	console.log('source:', source);
	console.log('target:', target);

	if (source.length !== target.length) {
		console.error("Cannot perform dot product of unequal count", source, target);
		throw new Error ("Cannot perform dot product of unequal count");
	}

	const out = [];

	out.push((source[0] * target[0]) + (source[1] * target[2]));
	out.push((source[0] * target[1]) + (source[1] * target[3]))

	out.push((source[2] * target[0]) + (source[3] * target[2]));
	out.push((source[2] * target[1]) + (source[3] * target[3]))

	return out;
}

function stopGrowing() {
	clearInterval(animLoop);
}