class Cathanvas {
	constructor(containerID, options = {}) {
		this.container = document.getElementById(containerID);
		this.width = options.width || 800;
		this.height = options.height || 600;
		this.center = {x: this.width / 2, y: this.height / 2};
		this.id = options.id || 'cathanvas';
		this.canvas = document.createElement('canvas');
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.canvas.id = this.id;
		this.context = this.canvas.getContext('2d');
		this.container.appendChild(this.canvas);
	}

	drawDot(coords, style) {
		this.context.fillStyle = style || '#FFFFFF';
		this.context.fillRect(coords.x, coords.y, 1, 1);
	}

	drawLineFrom(source = [this.center.x, this.center.y], target, style) {
		this.context.strokeStyle = style || '#FFFFFF';
		this.context.moveTo(source[0], source[1]);
		this.context.lineTo(target[0], target[1]);
		this.context.stroke();
	}

	drawLineFromCenter(coords, style) {
		this.context.strokeStyle = style || '#FFFFFF';
		this.context.moveTo(this.center.x, this.center.y);
		this.context.lineTo(coords.x, coords.y);
		this.context.stroke();
	}

	/**
	 * Draws a set of lines
	 * @param coordArray [from, to, from, to, from, to, from to]
	 */
	drawLines(coordArray) {

	}

	animate() {
		// clear canvas

		// save canvas state

		// draw animated shapes

		// restore canvas state
	}
}