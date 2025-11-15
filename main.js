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

// Load real Earth texture
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('/textures/earth.jpg');

const globeMaterial = new THREE.MeshPhongMaterial({
    map: earthTexture,
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

// Zoom limits
const minZoom = 3;
const maxZoom = 10;

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
        
        // Improved rotation using camera-relative coordinates
        const rotationSpeed = 0.005;
        
        // Create rotation quaternions for each axis
        const quaternionY = new THREE.Quaternion();
        quaternionY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * rotationSpeed);
        
        // Get the camera's right vector for horizontal rotation
        const cameraRight = new THREE.Vector3(1, 0, 0);
        cameraRight.applyQuaternion(camera.quaternion);
        
        const quaternionX = new THREE.Quaternion();
        quaternionX.setFromAxisAngle(cameraRight, deltaY * rotationSpeed);
        
        // Apply rotations
        globe.quaternion.multiplyQuaternions(quaternionY, globe.quaternion);
        globe.quaternion.multiplyQuaternions(quaternionX, globe.quaternion);
        atmosphere.quaternion.copy(globe.quaternion);
        
        // Store velocity for inertia
        rotationVelocity.x = deltaY * rotationSpeed;
        rotationVelocity.y = deltaX * rotationSpeed;
        rotationVelocity.quaternionX = quaternionX.clone();
        rotationVelocity.quaternionY = quaternionY.clone();
        
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
        
        // Improved rotation using camera-relative coordinates
        const rotationSpeed = 0.005;
        
        // Create rotation quaternions for each axis
        const quaternionY = new THREE.Quaternion();
        quaternionY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * rotationSpeed);
        
        // Get the camera's right vector for horizontal rotation
        const cameraRight = new THREE.Vector3(1, 0, 0);
        cameraRight.applyQuaternion(camera.quaternion);
        
        const quaternionX = new THREE.Quaternion();
        quaternionX.setFromAxisAngle(cameraRight, deltaY * rotationSpeed);
        
        // Apply rotations
        globe.quaternion.multiplyQuaternions(quaternionY, globe.quaternion);
        globe.quaternion.multiplyQuaternions(quaternionX, globe.quaternion);
        atmosphere.quaternion.copy(globe.quaternion);
        
        // Store velocity for inertia
        rotationVelocity.x = deltaY * rotationSpeed;
        rotationVelocity.y = deltaX * rotationSpeed;
        rotationVelocity.quaternionX = quaternionX.clone();
        rotationVelocity.quaternionY = quaternionY.clone();
        
        previousMousePosition = { x: touch.clientX, y: touch.clientY };
    }
});

renderer.domElement.addEventListener('touchend', () => {
    isDragging = false;
});

// Zoom functionality with mouse wheel
renderer.domElement.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomSpeed = 0.002;
    const delta = e.deltaY * zoomSpeed;
    
    camera.position.z += delta;
    camera.position.z = Math.max(minZoom, Math.min(maxZoom, camera.position.z));
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
        if (rotationVelocity.quaternionX && rotationVelocity.quaternionY) {
            // Apply quaternion-based inertia
            globe.quaternion.multiplyQuaternions(rotationVelocity.quaternionY, globe.quaternion);
            globe.quaternion.multiplyQuaternions(rotationVelocity.quaternionX, globe.quaternion);
            atmosphere.quaternion.copy(globe.quaternion);
            
            // Apply damping to quaternions
            const dampedX = rotationVelocity.x * damping;
            const dampedY = rotationVelocity.y * damping;
            
            const cameraRight = new THREE.Vector3(1, 0, 0);
            cameraRight.applyQuaternion(camera.quaternion);
            
            rotationVelocity.quaternionY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), dampedY);
            rotationVelocity.quaternionX.setFromAxisAngle(cameraRight, dampedX);
            
            rotationVelocity.x = dampedX;
            rotationVelocity.y = dampedY;
        }
    }
    
    renderer.render(scene, camera);
}

animate();
