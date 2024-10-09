document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');

    let currentTool = 'pen';
    let drawing = false;
    let startX, startY;
    let history = [];
    let redoStack = [];
    let textInput;

    // Set up tool buttons
    document.getElementById('pen').addEventListener('click', () => currentTool = 'pen');
    document.getElementById('pencil').addEventListener('click', () => currentTool = 'pencil');
    document.getElementById('eraser').addEventListener('click', () => currentTool = 'eraser');
    document.getElementById('rectangle').addEventListener('click', () => currentTool = 'rectangle');
    document.getElementById('circle').addEventListener('click', () => currentTool = 'circle');
    document.getElementById('textbox').addEventListener('click', () => {
        currentTool = 'textbox';
        textInput = prompt("Enter the text:");
        if (textInput) {
            drawText(startX, startY, textInput);
        }
    });
    document.getElementById('undo').addEventListener('click', undo);
    document.getElementById('redo').addEventListener('click', redo);

    // Canvas events
    canvas.addEventListener('mousedown', (e) => {
        startX = e.offsetX;
        startY = e.offsetY;
        drawing = true;
    });

    canvas.addEventListener('mousemove', (e) => {
        if (drawing) {
            const x = e.offsetX;
            const y = e.offsetY;
            if (currentTool === 'pen' || currentTool === 'pencil') {
                drawLine(startX, startY, x, y);
                startX = x;
                startY = y;
            }
            else if (currentTool === 'eraser') {
                ctx.clearRect(e.offsetX, e.offsetY, 15, 15);
            } else if (currentTool === 'rectangle' || currentTool === 'circle') {
                drawShape(startX, startY, x, y, currentTool);
            }
        }
    });

    canvas.addEventListener('mouseup', () => {
        drawing = false;
        saveState();
    });

    function drawLine(x1, y1, x2, y2) {
        ctx.strokeStyle = currentTool === 'pen' ? '#000' : '#888';
        ctx.lineWidth = currentTool === 'pen' ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    function drawShape(x1, y1, x2, y2, shape) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas to avoid overlapping shapes
        // Draw shape
        if (shape === 'rectangle') {
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
        } else if (shape === 'circle') {
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            const radius = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
            ctx.beginPath();
            ctx.arc(x1, y1, radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }

    function drawText(x, y, text) {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#000';
        ctx.fillText(text, x, y);
    }

    function saveState() {
        history.push(canvas.toDataURL());
        redoStack = []; // Clear redo stack when new action is done
    }

    function undo() {
        if (history.length > 0) {
            redoStack.push(history.pop());
            const lastState = history[history.length - 1] || null;
            if (lastState) {
                const img = new Image();
                img.src = lastState;
                img.onload = function () {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                };
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }

    function redo() {
        if (redoStack.length > 0) {
            const redoState = redoStack.pop();
            history.push(redoState);
            const img = new Image();
            img.src = redoState;
            img.onload = function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
        }
    }
    

});