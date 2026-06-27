// entities.js - Crystals, enemies, chests, particles, and interactions

// ==========================================
// CRYSTALS - XP pickup objects
// ==========================================
function placeCrystals() {
    console.log('✨ Placing crystals...');
    
    const crystalPositions = [
        { x: 5, z: 5 },
        { x: -5, z: 5 },
        { x: 5, z: -5 },
        { x: -5, z: -5 },
        { x: 0, z: 15 },
        { x: 0, z: -15 },
        { x: 15, z: 0 },
        { x: -15, z: 0 }
    ];
    
    crystalPositions.forEach((pos, idx) => {
        const geometry = new THREE.IcosahedronGeometry(0.5, 4);
        const material = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            emissive: 0x00aaff,
            emissiveIntensity: 0.5,
            metalness: 0.8,
            roughness: 0.2
        });
        
        const crystal = new THREE.Mesh(geometry, material);
        crystal.position.set(pos.x, 1.5, pos.z);
        crystal.castShadow = true;
        crystal.receiveShadow = true;
        crystal.userData = {
            type: 'crystal',
            collected: false,
            index: idx
        };
        
        window.scene.add(crystal);
    });
    
    console.log(`✅ Placed ${crystalPositions.length} crystals`);
}

// ==========================================
// ENEMIES - Combat encounters
// ==========================================
function placeEnemies() {
    console.log('👹 Placing enemies...');
    
    const enemyData = [
        { x: 20, z: 20, type: 'Goblin', health: 20, xp: 50 },
        { x: -20, z: 20, type: 'Orc', health: 35, xp: 75 },
        { x: 20, z: -20, type: 'Skeleton', health: 25, xp: 60 },
        { x: -20, z: -20, type: 'Troll', health: 50, xp: 100 },
        { x: 0, z: 25, type: 'Spider', health: 15, xp: 40 }
    ];
    
    enemyData.forEach((enemy, idx) => {
        const geometry = new THREE.BoxGeometry(1, 2, 1);
        const material = new THREE.MeshStandardMaterial({
            color: 0xff4444,
            metalness: 0.3,
            roughness: 0.7
        });
        
        const enemyMesh = new THREE.Mesh(geometry, material);
        enemyMesh.position.set(enemy.x, 1, enemy.z);
        enemyMesh.castShadow = true;
        enemyMesh.receiveShadow = true;
        enemyMesh.userData = {
            type: 'enemy',
            name: enemy.type,
            health: enemy.health,
            maxHealth: enemy.health,
            xpReward: enemy.xp,
            index: idx,
            lastAggro: Date.now()
        };
        
        window.scene.add(enemyMesh);
    });
    
    console.log(`✅ Placed ${enemyData.length} enemies`);
}

// ==========================================
// CHESTS - Treasure & Gold
// ==========================================
function placeChests() {
    console.log('💰 Placing chests...');
    
    const chestPositions = [
        { x: 30, z: 0, gold: 25 },
        { x: -30, z: 0, gold: 25 },
        { x: 0, z: 30, gold: 35 },
        { x: 0, z: -30, gold: 30 }
    ];
    
    chestPositions.forEach((pos, idx) => {
        // Chest body
        const geometry = new THREE.BoxGeometry(1, 1, 1.5);
        const material = new THREE.MeshStandardMaterial({
            color: 0x8b6914,
            metalness: 0.6,
            roughness: 0.4
        });
        
        const chest = new THREE.Mesh(geometry, material);
        chest.position.set(pos.x, 0.5, pos.z);
        chest.castShadow = true;
        chest.receiveShadow = true;
        chest.userData = {
            type: 'chest',
            opened: false,
            gold: pos.gold,
            index: idx
        };
        
        // Chest lid (half cylinder)
        const lidGeometry = new THREE.CylinderGeometry(0.75, 0.75, 0.3, 16, 1, false);
        const lid = new THREE.Mesh(lidGeometry, material);
        lid.position.set(0, 0.65, 0);
        lid.rotation.z = Math.PI / 2;
        chest.add(lid);
        
        window.scene.add(chest);
    });
    
    console.log(`✅ Placed ${chestPositions.length} chests`);
}

// ==========================================
// PARTICLES - Floating text & effects
// ==========================================
const floatingTexts = [];

function initParticles() {
    console.log('✨ Initializing particle system...');
    window.floatingTexts = floatingTexts;
}

