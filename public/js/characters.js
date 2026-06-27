// characters.js - Character model, animation, and weapon loading

// Character model paths (KayKit Adventurers)
const characterModels = {
    barbarian: 'models/characters/warrior/Barbarian.glb',
    mage: 'models/characters/mage/Mage.glb',
    rogue: 'models/characters/rogue/Rogue.glb',
    knight: 'models/characters/knight/Knight.glb',
    ranger: 'models/characters/ranger/Ranger.glb'
};

// Weapon model paths
const weaponModels = {
    barbarian: 'models/characters/warrior/weapons/axe_2handed.gltf',
    mage: 'models/characters/mage/weapons/staff.gltf',
    rogue: 'models/characters/rogue/weapons/dagger.gltf',
    knight: 'models/characters/knight/weapons/sword_1handed.gltf',
    ranger: 'models/characters/ranger/weapons/bow.gltf'
};

// Animation pack paths (using Medium rig for all character types)
const animationPacks = {
    movement: 'models/animations/Rig_Medium_MovementBasic.glb',
    combat: 'models/animations/Rig_Medium_CombatMelee.glb',
    general: 'models/animations/Rig_Medium_General.glb'
};

// Create character with model, animations, and weapon
function createCharacter(className) {
    console.log(`🎮 Creating character: ${className}`);
    console.log(`📁 Model path: ${characterModels[className]}`);
    console.log(`📁 Weapon path: ${weaponModels[className]}`);
    
    const modelPath = characterModels[className];
    if (!modelPath) {
        console.error(`❌ No model found for class: ${className}`);
        return;
    }

    window.gltfLoader.load(modelPath, (gltf) => {
        console.log(`✅ Loaded model for ${className}`);
        const model = gltf.scene;
        
        // Configure model
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                // Ensure materials are properly configured
                if (child.material) {
                    // Handle array of materials
                    const materials = Array.isArray(child.material) ? child.material : [child.material];
                    materials.forEach(material => {
                        if (material.map) {
                            material.map.anisotropy = 16;
                        }
                    });
                }
            }
        });

        model.scale.set(1, 1, 1);
        
        // Add to player container
        window.playerContainer.add(model);
        window.GameState.player.model = model;

        // Load animations
        loadAnimationsForCharacter(model, className);
        
        // Load weapon
        loadWeaponForCharacter(model, className);
        
        console.log(`🎭 Character ${className} ready!`);
    }, undefined, (error) => {
        console.error(`❌ Error loading character model:`, error);
        
        // Fallback: Create a simple colored cube as the character
        console.log(`🔄 Using fallback cube character for ${className}`);
        createFallbackCharacter(className);
    });
}

// Create a simple cube character as fallback
function createFallbackCharacter(className) {
    const colors = {
        barbarian: 0xff4444,
        mage: 0x4444ff,
        rogue: 0x44ff44,
        knight: 0xffaa00,
        ranger: 0xff44ff
    };
    
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshStandardMaterial({ 
        color: colors[className] || 0xffffff,
        roughness: 0.7,
        metalness: 0.3
    });
    
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.position.y = 1; // Lift cube off ground
    
    window.playerContainer.add(cube);
    window.GameState.player.model = cube;
    
    console.log(`✅ Fallback character created for ${className}`);
}

// Load all animation packs for character
function loadAnimationsForCharacter(model, className) {
    console.log(`🎬 Loading animations for ${className}...`);
    
    const mixer = new THREE.AnimationMixer(model);
    window.GameState.mixer = mixer;
    window.GameState.animationActions = {};
    
    let packsLoaded = 0;
    const totalPacks = Object.keys(animationPacks).length;
    console.log(`📁 Loading ${totalPacks} animation packs`);

    // Load each animation pack
    for (const [packName, packPath] of Object.entries(animationPacks)) {
        console.log(`📥 Loading animation pack: ${packName} from ${packPath}`);
        window.gltfLoader.load(packPath, (gltf) => {
            console.log(`📦 Loaded ${packName} pack (${gltf.animations.length} animations)`);
            
            // Add all animations from this pack
            gltf.animations.forEach((clip) => {
                const action = mixer.clipAction(clip);
                window.GameState.animationActions[clip.name] = action;
                console.log(`  ➕ ${clip.name}`);
            });

            packsLoaded++;
            
            // When all packs loaded, setup default animations
            if (packsLoaded === totalPacks) {
                console.log(`✅ All animation packs loaded! Total actions: ${Object.keys(window.GameState.animationActions).length}`);
                setupAnimations(className);
            }
        }, undefined, (error) => {
            console.error(`❌ Error loading ${packName} pack:`, error);
        });
    }
}

