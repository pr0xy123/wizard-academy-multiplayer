// dungeon.js - Dungeon world generation (rooms, corridors, tiles)

// Track placed floors to prevent Z-fighting
const placedFloors = new Set();
const tileSpacing = 4.1; // Increased spacing to prevent overlap

// Room themes with educational content
const roomThemes = [
    { name: 'Math Chamber', color: 0x3366ff, subject: 'math' },
    { name: 'Science Lab', color: 0x00ff66, subject: 'science' },
    { name: 'History Hall', color: 0xff9933, subject: 'history' },
    { name: 'Literature Library', color: 0xff3366, subject: 'literature' },
    { name: 'Geography Gallery', color: 0x66ffff, subject: 'geography' },
    { name: 'Art Atrium', color: 0xff66ff, subject: 'art' },
    { name: 'Music Conservatory', color: 0xffff33, subject: 'music' }
];

// Build the dungeon world
function buildWorld() {
    console.log('🏰 Building dungeon world...');
    
    // Create rooms
    const rooms = [
        { x: 0, z: 0, width: 7, depth: 7, theme: roomThemes[0] },
        { x: 10, z: 0, width: 6, depth: 6, theme: roomThemes[1] },
        { x: -10, z: 0, width: 6, depth: 6, theme: roomThemes[2] },
        { x: 0, z: 10, width: 6, depth: 6, theme: roomThemes[3] },
        { x: 0, z: -10, width: 6, depth: 6, theme: roomThemes[4] },
        { x: 10, z: 10, width: 5, depth: 5, theme: roomThemes[5] },
        { x: -10, z: -10, width: 5, depth: 5, theme: roomThemes[6] }
    ];

    // Place room floors and walls
    rooms.forEach((room, roomIndex) => {
        console.log(`📍 Building ${room.theme.name} at (${room.x}, ${room.z})`);
        
        // Floor tiles
        for (let x = 0; x < room.width; x++) {
            for (let z = 0; z < room.depth; z++) {
                const posX = room.x + (x - room.width / 2) * tileSpacing;
                const posZ = room.z + (z - room.depth / 2) * tileSpacing;
                
                // Check if this position already has a tile (use precise key)
                const key = `${posX.toFixed(2)},${posZ.toFixed(2)}`;
                if (placedFloors.has(key)) continue;
                
                placedFloors.add(key);
                loadDungeonTile('floor', posX, posZ, room.theme.color);
            }
        }
        
        // Walls around perimeter
        const wallPositions = [];
        
        // North and South walls
        for (let x = 0; x < room.width; x++) {
            const posX = room.x + (x - room.width / 2) * tileSpacing;
            wallPositions.push({ 
                x: posX, 
                z: room.z + (room.depth / 2) * tileSpacing, 
                rotation: 0 
            });
            wallPositions.push({ 
                x: posX, 
                z: room.z - (room.depth / 2) * tileSpacing, 
                rotation: Math.PI 
            });
        }
        
        // East and West walls
        for (let z = 0; z < room.depth; z++) {
            const posZ = room.z + (z - room.depth / 2) * tileSpacing;
            wallPositions.push({ 
                x: room.x + (room.width / 2) * tileSpacing, 
                z: posZ, 
                rotation: Math.PI / 2 
            });
            wallPositions.push({ 
                x: room.x - (room.width / 2) * tileSpacing, 
                z: posZ, 
                rotation: -Math.PI / 2 
            });
        }
        
        // Load wall tiles (skip some for doorways)
        wallPositions.forEach((pos, idx) => {
            // Leave gaps for doorways (every 5th wall segment)
            if (idx % 5 !== 2) {
                loadDungeonTile('wall', pos.x, pos.z, room.theme.color, pos.rotation);
            }
        });
    });

    // Build corridors connecting rooms
    buildCorridors(rooms);
    
    console.log('✅ Dungeon world complete!');
}

