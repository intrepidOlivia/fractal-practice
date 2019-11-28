let canvas;
const seedPoints = [];

/**
 * Initial triangle - the functions here define the lines involved
 * @type {Array}
 */
const seedShape = [
    (x) => (-2 * x) + 600,
    (x) => (3 * x) - 1200,
    (x) => 600,
];

const TRANSFORMS = [
    (coords) => translateCoords(scaleCoords(coords, 0.33), [0, -200]),
    (coords) => translateCoords(scaleCoords(coords, 0.33), [-200, 200]),
    (coords) => translateCoords(scaleCoords(coords, 0.33), [200, 200]),
];

init();

/**
 * FUNCTIONS
 * ---------------------------
 */

function init() {
    initCanvas();

    for (let i = 0; i < 500; i++) {
        let dot = pickRandomPoint(seedShape)
        // canvas.drawDot(dot);
        for (let i = 0; i < 10; i++) {
            const newDot = transformAndDraw(dot);
            dot = newDot;
        }
    }
}

function transformAndDraw(dot) {
    const transformedDot = pickRandomTransform(TRANSFORMS)(dot);
    canvas.drawDot(transformedDot);
    return transformedDot;
}

function initCanvas() {
    canvas = new Cathanvas('root', {
        width: 601,
        height: 601,
        bgStyle: '#003030',
    });
}

function scaleCoords(coords, factor) {
    const out = [];
    for (let i = 0; i < coords.length; i++) {
        out.push(coords[i] * factor);
    }
    return out;
}

function translateCoords(coords, deltaCoords) {
    const out = [];
    for (let i = 0; i < coords.length; i++) {
        out.push(coords[i] + deltaCoords[i]);
    }
    return out;
}

function pickRandomPoint(seedShape) {
    // pick random x
    const randX = Math.floor(Math.random() * canvas.width);

    // pick random line in shape
    const randLine = Math.floor(Math.random() * seedShape.length);

    // Check if y is within bounds
    const randY = seedShape[randLine](randX);

    if (randY < 0 || randY > canvas.height) {
        return pickRandomPoint(seedShape);
    }

    return [randX, randY];
}

function pickRandomTransform(transforms) {
    const rand = Math.floor(Math.random() * transforms.length);
    return transforms[rand];
}