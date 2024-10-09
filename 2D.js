const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const toolbar = document.getElementById('toolbar');

let currentTool = 'pen';
let drawing = false;
let lastX, lastY;
let dragging = false;
let offset = [0, 0];

canvas.addEventListener('mousedown', (e) => {
	drawing = true;
	lastX = e.offsetX;
	lastY = e.offsetY;
});

canvas.addEventListener('mousemove', (e) => {
	if (drawing) {
		if (currentTool === 'pen') {
			ctx.lineTo(e.offsetX, e.offsetY);
			ctx.stroke();
		} else if (currentTool === 'pencil') {
			ctx.fillStyle = 'black';
			ctx.fillRect(e.offsetX, e.offsetY, 2, 2);
		} else if (currentTool === 'eraser') {
			ctx.clearRect(e.offsetX, e.offsetY, 10, 10);
		}
	}
});

canvas.addEventListener('mouseup', () => {
	drawing = false;
});

canvas.addEventListener('mouseout', () => {
	drawing = false;
});

toolbar.addEventListener('mousedown', (e) => {
	dragging = true;
	offset = [toolbar.offsetLeft - e.clientX, toolbar.offsetTop - e.clientY];
});

document.addEventListener('mousemove', (e) => {
	if (dragging) {
		toolbar.style.top = `${e.clientY + offset[1]}px`;
		toolbar.style.left = `${e.clientX + offset[0]}px`;
	}
});

document.addEventListener('mouseup', () => {
	dragging = false;
});

document.addEventListener('click', (e) => {
	if (e.target.classList.contains('tool')) {
		currentTool = e.target.id;
	}
});