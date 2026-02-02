// main.js - Main game initialization and loop

// Initialize the game
function initGame() {
    console.log('🎮 Initializing Wizard Academy...');
    
    // Initialize Three.js scene
    window.initThreeJS();
    
    // Build dungeon world
    window.buildWorld();
    window.addInteractiveObjects();
    
    // Create player character
    window.createCharacter(window.GameState.player.class);
    
    // Setup input handlers
    window.setupInputHandlers();
    
    // Update HUD
    window.updateHUD();
    
    // Start animation loop
    animate();
    
    console.log('✅ Wizard Academy initialized!');
}

// Main animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const delta = window.clock.getDelta();
    
    // Update animations
    if (window.GameState.mixer) {
        window.GameState.mixer.update(delta);
    }
    
    // Update player movement
    window.updateMovement(delta);
    
    // Update camera to follow player
    window.updateCamera();
    
    // Check for interactions
    if (window.checkInteractions) {
        window.checkInteractions();
    }
    
    // Rotate crystals
    window.scene.children.forEach((object) => {
        if (object.userData.type === 'crystal' && !object.userData.collected) {
            object.rotation.y += object.userData.rotation || 0.01;
            object.position.y = 1 + Math.sin(Date.now() * 0.001) * 0.2;
        }
    });
    
    // Render scene
    window.renderer.render(window.scene, window.camera);
}

// Make global functions accessible
window.initGame = initGame;

// Start game when all modules loaded
console.log('✅ Main module loaded');
