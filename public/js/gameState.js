// Game State Management
const GameState = {
    player: {
        name: '', 
        class: 'barbarian', 
        level: 1, 
        grade: 1,
        xp: 0, 
        xpToNext: 100,
        health: 100, 
        maxHealth: 100,
        mana: 50, 
        maxMana: 50,
        gold: 0, 
        potions: 2, 
        scrolls: 1,
        skillPoints: 0, 
        skills: { health: 0, mana: 0, power: 0 },
        x: 0, 
        z: 0, 
        rotation: 0
    },
    selectedClass: null,
    selectedSpell: 0,
    inCombat: false,
    currentEnemy: null,
    currentQuestion: null,
    isPlaying: false,
    isMultiplayer: false,
    socket: null,
    otherPlayers: new Map(),
    lastMoveTime: 0,
    
    // Animation actions
    animationActions: {},
    walkAction: null,
    idleAction: null,
    attackAction: null,
    weapon: null
};

// Save/Load System
function saveGame() {
    if (!GameState.isPlaying) return;
    localStorage.setItem('wizardAcademy_save', JSON.stringify({
        player: GameState.player,
        timestamp: Date.now()
    }));
    console.log('💾 Game saved');
}

function loadGame() {
    const saved = localStorage.getItem('wizardAcademy_save');
    if (saved) {
        const data = JSON.parse(saved);
        Object.assign(GameState.player, data.player);
        console.log('📂 Game loaded');
        return true;
    }
    return false;
}

// Export to window for global access
window.GameState = GameState;
window.saveGame = saveGame;
window.loadGame = loadGame;
