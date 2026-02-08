// main.js - Main game initialization

function initGame() {
    console.log('🎮 Initializing Wizard Academy...');
    console.log(`👤 Selected character class: ${window.GameState.player.class}`);
    
    // Hide start screen properly
    document.getElementById('start-screen').classList.remove('active');
    document.getElementById('ui-layer').style.display = 'flex';
    
    // Initialize systems
    console.log('🔧 Initializing Three.js...');
    window.initThreeJS();
    
    console.log('🏰 Building world...');
    window.buildWorld();
    
    console.log('🔮 Adding interactive objects...');
    window.addInteractiveObjects();
    
    console.log('🧙 Creating character...');
    window.createCharacter(window.GameState.player.class);
    
    console.log('🎮 Setting up input handlers...');
    window.setupInputHandlers();
    
    console.log('📊 Updating HUD...');
    window.updateHUD();
    
    // Set initial player position
    window.GameState.player.x = 0;
    window.GameState.player.z = 0;
    if (window.playerContainer) {
        window.playerContainer.position.set(0, 0, 0);
        console.log('📍 Player positioned at origin');
    }
    
    console.log('🎬 Starting animation loop...');
    animate();
    console.log('✅ Game initialized!');
}

function animate() {
    requestAnimationFrame(animate);
    
    const delta = window.clock.getDelta();
    
    if (window.GameState.mixer) {
        window.GameState.mixer.update(delta);
    }
    
    window.updateMovement(delta);
    window.updateCamera();
    
    if (window.checkInteractions) {
        window.checkInteractions();
    }
    
    // Animate crystals
    if (window.scene) {
        window.scene.children.forEach((object) => {
            if (object.userData.type === 'crystal' && !object.userData.collected) {
                object.rotation.y += 0.02;
                object.position.y = 1 + Math.sin(Date.now() * 0.003) * 0.3;
            }
        });
    }
    
    window.renderer.render(window.scene, window.camera);
}

function initStartScreen() {
    console.log('🎬 Initializing start screen...');
    
    // Class selection
    document.querySelectorAll('.class-card').forEach(card => {
        card.addEventListener('click', function() {
            document.querySelectorAll('.class-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            window.GameState.selectedClass = this.dataset.class;
            window.GameState.player.class = this.dataset.class;
        });
    });
    
    // Start buttons
    document.getElementById('start-single').addEventListener('click', function() {
        if (!window.GameState.selectedClass) {
            alert('Please select a class!');
            return;
        }
        window.startSinglePlayer();
    });
    
    document.getElementById('start-multi').addEventListener('click', function() {
        if (!window.GameState.selectedClass) {
            alert('Please select a class!');
            return;
        }
        alert('Multiplayer temporarily disabled - starting single player');
        window.startSinglePlayer();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStartScreen);
} else {
    initStartScreen();
}

window.initGame = initGame;