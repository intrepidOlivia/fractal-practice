let canvas;
let dragon = [];
let UNIT_LENGTH = 10;

function initCanvas() {
	canvas = new Cathanvas('root', {
		width: 500,
		height: 500,
	});
}

function initDragon() {
	dragon.push([canvas.center.x, canvas.center.y]);
	dragon.push([canvas.center.x, canvas.center.y + UNIT_LENGTH]);
	canvas.drawLineFrom(dragon[0], dragon[1]);
}

function iterateDragon() {
	// offset all points by (initial point -> last point), then rotate around last point
	const offset = [dragon[dragon.length - 1][0] - dragon[0][0], dragon[dragon.length - 1][1] - dragon[0][1]]
	const translated = translate(dragon, offset);
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

function rotateClockwise(vector, angle) {
	// make vector diagonal
}

const rotationMatrix = (angle) => [
	Math.cos(angle), Math.sin(angle),
	-1 * Math.sin(angle), Math.cos(angle)
];