// Setup idle and walk animations based on character class
function setupAnimations(className) {
    console.log(`🎭 Setting up animations for class: ${className}`);
    
    // Find weapon-specific idle animation
    let idleFound = false;
    
    // Barbarian: Use 2-handed melee idle
    if (className === 'barbarian') {
        for (let key in window.GameState.animationActions) {
            if (key.toLowerCase().includes('melee_2h_idle')) {
                window.GameState.idleAction = window.GameState.animationActions[key];
                idleFound = true;
                console.log(`✅ Found barbarian idle: ${key}`);
                break;
            }
        }
    }
    // Knight: Use blocking/defensive idle
    else if (className === 'knight') {
        for (let key in window.GameState.animationActions) {
            if (key.toLowerCase().includes('blocking')) {
                window.GameState.idleAction = window.GameState.animationActions[key];
                idleFound = true;
                console.log(`✅ Found knight idle: ${key}`);
                break;
            }
        }
    }
    // Mage: Use magic casting idle
    else if (className === 'mage') {
        for (let key in window.GameState.animationActions) {
            if (key.toLowerCase().includes('casting')) {
                window.GameState.idleAction = window.GameState.animationActions[key];
                idleFound = true;
                console.log(`✅ Found mage idle: ${key}`);
                break;
            }
        }
    }
    // Rogue: Use dagger idle
    else if (className === 'rogue') {
        for (let key in window.GameState.animationActions) {
            if (key.toLowerCase().includes('1h') && key.toLowerCase().includes('idle')) {
                window.GameState.idleAction = window.GameState.animationActions[key];
                idleFound = true;
                console.log(`✅ Found rogue idle: ${key}`);
                break;
            }
        }
    }
    // Ranger: Use bow idle
    else if (className === 'ranger') {
        for (let key in window.GameState.animationActions) {
            if (key.toLowerCase().includes('ranged') && key.toLowerCase().includes('idle')) {
                window.GameState.idleAction = window.GameState.animationActions[key];
                idleFound = true;
                console.log(`✅ Found ranger idle: ${key}`);
                break;
            }
        }
    }
    
    // Fallback to generic idle if class-specific not found
    if (!idleFound) {
        for (let key in window.GameState.animationActions) {
            if (key.toLowerCase().includes('idle')) {
                window.GameState.idleAction = window.GameState.animationActions[key];
                console.log(`⚠️ Using fallback idle: ${key}`);
                break;
            }
        }
    }
    
    // Find walk animation
    for (let key in window.GameState.animationActions) {
        if (key.toLowerCase().includes('walk')) {
            window.GameState.walkAction = window.GameState.animationActions[key];
            console.log(`✅ Found walk: ${key}`);
            break;
        }
    }
    
    // Find attack animation
    for (let key in window.GameState.animationActions) {
        if (key.toLowerCase().includes('attack') || key.toLowerCase().includes('slash')) {
            window.GameState.attackAction = window.GameState.animationActions[key];
            console.log(`✅ Found attack: ${key}`);
            break;
        }
    }
    
    // Start with idle animation
    if (window.GameState.idleAction) {
        window.GameState.idleAction.reset();
        window.GameState.idleAction.setEffectiveWeight(1);
        window.GameState.idleAction.setLoop(THREE.LoopRepeat, Infinity);
        window.GameState.idleAction.play();
        console.log(`▶️ Playing idle animation`);
    }
}

