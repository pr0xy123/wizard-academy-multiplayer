// ui.js - User interface handlers and updates

// Update HUD with current player stats
function updateHUD() {
    // Health
    const healthBar = document.getElementById('health-bar');
    const healthText = document.getElementById('health-text');
    const healthPercent = Math.max(0, (window.GameState.player.health / 100) * 100);
    healthBar.style.width = healthPercent + '%';
    healthText.textContent = `${Math.floor(window.GameState.player.health)}/100`;
    
    // Mana
    const manaBar = document.getElementById('mana-bar');
    const manaText = document.getElementById('mana-text');
    const manaPercent = Math.max(0, (window.GameState.player.mana / 100) * 100);
    manaBar.style.width = manaPercent + '%';
    manaText.textContent = `${Math.floor(window.GameState.player.mana)}/100`;
    
    // XP and Level
    const xpBar = document.getElementById('xp-bar');
    const levelText = document.getElementById('level-text');
    const xpNeeded = window.GameState.player.level * 100;
    const xpPercent = Math.min(100, (window.GameState.player.xp / xpNeeded) * 100);
    xpBar.style.width = xpPercent + '%';
    levelText.textContent = `Level ${window.GameState.player.level}`;
    
    // Gold
    const goldText = document.getElementById('gold-text');
    goldText.textContent = `${window.GameState.player.gold} Gold`;
    
    // Player name
    const nameText = document.getElementById('player-name');
    nameText.textContent = window.GameState.player.name;
}

// Start screen - Class selection
function selectClass(className) {
    window.GameState.selectedClass = className;
    
    // Remove selected class from other cards
    document.querySelectorAll('.class-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selected class to the clicked card
    const clickedCard = document.querySelector(`.class-card[data-class="${className}"]`);
    if (clickedCard) {
        clickedCard.classList.add('selected');
    }
    
    console.log(`🎭 Selected class: ${className}`);
}

// Start single player game
function startSinglePlayer() {
    const name = document.getElementById('player-name-input').value.trim();
    const grade = parseInt(document.getElementById('grade-select').value);
    
    if (!name) {
        alert('Please enter your name!');
        return;
    }
    
    if (!window.GameState.selectedClass) {
        alert('Please select a class!');
        return;
    }
    
    // Set player data
    window.GameState.player.name = name;
    window.GameState.player.grade = grade;
    window.GameState.player.class = window.GameState.selectedClass;
    window.GameState.isMultiplayer = false;
    
    console.log(`🎮 Starting single player as ${name}, grade ${grade}, class ${window.GameState.selectedClass}`);
    
    // Hide start screen
    document.getElementById('start-screen').style.display = 'none';
    
    // Start game
    if (window.initGame) {
        window.initGame();
    }
}

// Start multiplayer game
function startMultiplayer() {
    const name = document.getElementById('player-name-input').value.trim();
    const grade = parseInt(document.getElementById('grade-select').value);
    
    if (!name) {
        alert('Please enter your name!');
        return;
    }
    
    if (!window.GameState.selectedClass) {
        alert('Please select a class!');
        return;
    }
    
    // Set player data
    window.GameState.player.name = name;
    window.GameState.player.grade = grade;
    window.GameState.player.class = window.GameState.selectedClass;
    window.GameState.isMultiplayer = true;
    
    console.log(`🌐 Starting multiplayer as ${name}`);
    
    // Hide start screen
    document.getElementById('start-screen').style.display = 'none';
    
    // Connect to multiplayer server
    connectMultiplayer();
}

// Connect to multiplayer server
function connectMultiplayer() {
    if (typeof io === 'undefined') {
        console.error('❌ Socket.io not loaded');
        alert('Multiplayer not available. Starting single player mode.');
        window.GameState.isMultiplayer = false;
        if (window.initGame) window.initGame();
        return;
    }
    
    window.GameState.socket = io();
    
    window.GameState.socket.on('connect', () => {
        console.log('✅ Connected to multiplayer server');
        
        // Send player join
        window.GameState.socket.emit('playerJoin', {
            name: window.GameState.player.name,
            class: window.GameState.player.class,
            x: window.GameState.player.x,
            z: window.GameState.player.z
        });
        
        // Start game
        if (window.initGame) {
            window.initGame();
        }
    });
    
    window.GameState.socket.on('currentPlayers', (players) => {
        console.log('👥 Current players:', players);
        // TODO: Spawn other players in scene
    });
    
    window.GameState.socket.on('playerMoved', (data) => {
        // TODO: Update other player position
    });
    
    window.GameState.socket.on('playerDisconnected', (playerId) => {
        console.log('👋 Player disconnected:', playerId);
        // TODO: Remove player from scene
    });
}

// Show inventory modal
function showInventory() {
    const modal = document.getElementById('inventory-modal');
    modal.style.display = 'flex';
    
    // Update inventory display
    const inventoryGrid = document.getElementById('inventory-grid');
    inventoryGrid.innerHTML = '';
    
    window.GameState.player.inventory.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item';
        itemDiv.textContent = item.name;
        itemDiv.onclick = () => useItem(index);
        inventoryGrid.appendChild(itemDiv);
    });
}