function showFloatingText(text, color = '#00ff00', duration = 2) {
    if (!window.scene || !window.camera) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    const geometry = new THREE.PlaneGeometry(3, 1.5);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(0, 3, 0);
    window.scene.add(mesh);
    
    const startTime = Date.now();
    const floatingText = {
        mesh,
        startTime,
        duration: duration * 1000,
        remove: false
    };
    
    floatingTexts.push(floatingText);
    
    // Auto-remove after duration
    setTimeout(() => {
        floatingText.remove = true;
        window.scene.remove(mesh);
    }, duration * 1000);
}

function updateFloatingTexts(delta) {
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i];
        if (ft.remove) {
            floatingTexts.splice(i, 1);
            continue;
        }
        
        ft.mesh.position.y += delta * 2; // Rise
        const elapsed = Date.now() - ft.startTime;
        ft.mesh.material.opacity = 1 - (elapsed / ft.duration);
    }
}

// ==========================================
// INTERACTIONS - Check for pickups/combat
// ==========================================
function checkInteractions() {
    if (!window.scene || !window.playerContainer) return;
    
    const playerPos = window.playerContainer.position;
    const interactionRange = 3;
    
    // Check crystals
    window.scene.children.forEach(obj => {
        if (obj.userData.type === 'crystal' && !obj.userData.collected) {
            const dist = playerPos.distanceTo(obj.position);
            if (dist < interactionRange) {
                collectCrystal(obj);
            }
        }
    });
    
    // Check enemies
    window.scene.children.forEach(obj => {
        if (obj.userData.type === 'enemy') {
            const dist = playerPos.distanceTo(obj.position);
            if (dist < interactionRange * 1.5) {
                startCombat(obj);
            }
        }
    });
    
    // Check chests
    window.scene.children.forEach(obj => {
        if (obj.userData.type === 'chest' && !obj.userData.opened) {
            const dist = playerPos.distanceTo(obj.position);
            if (dist < interactionRange) {
                openChest(obj);
            }
        }
    });
}

function collectCrystal(crystal) {
    console.log('✨ Crystal collected!');
    crystal.userData.collected = true;
    crystal.visible = false;
    addXP(100);
    showFloatingText('+100 XP', '#00ffff', 1.5);
}

function openChest(chest) {
    console.log('💰 Chest opened!');
    chest.userData.opened = true;
    chest.visible = false;
    
    const goldAmount = chest.userData.gold;
    window.GameState.player.gold += goldAmount;
    
    showFloatingText(`+${goldAmount} Gold`, '#ffd700', 2);
    updateHUD();
}

function startCombat(enemyMesh) {
    if (window.GameState.inCombat) return;
    
    window.GameState.inCombat = true;
    window.GameState.currentEnemy = enemyMesh;
    
    const question = generateCombatQuestion(window.GameState.player.level);
    window.GameState.currentQuestion = question;
    
    showCombatModal(enemyMesh, question);
}

