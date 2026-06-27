// ui.js - UI setup, input handling, and HUD management

let keys = {};
let cameraAngle = 0;
window.cameraAngle = cameraAngle;
window.keys = keys;

// ==========================================
// INPUT HANDLERS
// ==========================================
function setupInputHandlers() {
    if (window.__inputHandlersBound) return;
    window.__inputHandlersBound = true;
    
    console.log('🎮 Setting up input handlers...');
    
    // Keyboard input
    window.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
    });
    
    window.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });
    
    // Lose focus
    window.addEventListener('blur', () => {
        keys = {};
    });
    
    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) modal.style.display = 'none';
        });
    });
    
    console.log('✅ Input handlers bound');
}

// ==========================================
// MOVEMENT
// ==========================================
function updateMovement(delta) {
    if (!window.GameState.isPlaying || !window.playerContainer) return;
    
    let inputX = 0;
    let inputZ = 0;
    
    // WASD movement
    if (keys['w']) inputZ -= 1;
    if (keys['s']) inputZ += 1;
    if (keys['a']) inputX -= 1;
    if (keys['d']) inputX += 1;
    
    // Camera rotation with Q/E
    const camRotSpeed = 1.8;
    if (keys['q']) cameraAngle += camRotSpeed * delta;
    if (keys['e']) cameraAngle -= camRotSpeed * delta;
    window.cameraAngle = cameraAngle;
    
    if (inputX === 0 && inputZ === 0) return;
    
    // Normalize direction
    const len = Math.hypot(inputX, inputZ) || 1;
    inputX /= len;
    inputZ /= len;
    
    // Convert to camera-relative movement
    const sin = Math.sin(cameraAngle);
    const cos = Math.cos(cameraAngle);
    const moveX = inputX * cos - inputZ * sin;
    const moveZ = inputX * sin + inputZ * cos;
    
    // Movement speed
    const speed = 8.0;
    const nextX = window.playerContainer.position.x + moveX * speed * delta;
    const nextZ = window.playerContainer.position.z + moveZ * speed * delta;
    
    // Collision check (axis-separated for sliding)
    if (!isBlocked(nextX, window.playerContainer.position.z)) {
        window.playerContainer.position.x = nextX;
    }
    if (!isBlocked(window.playerContainer.position.x, nextZ)) {
        window.playerContainer.position.z = nextZ;
    }
    
    // Face direction
    const targetYaw = Math.atan2(moveX, moveZ);
    window.playerContainer.rotation.y = THREE.MathUtils.lerp(
        window.playerContainer.rotation.y,
        targetYaw,
        Math.min(1, delta * 12)
    );
    
    // Sync to GameState
    window.GameState.player.x = window.playerContainer.position.x;
    window.GameState.player.z = window.playerContainer.position.z;
    window.GameState.player.rotation = window.playerContainer.rotation.y;
}

function isBlocked(x, z, radius = 1.0) {
    if (!window.wallColliders) return false;
    
    for (const w of window.wallColliders) {
        if (
            x + radius > w.min.x && x - radius < w.max.x &&
            z + radius > w.min.z && z - radius < w.max.z
        ) {
            return true;
        }
    }
    return false;
}

// ==========================================
// START SCREEN
// ==========================================
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
    const startSingleBtn = document.getElementById('start-single');
    if (startSingleBtn) {
        startSingleBtn.addEventListener('click', function() {
            if (!window.GameState.selectedClass) {
                alert('Please select a class!');
                return;
            }
            startSinglePlayer();
        });
    }
    
    const startMultiBtn = document.getElementById('start-multi');
    if (startMultiBtn) {
        startMultiBtn.addEventListener('click', function() {
            if (!window.GameState.selectedClass) {
                alert('Please select a class!');
                return;
            }
            alert('Multiplayer temporarily disabled - starting single player');
            startSinglePlayer();
        });
    }
}

function startSinglePlayer() {
    console.log('🎮 Starting single player game...');
    
    window.GameState.isPlaying = true;
    document.getElementById('start-screen').classList.remove('active');
    document.getElementById('ui-layer').style.display = 'flex';
    
    if (window.initGame) {
        window.initGame();
    }
}

// ==========================================
// MODALS
// ==========================================
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'block';
}

// ==========================================
// DEBUG
// ==========================================
const debugLog = (function() {
    const logs = [];
    const maxLogs = 20;
    
    return function(msg) {
        logs.unshift(msg);
        if (logs.length > maxLogs) logs.pop();
        
        const logEl = document.getElementById('debug-log');
        if (logEl) {
            logEl.innerHTML = logs.map(log => `<div>${log}</div>`).join('');
        }
        
        console.log(msg);
    };
})();

function toggleDebug() {
    window.GameState.debugMode = !window.GameState.debugMode;
    const banner = document.getElementById('debug-banner');
    if (banner) {
        banner.style.display = window.GameState.debugMode ? 'block' : 'none';
    }
}

// Export to window
window.setupInputHandlers = setupInputHandlers;
window.updateMovement = updateMovement;
window.isBlocked = isBlocked;
window.initStartScreen = initStartScreen;
window.startSinglePlayer = startSinglePlayer;
window.closeModal = closeModal;
window.openModal = openModal;
window.debugLog = debugLog;
window.toggleDebug = toggleDebug;

// Initialize start screen when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStartScreen);
} else {
    initStartScreen();
}