// Build corridors between rooms
function buildCorridors(rooms) {
    const corridors = [
        { from: rooms[0], to: rooms[1] }, // Center to East
        { from: rooms[0], to: rooms[2] }, // Center to West
        { from: rooms[0], to: rooms[3] }, // Center to North
        { from: rooms[0], to: rooms[4] }, // Center to South
        { from: rooms[1], to: rooms[5] }, // East to NE
        { from: rooms[2], to: rooms[6] }  // West to SW
    ];

    corridors.forEach((corridor) => {
        const startX = corridor.from.x;
        const startZ = corridor.from.z;
        const endX = corridor.to.x;
        const endZ = corridor.to.z;

        // Horizontal corridor
        if (Math.abs(endX - startX) > 0) {
            const minX = Math.min(startX, endX);
            const maxX = Math.max(startX, endX);
            for (let x = minX; x <= maxX; x += tileSpacing) {
                const key = `${x.toFixed(2)},${startZ.toFixed(2)}`;
                if (!placedFloors.has(key)) {
                    placedFloors.add(key);
                    loadDungeonTile('floor', x, startZ, 0x666666);
                }
            }
        }

        // Vertical corridor
        if (Math.abs(endZ - startZ) > 0) {
            const minZ = Math.min(startZ, endZ);
            const maxZ = Math.max(startZ, endZ);
            for (let z = minZ; z <= maxZ; z += tileSpacing) {
                const key = `${endX.toFixed(2)},${z.toFixed(2)}`;
                if (!placedFloors.has(key)) {
                    placedFloors.add(key);
                    loadDungeonTile('floor', endX, z, 0x666666);
                }
            }
        }
    });
}

// Load a single dungeon tile (floor or wall) - using simple cubes for clean rendering
function loadDungeonTile(type, x, z, color, rotation = 0) {
    let geometry, material, mesh;
    
    if (type === 'floor') {
        geometry = new THREE.BoxGeometry(tileSpacing * 0.95, 0.2, tileSpacing * 0.95);
        material = new THREE.MeshStandardMaterial({ 
            color: color || 0x444444,
            roughness: 0.8,
            metalness: 0.2
        });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, 0, z);
    } else if (type === 'wall') {
        geometry = new THREE.BoxGeometry(tileSpacing * 0.5, 4, tileSpacing * 0.5);
        material = new THREE.MeshStandardMaterial({ 
            color: color || 0x666666,
            roughness: 0.9,
            metalness: 0.1
        });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, 2, z);
        mesh.rotation.y = rotation;
    }
    
    if (mesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        window.scene.add(mesh);
    }
}

// Add interactive objects to world
function addInteractiveObjects() {
    // Add treasure chests
    const chestPositions = [
        { x: 10, z: 10 },
        { x: -10, z: -10 },
        { x: 15, z: 0 }
    ];

    chestPositions.forEach((pos) => {
        const geometry = new THREE.BoxGeometry(1, 0.8, 0.6);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x8B4513,
            roughness: 0.8,
            metalness: 0.2
        });
        const chest = new THREE.Mesh(geometry, material);
        chest.position.set(pos.x, 0.4, pos.z);
        chest.castShadow = true;
        chest.receiveShadow = true;
        chest.userData.type = 'chest';
        window.scene.add(chest);
    });

    // Add knowledge crystals
    const crystalPositions = [
        { x: 0, z: 8 },
        { x: 8, z: 0 },
        { x: -8, z: 0 },
        { x: 0, z: -8 }
    ];

    crystalPositions.forEach((pos) => {
        const geometry = new THREE.OctahedronGeometry(0.5);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x00ffff,
            emissive: 0x0088ff,
            emissiveIntensity: 0.5,
            roughness: 0.2,
            metalness: 0.8
        });
        const crystal = new THREE.Mesh(geometry, material);
        crystal.position.set(pos.x, 1, pos.z);
        crystal.castShadow = true;
        crystal.userData.type = 'crystal';
        crystal.userData.rotation = Math.random() * 0.02;
        window.scene.add(crystal);
    });
}

// Export functions to window for global access
window.buildWorld = buildWorld;
window.addInteractiveObjects = addInteractiveObjects;