function generateCombatQuestion(level) {
    const types = ['arithmetic', 'word', 'logic'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let a, b, op, question, answer;
    
    if (type === 'arithmetic') {
        a = Math.floor(Math.random() * (level * 5)) + 1;
        b = Math.floor(Math.random() * (level * 5)) + 1;
        op = ['+', '-', '*'][Math.floor(Math.random() * 3)];
        
        if (op === '+') answer = a + b;
        else if (op === '-') answer = a - b;
        else answer = a * b;
        
        question = `${a} ${op} ${b} = ?`;
    } else if (type === 'word') {
        const problems = [
            { q: 'If you have 5 apples and pick 3 more, how many do you have?', a: 8 },
            { q: 'A book costs $12, you have $20. How much change?', a: 8 },
            { q: 'If a recipe needs 2 eggs and you make 3 batches, how many eggs?', a: 6 }
        ];
        const p = problems[Math.floor(Math.random() * problems.length)];
        question = p.q;
        answer = p.a;
    } else {
        question = 'What comes next? 2, 4, 6, 8, ?';
        answer = 10;
    }
    
    // Generate wrong answers
    const choices = [answer];
    while (choices.length < 3) {
        const wrong = answer + Math.floor((Math.random() - 0.5) * 10) + 1;
        if (!choices.includes(wrong)) choices.push(wrong);
    }
    
    // Shuffle
    for (let i = choices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [choices[i], choices[j]] = [choices[j], choices[i]];
    }
    
    return { question, choices, answer };
}

function showCombatModal(enemyMesh, q) {
    const modalContent = document.querySelector('#combat-modal .modal-content') || createCombatModal();
    
    const enemyName = enemyMesh.userData.name;
    const enemyHealth = enemyMesh.userData.health;
    
    document.getElementById('combat-question').innerHTML = `
        <h2>${enemyName} attacks!</h2>
        <p>${q.question}</p>
    `;
    
    const choicesContainer = document.getElementById('combat-choices') || document.createElement('div');
    choicesContainer.id = 'combat-choices';
    choicesContainer.innerHTML = '';
    
    q.choices.forEach((choice, idx) => {
        const btn = document.createElement('button');
        btn.textContent = choice;
        btn.style.padding = '10px 20px';
        btn.style.margin = '5px';
        btn.style.cursor = 'pointer';
        btn.onclick = () => {
            if (choice === q.answer) {
                enemyMesh.userData.health -= 10;
                showFloatingText('Hit!', '#00ff00', 1);
                if (enemyMesh.userData.health <= 0) {
                    defeatEnemy(enemyMesh);
                }
            } else {
                window.GameState.player.health -= 5;
                showFloatingText('Miss!', '#ff0000', 1);
                updateHUD();
            }
            window.GameState.inCombat = false;
            document.getElementById('combat-modal').style.display = 'none';
        };
        choicesContainer.appendChild(btn);
    });
    
    const parent = document.getElementById('combat-modal');
    if (parent && !parent.querySelector('#combat-choices')) {
        parent.appendChild(choicesContainer);
    }
    
    document.getElementById('combat-modal').style.display = 'block';
}

function createCombatModal() {
    const modal = document.createElement('div');
    modal.id = 'combat-modal';
    modal.style.cssText = `
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
    `;
    modal.innerHTML = `
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                    background: rgba(20, 10, 5, 0.95); border: 2px solid #8b6914; 
                    padding: 30px; border-radius: 12px; text-align: center;">
            <div id="combat-question"></div>
            <div id="combat-choices"></div>
        </div>
    `;
    document.body.appendChild(modal);
    return modal;
}

function defeatEnemy(enemyMesh) {
    console.log(`✅ Defeated ${enemyMesh.userData.name}!`);
    
    const xp = enemyMesh.userData.xpReward;
    addXP(xp);
    
    window.scene.remove(enemyMesh);
    showFloatingText(`+${xp} XP`, '#ffff00', 2);
}

function addXP(amount) {
    window.GameState.player.xp += amount;
    
    if (window.GameState.player.xp >= window.GameState.player.xpToNext) {
        window.GameState.player.level++;
        window.GameState.player.xp -= window.GameState.player.xpToNext;
        window.GameState.player.xpToNext = Math.floor(window.GameState.player.xpToNext * 1.5);
        window.GameState.player.maxHealth += 10;
        window.GameState.player.health = window.GameState.player.maxHealth;
        window.GameState.player.skillPoints++;
        showFloatingText('LEVEL UP!', '#ffd700', 2);
    }
    
    updateHUD();
}

// ==========================================
// HUD UPDATE
// ==========================================
function updateHUD() {
    const player = window.GameState.player;
    
    // Update health
    const healthPercent = (player.health / player.maxHealth) * 100;
    const healthBar = document.querySelector('.health-fill');
    if (healthBar) healthBar.style.width = healthPercent + '%';
    document.getElementById('health-value').textContent = `${player.health}/${player.maxHealth}`;
    
    // Update mana
    const manaPercent = (player.mana / player.maxMana) * 100;
    const manaBar = document.querySelector('.mana-fill');
    if (manaBar) manaBar.style.width = manaPercent + '%';
    document.getElementById('mana-value').textContent = `${player.mana}/${player.maxMana}`;
    
    // Update XP
    const xpPercent = (player.xp / player.xpToNext) * 100;
    const xpBar = document.querySelector('.xp-fill');
    if (xpBar) xpBar.style.width = xpPercent + '%';
    document.getElementById('xp-value').textContent = `${player.xp}/${player.xpToNext}`;
    
    // Update level & gold
    document.getElementById('level-value').textContent = player.level;
    document.getElementById('gold-value').textContent = player.gold;
    document.getElementById('class-value').textContent = player.class;
}

// Export functions to window
window.placeCrystals = placeCrystals;
window.placeEnemies = placeEnemies;
window.placeChests = placeChests;
window.initParticles = initParticles;
window.checkInteractions = checkInteractions;
window.showFloatingText = showFloatingText;
window.updateFloatingTexts = updateFloatingTexts;
window.updateHUD = updateHUD;
window.addXP = addXP;
window.startCombat = startCombat;
window.defeatEnemy = defeatEnemy;