// Load weapon and attach to character's hand
function loadWeaponForCharacter(model, className) {
    console.log(`⚔️ Loading weapon for ${className}...`);
    console.log(`📁 Weapon path: ${weaponModels[className]}`);
    
    const weaponPath = weaponModels[className];
    if (!weaponPath) {
        console.warn(`⚠️ No weapon defined for ${className}`);
        return;
    }

    // Find the right hand bone
    let rightHand = null;
    const boneNames = [];
    
    model.traverse((child) => {
        if (child.isBone) {
            boneNames.push(child.name);
            // Check for various right hand bone naming conventions
            const lowerName = child.name.toLowerCase();
            // Look for: handr, hand_r, hand.r, right hand, etc.
            if (lowerName.includes('hand') && (
                lowerName.includes('r') || 
                lowerName.includes('right')
            )) {
                rightHand = child;
                console.log(`🤚 Found potential hand bone: ${child.name}`);
            }
        }
    });

    if (!rightHand) {
        console.error(`❌ Could not find right hand bone for ${className}`);
        console.log(`📋 Available bones:`, boneNames);
        console.log(`⚠️ Skipping weapon attachment`);
        return;
    }

    console.log(`🤚 Using hand bone: ${rightHand.name}`);

    // Load weapon model
    window.gltfLoader.load(weaponPath, (gltf) => {
        const weapon = gltf.scene;
        
        // CRITICAL: Reset all transforms before attachment
        weapon.position.set(0, 0, 0);
        weapon.rotation.set(0, 0, 0);
        weapon.scale.set(1, 1, 1);
        
        // Configure weapon materials
        weapon.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                // Ensure materials are properly configured
                if (child.material) {
                    // Handle array of materials
                    const materials = Array.isArray(child.material) ? child.material : [child.material];
                    materials.forEach(material => {
                        if (material.map) {
                            material.map.anisotropy = 16;
                        }
                    });
                }
            }
        });
        
        // Attach to hand bone FIRST
        rightHand.add(weapon);
        
        // THEN apply class-specific offsets (KayKit pivot adjustments)
        const weaponOffsets = {
            barbarian: { 
                pos: [0, 0, 0.15], 
                rot: [Math.PI/2, 0, Math.PI/2], 
                scale: 1.0 
            },
            mage: { 
                pos: [0, 0, 0.2], 
                rot: [Math.PI/2, 0, 0], 
                scale: 1.0 
            },
            rogue: { 
                pos: [0, 0, 0.1], 
                rot: [0, Math.PI/2, Math.PI/2], 
                scale: 1.0 
            },
            knight: { 
                pos: [0, 0, 0.15], 
                rot: [Math.PI/2, 0, Math.PI/2], 
                scale: 1.0 
            },
            ranger: { 
                pos: [0, 0, 0.15], 
                rot: [Math.PI/2, 0, 0], 
                scale: 1.0 
            }
        };
        
        const offset = weaponOffsets[className] || { pos: [0, 0, 0], rot: [0, 0, 0], scale: 1.0 };
        
        weapon.position.set(...offset.pos);
        weapon.rotation.set(...offset.rot);
        weapon.scale.setScalar(offset.scale);
        
        // Enable shadows
        weapon.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        
        window.GameState.weapon = weapon;
        console.log(`✅ Weapon attached for ${className}`);
    }, undefined, (error) => {
        console.error(`❌ Error loading weapon:`, error);
        // Try to load a fallback weapon or continue without weapon
        console.log(`⚠️ Continuing without weapon for ${className}`);
    });
}

// Update character animation based on movement
function updateCharacterAnimation(isMoving) {
    if (!window.GameState.idleAction || !window.GameState.walkAction) return;
    
    if (isMoving) {
        // Switch to walk
        if (!window.GameState.walkAction.isRunning()) {
            window.GameState.idleAction.stop();
            window.GameState.walkAction.reset();
            window.GameState.walkAction.setEffectiveWeight(1);
            window.GameState.walkAction.setLoop(THREE.LoopRepeat, Infinity);
            window.GameState.walkAction.play();
        }
    } else {
        // Switch to idle
        if (window.GameState.walkAction.isRunning()) {
            window.GameState.walkAction.stop();
            window.GameState.idleAction.reset();
            window.GameState.idleAction.setEffectiveWeight(1);
            window.GameState.idleAction.setLoop(THREE.LoopRepeat, Infinity);
            window.GameState.idleAction.play();
        }
    }
}

// Play attack animation
function playAttackAnimation() {
    if (!window.GameState.attackAction) return;
    
    // Stop current animations
    if (window.GameState.idleAction) window.GameState.idleAction.stop();
    if (window.GameState.walkAction) window.GameState.walkAction.stop();
    
    // Play attack (once)
    window.GameState.attackAction.reset();
    window.GameState.attackAction.setLoop(THREE.LoopOnce, 1);
    window.GameState.attackAction.clampWhenFinished = true;
    window.GameState.attackAction.play();
    
    // Return to idle after attack finishes
    setTimeout(() => {
        if (window.GameState.idleAction) {
            window.GameState.idleAction.reset();
            window.GameState.idleAction.setEffectiveWeight(1);
            window.GameState.idleAction.setLoop(THREE.LoopRepeat, Infinity);
            window.GameState.idleAction.play();
        }
    }, 1000);
}

// Export functions to window for global access
window.createCharacter = createCharacter;
window.updateCharacterAnimation = updateCharacterAnimation;
window.playAttackAnimation = playAttackAnimation;
