import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Create the globe
const globeGeometry = new THREE.SphereGeometry(2, 64, 64);

// Create a simple earth-like texture using a gradient
const canvas = document.createElement('canvas');
canvas.width = 2048;
canvas.height = 1024;
const ctx = canvas.getContext('2d');

// Create a blue and green earth-like texture
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, '#1e3a8a');    // Dark blue
gradient.addColorStop(0.3, '#3b82f6');  // Blue (ocean)
gradient.addColorStop(0.5, '#22c55e');  // Green (land)
gradient.addColorStop(0.7, '#3b82f6');  // Blue (ocean)
gradient.addColorStop(1, '#1e3a8a');    // Dark blue

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Add some random landmass-like patterns
ctx.fillStyle = '#22c55e';
for (let i = 0; i < 100; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 100 + 50;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

// Add darker green for variation
ctx.fillStyle = '#16a34a';
for (let i = 0; i < 50; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 60 + 30;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

const texture = new THREE.CanvasTexture(canvas);
const globeMaterial = new THREE.MeshPhongMaterial({
    map: texture,
    bumpScale: 0.05,
    specular: new THREE.Color('#333333'),
    shininess: 5
});

const globe = new THREE.Mesh(globeGeometry, globeMaterial);
scene.add(globe);

// Add atmosphere glow
const atmosphereGeometry = new THREE.SphereGeometry(2.1, 64, 64);
const atmosphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x4488ff,
    transparent: true,
    opacity: 0.2,
    side: THREE.BackSide
});
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
scene.add(atmosphere);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

// Camera position
camera.position.z = 5;

// Mouse interaction for rotation
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let rotationVelocity = { x: 0, y: 0 };
const damping = 0.95;

renderer.domElement.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
    rotationVelocity = { x: 0, y: 0 };
});

renderer.domElement.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        
        rotationVelocity.x = deltaY * 0.005;
        rotationVelocity.y = deltaX * 0.005;
        
        globe.rotation.y += rotationVelocity.y;
        globe.rotation.x += rotationVelocity.x;
        atmosphere.rotation.y += rotationVelocity.y;
        atmosphere.rotation.x += rotationVelocity.x;
        
        previousMousePosition = { x: e.clientX, y: e.clientY };
    }
});

renderer.domElement.addEventListener('mouseup', () => {
    isDragging = false;
});

renderer.domElement.addEventListener('mouseleave', () => {
    isDragging = false;
});

// Touch events for mobile
renderer.domElement.addEventListener('touchstart', (e) => {
    isDragging = true;
    const touch = e.touches[0];
    previousMousePosition = { x: touch.clientX, y: touch.clientY };
    rotationVelocity = { x: 0, y: 0 };
});

renderer.domElement.addEventListener('touchmove', (e) => {
    if (isDragging) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - previousMousePosition.x;
        const deltaY = touch.clientY - previousMousePosition.y;
        
        rotationVelocity.x = deltaY * 0.005;
        rotationVelocity.y = deltaX * 0.005;
        
        globe.rotation.y += rotationVelocity.y;
        globe.rotation.x += rotationVelocity.x;
        atmosphere.rotation.y += rotationVelocity.y;
        atmosphere.rotation.x += rotationVelocity.x;
        
        previousMousePosition = { x: touch.clientX, y: touch.clientY };
    }
});

renderer.domElement.addEventListener('touchend', () => {
    isDragging = false;
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Apply inertia when not dragging
    if (!isDragging) {
        globe.rotation.y += rotationVelocity.y;
        globe.rotation.x += rotationVelocity.x;
        atmosphere.rotation.y += rotationVelocity.y;
        atmosphere.rotation.x += rotationVelocity.x;
        
        // Apply damping
        rotationVelocity.x *= damping;
        rotationVelocity.y *= damping;
    }
    
    renderer.render(scene, camera);
}

animate();
