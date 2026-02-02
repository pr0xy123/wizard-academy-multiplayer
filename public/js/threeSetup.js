// Three.js Scene Setup
let scene, camera, renderer;
let playerContainer;
let characterModel = null;
let animationMixer = null;
let clock = new THREE.Clock();
let cameraAngle = Math.PI;

const gltfLoader = new THREE.GLTFLoader();

function initThreeJS() {
    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 1, 100);
    scene.background = new THREE.Color(0x0a0a0a);
    
    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('game-container').appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    scene.add(directionalLight);
    
    // Torch lights for atmosphere
    const torchLight1 = new THREE.PointLight(0xff9933, 2, 20);
    torchLight1.position.set(10, 3, 10);
    scene.add(torchLight1);
    
    const torchLight2 = new THREE.PointLight(0xff9933, 2, 20);
    torchLight2.position.set(-10, 3, -10);
    scene.add(torchLight2);
    
    // Player Container
    playerContainer = new THREE.Group();
    scene.add(playerContainer);
    
    // Export to window for global access (after creation)
    window.scene = scene;
    window.camera = camera;
    window.renderer = renderer;
    window.playerContainer = playerContainer;
    window.clock = clock;
    
    // Window resize handler
    window.addEventListener('resize', onWindowResize);
    
    console.log('✓ Three.js initialized');
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function updateCamera() {
    if (!playerContainer) return;
    
    const distance = 8;
    const height = 6;
    
    camera.position.x = GameState.player.x - Math.sin(cameraAngle) * distance;
    camera.position.y = height;
    camera.position.z = GameState.player.z - Math.cos(cameraAngle) * distance;
    
    camera.lookAt(
        GameState.player.x,
        2,
        GameState.player.z
    );
}

// Export functions and loader to window for global access
window.initThreeJS = initThreeJS;
window.updateCamera = updateCamera;
window.gltfLoader = gltfLoader;
