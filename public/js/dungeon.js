// dungeon-bsp.js - Better dungeon generation using Binary Space Partition algorithm
// Creates proper rooms connected by hallways with actual 3D models and collision detection

const tileSpacing = 4.1;
const placedFloors = new Set();
const wallColliders = [];  // Track walls for collision detection
let pendingLoads = 0;
let dungeonReady = false;

const floorModels = [
    'floor_tile_large',
    'floor_wood_large', 
    'floor_dirt_large_rocky',
    'floor_tile_extralarge_grates'
];

const wallModels = [
    'wall_arched',
    'wall_stone_large',
    'wall_stone_large_reinforced',
    'wall_stone_corner'
];

// BSP Node for tree structure
class BSPNode {
    constructor(x, z, width, depth) {
        this.x = x;
        this.z = z;
        this.width = width;
        this.depth = depth;
        this.room = null;
        this.leftChild = null;
        this.rightChild = null;
        this.hallway = null;
    }

    isLeaf() {
        return !this.leftChild && !this.rightChild;
    }

    createRoom() {
        const minRoomSize = 6;
        if (this.width < minRoomSize || this.depth < minRoomSize) {
            return;
        }

        const roomWidth = Math.floor(Math.random() * (this.width - minRoomSize + 1)) + minRoomSize;
        const roomDepth = Math.floor(Math.random() * (this.depth - minRoomSize + 1)) + minRoomSize;
        const roomX = this.x + Math.floor(Math.random() * (this.width - roomWidth));
        const roomZ = this.z + Math.floor(Math.random() * (this.depth - roomDepth));

        this.room = {
            x: roomX,
            z: roomZ,
            width: roomWidth,
            depth: roomDepth,
            centerX: roomX + roomWidth / 2,
            centerZ: roomZ + roomDepth / 2,
            floorModel: floorModels[Math.floor(Math.random() * floorModels.length)],
            wallModel: wallModels[Math.floor(Math.random() * wallModels.length)]
        };
    }

    split() {
        if (this.isLeaf()) {
            const horizontal = Math.random() > 0.5;

            if (horizontal) {
                const splitZ = this.z + Math.floor(Math.random() * (this.depth - 4)) + 2;
                this.leftChild = new BSPNode(this.x, this.z, this.width, splitZ - this.z);
                this.rightChild = new BSPNode(this.x, splitZ, this.width, this.depth - (splitZ - this.z));

                this.hallway = {
                    type: 'horizontal',
                    x: this.x,
                    z: splitZ,
                    width: this.width,
                    depth: 2
                };
            } else {
                const splitX = this.x + Math.floor(Math.random() * (this.width - 4)) + 2;
                this.leftChild = new BSPNode(this.x, this.z, splitX - this.x, this.depth);
                this.rightChild = new BSPNode(splitX, this.z, this.width - (splitX - this.x), this.depth);

                this.hallway = {
                    type: 'vertical',
                    x: splitX,
                    z: this.z,
                    width: 2,
                    depth: this.depth
                };
            }
        }
    }
}

function generateBSPTree(node, depth = 0, maxDepth = 4) {
    if (depth >= maxDepth || (node.width <= 8 && node.depth <= 8)) {
        node.createRoom();
        return;
    }

    const minSize = 10;
    if (node.width >= minSize || node.depth >= minSize) {
        node.split();
        generateBSPTree(node.leftChild, depth + 1, maxDepth);
        generateBSPTree(node.rightChild, depth + 1, maxDepth);
    } else {
        node.createRoom();
    }
}

function loadDungeonTile(type, x, z, modelName) {
    // Use simple geometry fallback directly (GLTF loading is slow and unreliable)
    // This avoids the need to load 200+ GLTF files concurrently
    loadDungeonFallback(type, x, z);
}


function loadDungeonFallback(type, x, z) {
    let geometry, height, color;
    
    if (type === 'floor') {
        geometry = new THREE.BoxGeometry(3.8, 0.3, 3.8);
        color = 0x4a4a4a;
    } else {
        geometry = new THREE.BoxGeometry(3.8, 3.5, 0.3);
        color = 0x6a6a6a;
        height = 1.75;
    }
    
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.8 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, height || 0, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    
    // Add wall collider
    if (type === 'wall') {
        const box = new THREE.Box3().setFromObject(mesh);
        wallColliders.push({
            min: box.min,
            max: box.max,
            mesh: mesh
        });
    }
}