// Close inventory modal
function closeInventory() {
    document.getElementById('inventory-modal').style.display = 'none';
}

// Use item from inventory
function useItem(index) {
    const item = window.GameState.player.inventory[index];
    
    if (item.type === 'health') {
        window.GameState.player.health = Math.min(100, window.GameState.player.health + item.value);
        updateHUD();
    } else if (item.type === 'mana') {
        window.GameState.player.mana = Math.min(100, window.GameState.player.mana + item.value);
        updateHUD();
    }
    
    // Remove item from inventory
    window.GameState.player.inventory.splice(index, 1);
    showInventory(); // Refresh display
}

// Keyboard input handling
const keys = {};

function setupInputHandlers() {
    // Keyboard down
    document.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;
        
        // Combat answer submission
        if (e.key === 'Enter' && window.GameState.inCombat) {
            if (window.submitAnswer) {
                window.submitAnswer();
            }
        }
        
        // Inventory
        if (e.key === 'i' || e.key === 'I') {
            showInventory();
        }
        
        // ESC to close modals
        if (e.key === 'Escape') {
            closeInventory();
        }
    });
    
    // Keyboard up
    document.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });
    
    // Combat submit button
    const submitBtn = document.getElementById('submit-answer');
    if (submitBtn) {
        submitBtn.onclick = () => {
            if (window.submitAnswer) {
                window.submitAnswer();
            }
        };
    }
    
    // Class selection cards
    document.querySelectorAll('.class-card').forEach(card => {
        card.onclick = (e) => {
            const className = card.dataset.class;
            selectClass(className);
        };
    });
    
    // Start buttons
    const singlePlayerBtn = document.getElementById('start-single');
    if (singlePlayerBtn) {
        singlePlayerBtn.onclick = startSinglePlayer;
    }
    
    const multiPlayerBtn = document.getElementById('start-multi');
    if (multiPlayerBtn) {
        multiPlayerBtn.onclick = startMultiplayer;
    }
}

// Handle player movement based on input
function updateMovement(delta) {
    if (window.GameState.inCombat) return;
    
    let dx = 0;
    let dz = 0;
    const speed = 5 * delta;
    
    // Get camera angle for relative movement
    const cameraAngle = window.cameraAngle || 0;
    
    // WASD movement (camera-relative)
    if (keys['w'] || keys['arrowup']) {
        dx += Math.sin(cameraAngle) * speed;
        dz += Math.cos(cameraAngle) * speed;
    }
    if (keys['s'] || keys['arrowdown']) {
        dx -= Math.sin(cameraAngle) * speed;
        dz -= Math.cos(cameraAngle) * speed;
    }
    if (keys['a'] || keys['arrowleft']) {
        dx += Math.sin(cameraAngle + Math.PI/2) * speed;
        dz += Math.cos(cameraAngle + Math.PI/2) * speed;
    }
    if (keys['d'] || keys['arrowright']) {
        dx += Math.sin(cameraAngle - Math.PI/2) * speed;
        dz += Math.cos(cameraAngle - Math.PI/2) * speed;
    }
    
    // Camera rotation
    if (keys['q']) {
        window.cameraAngle += 2 * delta;
    }
    if (keys['e']) {
        window.cameraAngle -= 2 * delta;
    }
    
    // Apply movement
    const isMoving = dx !== 0 || dz !== 0;
    
    if (isMoving) {
        window.playerContainer.position.x += dx;
        window.playerContainer.position.z += dz;
        
        // Update player data
        window.GameState.player.x = window.playerContainer.position.x;
        window.GameState.player.z = window.playerContainer.position.z;
        
        // Rotate player to face movement direction
        const angle = Math.atan2(dx, dz);
        window.playerContainer.rotation.y = angle;
        
        // Send position to multiplayer server
        if (window.GameState.isMultiplayer && window.GameState.socket) {
            window.GameState.socket.emit('playerMove', {
                x: window.GameState.player.x,
                z: window.GameState.player.z,
                rotation: angle
            });
        }
    }
    
    // Update character animation
    if (window.updateCharacterAnimation) {
        window.updateCharacterAnimation(isMoving);
    }
    
    return isMoving;
}

// Export functions and variables to window for global access
window.keys = keys;
window.updateHUD = updateHUD;
window.selectClass = selectClass;
window.startSinglePlayer = startSinglePlayer;
window.startMultiplayer = startMultiplayer;
window.showInventory = showInventory;
window.closeInventory = closeInventory;
window.setupInputHandlers = setupInputHandlers;
window.updateMovement = updateMovement;
