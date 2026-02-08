// Fixed threeSetup.js - Use window.GameState instead of GameState
let scene, camera, renderer;
let playerContainer;
let gltfLoader;
let clock = new THREE.Clock();
let cameraAngle = Math.PI;

function initThreeJS() {
    // Initialize GLTF Loader
    gltfLoader = new THREE.GLTFLoader();
    
    // Configure texture loading
    gltfLoader.manager.onLoad = function() {
        console.log('✅ All assets loaded');
    };
    
    gltfLoader.manager.onError = function(url) {
        console.error('❌ Asset loading error:', url);
    };
    
    // Set cross-origin attribute for loading textures from different domains
    gltfLoader.crossOrigin = 'anonymous';
    
    // Override the default texture resolution to handle missing textures gracefully
    const originalResolveURL = gltfLoader.manager.resolveURL;
    gltfLoader.manager.resolveURL = function(url, path) {
        // If the resolved URL is for warrior_texture.png and it doesn't exist,
        // try to use barbarian_texture.png instead
        if (url.endsWith('warrior_texture.png')) {
            console.log('🔄 Redirecting warrior_texture.png to barbarian_texture.png');
            return url.replace('warrior_texture.png', 'barbarian_texture.png');
        }
        return originalResolveURL ? originalResolveURL(url, path) : url;
    };
    
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x444444, 10, 80);
    scene.background = new THREE.Color(0x2a2a2a);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('game-container').appendChild(renderer.domElement);
    
    const ambientLight = new THREE.AmbientLight(0x808080, 5);
    scene.add(ambientLight);
    
    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1.5);
    scene.add(hemisphereLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const torchLight1 = new THREE.PointLight(0xff9933, 4, 30);
    torchLight1.position.set(10, 3, 10);
    scene.add(torchLight1);
    
    // Additional lights for better dungeon illumination
    const torchLight2 = new THREE.PointLight(0xff9933, 3.5, 25);
    torchLight2.position.set(-10, 3, -10);
    scene.add(torchLight2);
    
    const torchLight3 = new THREE.PointLight(0xff9933, 3.5, 25);
    torchLight3.position.set(10, 3, -10);
    scene.add(torchLight3);
    
    const torchLight4 = new THREE.PointLight(0xff9933, 3.5, 25);
    torchLight4.position.set(-10, 3, 10);
    scene.add(torchLight4);
    
    // Subtle fill light
    const fillLight = new THREE.DirectionalLight(0xffffff, 1.0);
    fillLight.position.set(-5, 10, -5);
    scene.add(fillLight);
    
    // Additional overhead light for better visibility
    const overheadLight = new THREE.PointLight(0xffffff, 3, 40);
    overheadLight.position.set(0, 15, 0);
    scene.add(overheadLight);
    
    playerContainer = new THREE.Group();
    scene.add(playerContainer);
    
    window.scene = scene;
    window.camera = camera;
    window.renderer = renderer;
    window.playerContainer = playerContainer;
    window.gltfLoader = gltfLoader;
    window.clock = clock;
    window.cameraAngle = cameraAngle;
    
    window.addEventListener('resize', onWindowResize);
    
    // Add debugging info
    console.log('✅ Three.js initialized');
    console.log('📦 GLTF Loader ready');
    console.log('🔦 Renderer info:', renderer.getContext().getExtension('WEBGL_debug_renderer_info'));
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function updateCamera() {
    if (!playerContainer || !window.GameState) return;
    
    const distance = 8;
    const height = 6;
    
    // FIX: Use window.GameState instead of GameState
    const playerX = window.GameState.player.x || 0;
    const playerZ = window.GameState.player.z || 0;
    
    camera.position.x = playerX - Math.sin(cameraAngle) * distance;
    camera.position.y = height;
    camera.position.z = playerZ - Math.cos(cameraAngle) * distance;
    
    camera.lookAt(playerX, 2, playerZ);
}

window.initThreeJS = initThreeJS;
window.updateCamera = updateCamera;