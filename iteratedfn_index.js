let canvas;
const SEED_SELECTIONS = 100;
const ITERATIONS = 800;
const START_DRAWING = 100;  // cycle at which iterations should start printing
const TICK = 300;

/**
 * Initial triangle - the functions here define the lines involved
 * @type {Array}
 */
const SEED_SHAPE_TRIANGLE = [
    (x) => (-2 * x) + 600,
    (x) => (3 * x) - 1200,
    (x) => 600,
];

const SERPINSKI_TRANSFORMS = [
    (coords) => translateCoords(scaleCoords(coords, 0.5), [0, -200]),
    (coords) => translateCoords(scaleCoords(coords, 0.5), [-200, 200]),
    (coords) => translateCoords(scaleCoords(coords, 0.5), [200, 200]),
];

const ALT_SERPINSKI = [
    (coords) => translateCoords(scaleCoords(coords, 0.47), [-200, -200]),
    (coords) => translateCoords(scaleCoords(coords, 0.47), [-200, 200]),
    (coords) => translateCoords(scaleCoords(coords, 0.47), [200, -200]),
    (coords) => translateCoords(scaleCoords(coords, 0.47), [200, 200]),
];

const AVAILABLE_FRACTALS = [
    {
        label: 'Serpinski Triangle',
        shape: SEED_SHAPE_TRIANGLE,
        transforms: SERPINSKI_TRANSFORMS,
    },
    {
        label: 'Serpinski Square',
        shape: SEED_SHAPE_TRIANGLE,
        transforms: ALT_SERPINSKI,
    },
];

init();

/**
 * FUNCTIONS
 * ---------------------------
 */

function init() {
    initCanvas();
    generateMenu();
}

function generateMenu() {
    AVAILABLE_FRACTALS.forEach(config => {
        const button = document.createElement('button');
        button.className = 'fractalButton';
        button.innerText = config.label;
        button.onclick = () => drawFractal(config.shape, config.transforms);
        const menu = document.getElementById('shapeSelection');
        menu.appendChild(button);
    });
}

function drawFractal(shape, transforms) {
    requestAnimationFrame(() => canvas.clearCanvas());
    for (let i = 0; i < SEED_SELECTIONS; i++) {
        let dot = pickRandomPoint(shape);
        setTimeout(() => extrapolateSeed(dot, transforms), 0);
    }
}

function extrapolateSeed(dot, transforms) {
    let d = dot;
    for (let i = 0; i < ITERATIONS; i++) {
        d = pickRandomTransform(transforms)(d);
        if (i >= START_DRAWING) {
            drawDot(d);
        }
    }
}

function drawDot(dot) {
    setTimeout(() => {
        canvas.drawDot(dot);
    }, TICK);
}

function initCanvas() {
    canvas = new Cathanvas('canvasHolder', {
        width: 800,
        height: 800,
        bgStyle: '#003030',
    });
}

function scaleCoords(coords, factor) {
    const out = [];

    // transform to origin
    const offset = translateCoords(coords, [-canvas.width / 2, -canvas.height / 2])

    for (let i = 0; i < offset.length; i++) {
        out.push(offset[i] * factor);
    }

    return translateCoords(out, [canvas.width / 2, canvas.height / 2]);
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