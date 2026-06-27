// characters.js - Character model, animation, and weapon loading

const characterModels = {
    barbarian: 'models/characters/warrior/Barbarian.glb',
    mage: 'models/characters/mage/Mage.glb',
    rogue: 'models/characters/rogue/Rogue.glb',
    knight: 'models/characters/knight/Knight.glb',
    ranger: 'models/characters/ranger/Ranger.glb'
};

const weaponModels = {
    barbarian: 'models/characters/warrior/weapons/axe_2handed.gltf',
    mage: 'models/characters/mage/weapons/staff.gltf',
    rogue: 'models/characters/rogue/weapons/dagger.gltf',
    knight: 'models/characters/knight/weapons/sword_1handed.gltf',
    ranger: 'models/characters/ranger/weapons/bow.gltf'
};

const animationPacks = {
    movement: 'models/animations/Rig_Medium_MovementBasic.glb',
    combat: 'models/animations/Rig_Medium_CombatMelee.glb',
    general: 'models/animations/Rig_Medium_General.glb'
};

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
        
        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                if (child.material) {
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
        
        window.playerContainer.add(model);
        window.GameState.player.model = model;

        loadAnimationsForCharacter(model, className);
        loadWeaponForCharacter(model, className);
        
        console.log(`🎭 Character ${className} ready!`);
    }, undefined, (error) => {
        console.error(`❌ Error loading character model:`, error);
        console.log(`🔄 Using fallback cube character for ${className}`);
        createFallbackCharacter(className);
    });
}

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
    cube.position.y = 1;
    
    window.playerContainer.add(cube);
    window.GameState.player.model = cube;
    
    console.log(`✅ Fallback character created for ${className}`);
}

function loadAnimationsForCharacter(model, className) {
    console.log(`🎬 Loading animations for ${className}...`);
    
    const mixer = new THREE.AnimationMixer(model);
    window.GameState.mixer = mixer;
    window.GameState.animationActions = {};
    
    let packsLoaded = 0;
    const totalPacks = Object.keys(animationPacks).length;
    console.log(`📁 Loading ${totalPacks} animation packs`);

    for (const [packName, packPath] of Object.entries(animationPacks)) {
        console.log(`📥 Loading animation pack: ${packName} from ${packPath}`);
        window.gltfLoader.load(packPath, (gltf) => {
            console.log(`📦 Loaded ${packName} pack (${gltf.animations.length} animations)`);
            
            gltf.animations.forEach((clip) => {
                const action = mixer.clipAction(clip);
                window.GameState.animationActions[clip.name] = action;
                console.log(`  ➕ ${clip.name}`);
            });

            packsLoaded++;
            
            if (packsLoaded === totalPacks) {
                console.log(`✅ All animation packs loaded! Total actions: ${Object.keys(window.GameState.animationActions).length}`);
                setupAnimations(className);
            }
        }, undefined, (error) => {
            console.error(`❌ Error loading ${packName} pack:`, error);
        });
    }
}

function setupAnimations(className) {
    console.log(`🎭 Setting up animations for class: ${className}`);
    
    let idleFound = false;
    
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
    
    if (!idleFound) {
        for (let key in window.GameState.animationActions) {
            if (key.toLowerCase().includes('idle')) {
                window.GameState.idleAction = window.GameState.animationActions[key];
                console.log(`⚠️ Using fallback idle: ${key}`);
                break;
            }
        }
    }
    
    for (let key in window.GameState.animationActions) {
        if (key.toLowerCase().includes('walk')) {
            window.GameState.walkAction = window.GameState.animationActions[key];
            console.log(`✅ Found walk: ${key}`);
            break;
        }
    }
    
    for (let key in window.GameState.animationActions) {
        if (key.toLowerCase().includes('attack') || key.toLowerCase().includes('slash')) {
            window.GameState.attackAction = window.GameState.animationActions[key];
            console.log(`✅ Found attack: ${key}`);
            break;
        }
    }
    
    if (window.GameState.idleAction) {
        window.GameState.idleAction.reset();
        window.GameState.idleAction.setEffectiveWeight(1);
        window.GameState.idleAction.setLoop(THREE.LoopRepeat, Infinity);
        window.GameState.idleAction.play();
        console.log(`▶️ Playing idle animation`);
    }
}

