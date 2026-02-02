// combat.js - Combat system with educational questions

// Enemy types with different difficulties
const enemyTypes = [
    { name: 'Goblin Scholar', health: 30, xpReward: 15, color: 0x00ff00 },
    { name: 'Orc Librarian', health: 50, xpReward: 25, color: 0xff6600 },
    { name: 'Troll Professor', health: 80, xpReward: 40, color: 0x0066ff },
    { name: 'Dragon Dean', health: 120, xpReward: 60, color: 0xff0000 }
];

// Start combat encounter
function startCombat() {
    if (window.GameState.inCombat) return;
    
    console.log('⚔️ Starting combat!');
    window.GameState.inCombat = true;
    
    // Select random enemy based on player level
    const levelRange = Math.floor(window.GameState.player.level / 3);
    const enemyIndex = Math.min(levelRange, enemyTypes.length - 1);
    const enemyType = enemyTypes[enemyIndex];
    
    // Create enemy
    window.GameState.currentEnemy = {
        ...enemyType,
        currentHealth: enemyType.health
    };
    
    // Get question based on player's grade and current room
    const subject = window.getCurrentRoomSubject(
        window.GameState.player.x, 
        window.GameState.player.z
    );
    
    const question = window.getRandomQuestion(window.GameState.player.grade, subject);
    
    if (!question) {
        console.error('❌ No question found for combat!');
        endCombat(false);
        return;
    }
    
    window.GameState.currentQuestion = question;
    
    // Show combat modal
    showCombatModal();
}

// Show combat modal UI
function showCombatModal() {
    const modal = document.getElementById('combat-modal');
    const enemyName = document.getElementById('enemy-name');
    const enemyHealthBar = document.getElementById('enemy-health');
    const questionText = document.getElementById('question-text');
    const answerInput = document.getElementById('answer-input');
    const hintText = document.getElementById('hint-text');
    
    enemyName.textContent = window.GameState.currentEnemy.name;
    enemyHealthBar.style.width = '100%';
    questionText.textContent = window.GameState.currentQuestion.q;
    answerInput.value = '';
    hintText.textContent = '';
    
    modal.style.display = 'flex';
    answerInput.focus();
}

// Submit combat answer
function submitAnswer() {
    const answerInput = document.getElementById('answer-input');
    const userAnswer = answerInput.value;
    
    if (!userAnswer.trim()) {
        showHint('Please enter an answer!');
        return;
    }
    
    const question = window.GameState.currentQuestion;
    const isCorrect = window.checkAnswer(
        userAnswer, 
        question.a, 
        question.acceptMultiple
    );
    
    if (isCorrect) {
        // Player attacks
        handleCorrectAnswer();
    } else {
        // Enemy attacks
        handleWrongAnswer();
    }
}

// Handle correct answer
function handleCorrectAnswer() {
    const damage = 20 + window.GameState.player.level * 2;
    window.GameState.currentEnemy.currentHealth -= damage;
    
    // Show damage
    showFloatingText(`-${damage} HP`, 'damage');
    
    // Play attack animation
    if (window.playAttackAnimation) {
        window.playAttackAnimation();
    }
    
    // Update enemy health bar
    const healthPercent = Math.max(0, 
        (window.GameState.currentEnemy.currentHealth / window.GameState.currentEnemy.health) * 100
    );
    document.getElementById('enemy-health').style.width = healthPercent + '%';
    
    // Check if enemy defeated
    if (window.GameState.currentEnemy.currentHealth <= 0) {
        setTimeout(() => {
            victoryInCombat();
        }, 500);
    } else {
        // Enemy still alive, get new question
        setTimeout(() => {
            const subject = window.getCurrentRoomSubject(
                window.GameState.player.x, 
                window.GameState.player.z
            );
            const newQuestion = window.getRandomQuestion(
                window.GameState.player.grade, 
                subject
            );
            
            if (newQuestion) {
                window.GameState.currentQuestion = newQuestion;
                document.getElementById('question-text').textContent = newQuestion.q;
                document.getElementById('answer-input').value = '';
                document.getElementById('hint-text').textContent = '';
            }
        }, 800);
    }
}

// Handle wrong answer
function handleWrongAnswer() {
    const damage = 10 + Math.floor(window.GameState.currentEnemy.health / 10);
    window.GameState.player.health -= damage;
    
    // Show damage to player
    showFloatingText(`-${damage} HP`, 'damage-player');
    
    // Update player health
    updateHealthBar();
    
    // Check if player defeated
    if (window.GameState.player.health <= 0) {
        window.GameState.player.health = 0;
        updateHealthBar();
        setTimeout(() => {
            defeatInCombat();
        }, 500);
    } else {
        // Show hint
        const hints = window.GameState.currentQuestion.hints;
        if (hints && hints.length > 0) {
            const randomHint = hints[Math.floor(Math.random() * hints.length)];
            showHint('Wrong! Hint: ' + randomHint);
        } else {
            showHint('Wrong answer! Try again!');
        }
        
        document.getElementById('answer-input').value = '';
    }
}

