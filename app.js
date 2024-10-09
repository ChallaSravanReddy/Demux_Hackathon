// app.js
let scene, camera, renderer;
let objects = [];

// Initialize the scene
function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x282c34);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('workspace').appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1, 100);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  animate();
}

// Add a cube
function addCube() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  
  cube.position.set(Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 4 - 2);
  scene.add(cube);
  objects.push(cube);
}

// Add a cuboid
function addCuboid() {
  const geometry = new THREE.BoxGeometry(2, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const cuboid = new THREE.Mesh(geometry, material);

  cuboid.position.set(Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 4 - 2);
  scene.add(cuboid);
  objects.push(cuboid);
}

// Add a cylinder
function addCylinder() {
  const geometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0x0000ff });
  const cylinder = new THREE.Mesh(geometry, material);

  cylinder.position.set(Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 4 - 2);
  scene.add(cylinder);
  objects.push(cylinder);
}

// Add a sphere
function addSphere() {
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
  const sphere = new THREE.Mesh(geometry, material);

  sphere.position.set(Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 4 - 2);
  scene.add(sphere);
  objects.push(sphere);
}

// Reset the scene
function resetScene() {
  objects.forEach(obj => scene.remove(obj));
  objects = [];
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  objects.forEach(obj => {
    obj.rotation.x += 0.05;
    obj.rotation.y += 0.05;
  });

  renderer.render(scene, camera);
}

// Event listeners for toolbar buttons
document.getElementById('add-cube').addEventListener('click', addCube);
document.getElementById('add-cuboid').addEventListener('click', addCuboid);
document.getElementById('add-cylinder').addEventListener('click', addCylinder);
document.getElementById('add-sphere').addEventListener('click', addSphere);
document.getElementById('reset').addEventListener('click', resetScene);

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
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
// Initialize the 3D scene
init();
