class Cathanvas {
	constructor(containerID, options = {}) {
		this.container = document.getElementById(containerID);
		this.width = options.width || 800;
		this.height = options.height || 600;
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
}