// Victory in combat
function victoryInCombat() {
    const xpGained = window.GameState.currentEnemy.xpReward;
    const goldGained = Math.floor(Math.random() * 20) + 10;
    
    window.GameState.player.xp += xpGained;
    window.GameState.player.gold += goldGained;
    
    showFloatingText(`+${xpGained} XP`, 'xp');
    showFloatingText(`+${goldGained} Gold`, 'gold');
    
    // Check for level up
    checkLevelUp();
    
    // Update UI
    if (window.updateHUD) {
        window.updateHUD();
    }
    
    endCombat(true);
}

// Defeat in combat
function defeatInCombat() {
    showFloatingText('Defeated!', 'defeat');
    
    // Respawn player at starting position
    setTimeout(() => {
        window.GameState.player.health = 100;
        window.GameState.player.x = 0;
        window.GameState.player.z = 0;
        
        if (window.playerContainer) {
            window.playerContainer.position.set(0, 0, 0);
        }
        
        updateHealthBar();
        endCombat(false);
    }, 2000);
}

// End combat
function endCombat(victory) {
    window.GameState.inCombat = false;
    window.GameState.currentEnemy = null;
    window.GameState.currentQuestion = null;
    
    document.getElementById('combat-modal').style.display = 'none';
    
    console.log(victory ? '✅ Victory!' : '❌ Defeat!');
}

// Show hint in combat UI
function showHint(message) {
    const hintText = document.getElementById('hint-text');
    hintText.textContent = message;
    hintText.style.color = message.includes('Wrong') ? '#ff4444' : '#44ff44';
}

// Update health bar
function updateHealthBar() {
    const healthBar = document.getElementById('health-bar');
    const healthText = document.getElementById('health-text');
    
    const healthPercent = Math.max(0, 
        (window.GameState.player.health / 100) * 100
    );
    
    healthBar.style.width = healthPercent + '%';
    healthText.textContent = `${Math.floor(window.GameState.player.health)}/100`;
}

// Check for level up
function checkLevelUp() {
    const xpNeeded = window.GameState.player.level * 100;
    
    if (window.GameState.player.xp >= xpNeeded) {
        window.GameState.player.level++;
        window.GameState.player.xp -= xpNeeded;
        
        // Restore health on level up
        window.GameState.player.health = 100;
        
        showFloatingText('LEVEL UP!', 'levelup');
        console.log(`🎉 Level up! Now level ${window.GameState.player.level}`);
    }
}

// Show floating text effect
function showFloatingText(text, type) {
    const container = document.getElementById('floating-text-container');
    const floatingText = document.createElement('div');
    floatingText.className = `floating-text ${type}`;
    floatingText.textContent = text;
    
    container.appendChild(floatingText);
    
    // Remove after animation
    setTimeout(() => {
        floatingText.remove();
    }, 2000);
}

// Check for nearby interactive objects
function checkInteractions() {
    if (window.GameState.inCombat) return;
    
    const playerPos = window.playerContainer.position;
    
    // Check all objects in scene
    window.scene.children.forEach((object) => {
        if (!object.userData.type) return;
        
        const distance = playerPos.distanceTo(object.position);
        
        // Interaction range
        if (distance < 2) {
            if (object.userData.type === 'crystal' && !object.userData.collected) {
                collectCrystal(object);
            } else if (object.userData.type === 'chest' && !object.userData.opened) {
                openChest(object);
            }
        }
    });
    
    // Random combat encounters (very rare - about once per minute of walking)
    if (Math.random() < 0.00001) {
        startCombat();
    }
}

// Collect knowledge crystal
function collectCrystal(crystal) {
    crystal.userData.collected = true;
    
    const xpGained = 25;
    window.GameState.player.xp += xpGained;
    
    showFloatingText(`+${xpGained} XP`, 'xp');
    
    // Remove crystal from scene
    window.scene.remove(crystal);
    
    if (window.updateHUD) {
        window.updateHUD();
    }
}

// Open treasure chest
function openChest(chest) {
    chest.userData.opened = true;
    
    const goldGained = Math.floor(Math.random() * 50) + 25;
    window.GameState.player.gold += goldGained;
    
    showFloatingText(`+${goldGained} Gold`, 'gold');
    
    // Change chest appearance
    chest.material.color.setHex(0x444444);
    
    if (window.updateHUD) {
        window.updateHUD();
    }
}

// Export functions to window for global access
window.startCombat = startCombat;
window.submitAnswer = submitAnswer;
window.checkInteractions = checkInteractions;