function loadWeaponForCharacter(model, className) {
    console.log(`⚔️ Loading weapon for ${className}...`);
    console.log(`📁 Weapon path: ${weaponModels[className]}`);
    
    const weaponPath = weaponModels[className];
    if (!weaponPath) {
        console.warn(`⚠️ No weapon defined for ${className}`);
        return;
    }

    let rightHand = null;
    const boneNames = [];
    
    model.traverse((child) => {
        if (child.isBone) {
            boneNames.push(child.name);
            const lowerName = child.name.toLowerCase();
            // Match: handr, hand_r, hand.r
            if (lowerName.includes('hand') && lowerName.includes('r')) {
                rightHand = child;
                console.log(`🤚 Found hand bone: ${child.name}`);
            }
        }
    });

    if (!rightHand) {
        console.warn(`⚠️ Could not find right hand bone for ${className}`);
        console.log(`📋 Available bones:`, boneNames);
        return;
    }

    console.log(`🤚 Using hand bone: ${rightHand.name}`);

    window.gltfLoader.load(weaponPath, (gltf) => {
        const weapon = gltf.scene;
        
        weapon.position.set(0, 0, 0);
        weapon.rotation.set(0, 0, 0);
        weapon.scale.set(1, 1, 1);
        
        weapon.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                
                if (child.material) {
                    const materials = Array.isArray(child.material) ? child.material : [child.material];
                    materials.forEach(material => {
                        if (material.map) {
                            material.map.anisotropy = 16;
                        }
                    });
                }
            }
        });
        
        rightHand.add(weapon);
        
        const weaponOffsets = {
            barbarian: { pos: [0, 0, 0.15], rot: [Math.PI/2, 0, Math.PI/2], scale: 1.0 },
            mage: { pos: [0, 0, 0.2], rot: [Math.PI/2, 0, 0], scale: 1.0 },
            rogue: { pos: [0, 0, 0.1], rot: [0, Math.PI/2, Math.PI/2], scale: 1.0 },
            knight: { pos: [0, 0, 0.15], rot: [Math.PI/2, 0, Math.PI/2], scale: 1.0 },
            ranger: { pos: [0, 0, 0.15], rot: [Math.PI/2, 0, 0], scale: 1.0 }
        };
        
        const offset = weaponOffsets[className] || { pos: [0, 0, 0], rot: [0, 0, 0], scale: 1.0 };
        
        weapon.position.set(...offset.pos);
        weapon.rotation.set(...offset.rot);
        weapon.scale.setScalar(offset.scale);
        
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
        console.log(`⚠️ Continuing without weapon for ${className}`);
    });
}

function updateCharacterAnimation(isMoving) {
    if (!window.GameState.idleAction || !window.GameState.walkAction) return;
    
    if (isMoving) {
        if (!window.GameState.walkAction.isRunning()) {
            window.GameState.idleAction.stop();
            window.GameState.walkAction.reset();
            window.GameState.walkAction.setEffectiveWeight(1);
            window.GameState.walkAction.setLoop(THREE.LoopRepeat, Infinity);
            window.GameState.walkAction.play();
        }
    } else {
        if (window.GameState.walkAction.isRunning()) {
            window.GameState.walkAction.stop();
            window.GameState.idleAction.reset();
            window.GameState.idleAction.setEffectiveWeight(1);
            window.GameState.idleAction.setLoop(THREE.LoopRepeat, Infinity);
            window.GameState.idleAction.play();
        }
    }
}

function playAttackAnimation() {
    if (!window.GameState.attackAction) return;
    
    if (window.GameState.idleAction) window.GameState.idleAction.stop();
    if (window.GameState.walkAction) window.GameState.walkAction.stop();
    
    window.GameState.attackAction.reset();
    window.GameState.attackAction.setLoop(THREE.LoopOnce, 1);
    window.GameState.attackAction.clampWhenFinished = true;
    window.GameState.attackAction.play();
    
    setTimeout(() => {
        if (window.GameState.idleAction) {
            window.GameState.idleAction.reset();
            window.GameState.idleAction.setEffectiveWeight(1);
            window.GameState.idleAction.setLoop(THREE.LoopRepeat, Infinity);
            window.GameState.idleAction.play();
        }
    }, 1000);
}

window.createCharacter = createCharacter;
window.updateCharacterAnimation = updateCharacterAnimation;
window.playAttackAnimation = playAttackAnimation;