function buildRoom(room) {
    for (let x = 0; x < room.width; x++) {
        for (let z = 0; z < room.depth; z++) {
            const posX = room.x + x * tileSpacing;
            const posZ = room.z + z * tileSpacing;
            const key = `${posX.toFixed(2)},${posZ.toFixed(2)}`;

            if (!placedFloors.has(key)) {
                placedFloors.add(key);
                loadDungeonTile('floor', posX, posZ, room.floorModel);
            }
        }
    }

    // Walls around room perimeter
    const wallPositions = [];

    for (let x = 0; x < room.width; x++) {
        const posX = room.x + x * tileSpacing;
        wallPositions.push({ x: posX, z: room.z - tileSpacing, rotation: 0 });
        wallPositions.push({ x: posX, z: room.z + room.depth * tileSpacing, rotation: 0 });
    }

    for (let z = 1; z < room.depth; z++) {
        const posZ = room.z + z * tileSpacing;
        wallPositions.push({ x: room.x - tileSpacing, z: posZ, rotation: Math.PI / 2 });
        wallPositions.push({ x: room.x + room.width * tileSpacing, z: posZ, rotation: Math.PI / 2 });
    }

    for (const pos of wallPositions) {
        loadDungeonTile('wall', pos.x, pos.z, room.wallModel);
    }
}

function buildHallway(hallway) {
    const hallFloor = floorModels[0];  // Use first floor model for hallways

    if (hallway.type === 'horizontal') {
        for (let x = 0; x < hallway.width; x++) {
            for (let z = 0; z < hallway.depth; z++) {
                const posX = hallway.x + x * tileSpacing;
                const posZ = hallway.z + z * tileSpacing;
                const key = `${posX.toFixed(2)},${posZ.toFixed(2)}`;

                if (!placedFloors.has(key)) {
                    placedFloors.add(key);
                    loadDungeonTile('floor', posX, posZ, hallFloor);
                }
            }
        }
        
        // Walls on sides of horizontal hallway
        for (let x = 0; x < hallway.width; x++) {
            const posX = hallway.x + x * tileSpacing;
            loadDungeonTile('wall', posX, hallway.z - tileSpacing, wallModels[0]);
            loadDungeonTile('wall', posX, hallway.z + hallway.depth * tileSpacing, wallModels[0]);
        }
    } else {
        for (let x = 0; x < hallway.width; x++) {
            for (let z = 0; z < hallway.depth; z++) {
                const posX = hallway.x + x * tileSpacing;
                const posZ = hallway.z + z * tileSpacing;
                const key = `${posX.toFixed(2)},${posZ.toFixed(2)}`;

                if (!placedFloors.has(key)) {
                    placedFloors.add(key);
                    loadDungeonTile('floor', posX, posZ, hallFloor);
                }
            }
        }
        
        // Walls on sides of vertical hallway
        for (let z = 0; z < hallway.depth; z++) {
            const posZ = hallway.z + z * tileSpacing;
            loadDungeonTile('wall', hallway.x - tileSpacing, posZ, wallModels[0]);
            loadDungeonTile('wall', hallway.x + hallway.width * tileSpacing, posZ, wallModels[0]);
        }
    }
}

function buildWorld() {
    console.log("🏰 Building dungeon with BSP algorithm...");
    wallColliders.length = 0;  // Clear previous colliders
    placedFloors.clear();
    dungeonReady = false;
    
    const root = new BSPNode(-30, -30, 60, 60);
    generateBSPTree(root, 0, 3);
    
    function processNode(node) {
        if (node.room) {
            buildRoom(node.room);
        }
        if (node.hallway) {
            buildHallway(node.hallway);
        }
        if (node.leftChild) processNode(node.leftChild);
        if (node.rightChild) processNode(node.rightChild);
    }
    
    processNode(root);
    console.log("✅ Dungeon built successfully with simple geometry");
    dungeonReady = true;  // Dungeon is immediately ready (no async GLTF loads)
}

function checkDungeonReady() {
    if (pendingLoads === 0 && !dungeonReady) {
        dungeonReady = true;
        console.log(`✓ Dungeon fully loaded with ${wallColliders.length} wall colliders`);
        window.dungeonReady = true;
        
        // Notify listeners that dungeon is ready
        if (window.onDungeonReady) {
            window.onDungeonReady();
        }
    }
}

// Collision detection helper
function checkWallCollision(playerPos, radius = 2) {
    for (const wall of wallColliders) {
        const dx = Math.max(wall.min.x, Math.min(playerPos.x, wall.max.x)) - playerPos.x;
        const dy = Math.max(wall.min.y, Math.min(playerPos.y, wall.max.y)) - playerPos.y;
        const dz = Math.max(wall.min.z, Math.min(playerPos.z, wall.max.z)) - playerPos.z;
        
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (distance < radius) {
            return true;  // Collision detected
        }
    }
    return false;
}

// Make collision function and ready flag global so main script can use it
window.checkWallCollision = checkWallCollision;
window.dungeonReady = false;
