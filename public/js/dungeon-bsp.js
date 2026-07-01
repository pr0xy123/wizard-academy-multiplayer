// dungeon-bsp.js - Better dungeon generation using Binary Space Partition algorithm
// Creates proper rooms connected by hallways in a structured, repeatable way

const tileSpacing = 4.1;
const placedFloors = new Set();
const roomThemes = [
    { name: 'Math Chamber', color: 0x3366ff, subject: 'math' },
    { name: 'Science Lab', color: 0x00ff66, subject: 'science' },
    { name: 'History Hall', color: 0xff9933, subject: 'history' },
    { name: 'Literature Library', color: 0xff3366, subject: 'literature' },
    { name: 'Geography Gallery', color: 0x66ffff, subject: 'geography' },
    { name: 'Art Atrium', color: 0xff66ff, subject: 'art' },
    { name: 'Music Conservatory', color: 0xffff33, subject: 'music' }
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
            theme: roomThemes[Math.floor(Math.random() * roomThemes.length)]
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

// Recursively split the dungeon and create rooms
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

// Build world using BSP-generated rooms
function buildWorld() {
    console.log('🏰 Building dungeon world with BSP...');
    placedFloors.clear();

    const dungeonWidth = 60;
    const dungeonDepth = 60;
    const root = new BSPNode(-dungeonWidth / 2, -dungeonDepth / 2, dungeonWidth, dungeonDepth);

    generateBSPTree(root, 0, 3);

    const rooms = [];
    const hallways = [];
    collectRoomsAndHallways(root, rooms, hallways);

    console.log(`📍 Generated ${rooms.length} rooms and ${hallways.length} hallways`);

    rooms.forEach((room) => {
        console.log(`🏛️ Building ${room.theme.name} (${room.width}×${room.depth})`);
        buildRoom(room);
    });

    hallways.forEach((hallway) => {
        console.log(`🚪 Building hallway`);
        buildHallway(hallway);
    });

    console.log('✅ Dungeon world complete!');
}

// Collect all rooms and hallways from BSP tree
function collectRoomsAndHallways(node, rooms, hallways) {
    if (node.room) {
        rooms.push(node.room);
    }

    if (node.hallway) {
        hallways.push(node.hallway);
    }

    if (node.leftChild) collectRoomsAndHallways(node.leftChild, rooms, hallways);
    if (node.rightChild) collectRoomsAndHallways(node.rightChild, rooms, hallways);
}

// Build a single room
function buildRoom(room) {
    // Convert world units to tile counts
    const tilesWide = Math.max(2, Math.round(room.width / tileSpacing));
    const tilesDeep = Math.max(2, Math.round(room.depth / tileSpacing));

    // Place floor tiles (interior only)
    for (let x = 1; x < tilesWide - 1; x++) {
        for (let z = 1; z < tilesDeep - 1; z++) {
            const posX = room.x + x * tileSpacing;
            const posZ = room.z + z * tileSpacing;
            const key = `${posX.toFixed(2)},${posZ.toFixed(2)}`;

            if (!placedFloors.has(key)) {
                placedFloors.add(key);
                loadDungeonTile('floor', posX, posZ, room.theme.color);
            }
        }
    }

    // Place walls only at perimeter
    // North wall
    for (let x = 0; x < tilesWide; x++) {
        const posX = room.x + x * tileSpacing;
        const posZ = room.z;
        const key = `${posX.toFixed(2)},${posZ.toFixed(2)}`;
        if (!placedFloors.has(key)) {
            placedFloors.add(key);
            loadDungeonTile('wall', posX, posZ, room.theme.color, 0);
        }
    }

    // South wall
    for (let x = 0; x < tilesWide; x++) {
        const posX = room.x + x * tileSpacing;
        const posZ = room.z + (tilesDeep - 1) * tileSpacing;
        const key = `${posX.toFixed(2)},${posZ.toFixed(2)}`;
        if (!placedFloors.has(key)) {
            placedFloors.add(key);
            loadDungeonTile('wall', posX, posZ, room.theme.color, Math.PI);
        }
    }

    // West wall
    for (let z = 0; z < tilesDeep; z++) {
        const posX = room.x;
        const posZ = room.z + z * tileSpacing;
        const key = `${posX.toFixed(2)},${posZ.toFixed(2)}`;
        if (!placedFloors.has(key)) {
            placedFloors.add(key);
            loadDungeonTile('wall', posX, posZ, room.theme.color, -Math.PI / 2);
        }
    }

    // East wall
    for (let z = 0; z < tilesDeep; z++) {
        const posX = room.x + (tilesWide - 1) * tileSpacing;
        const posZ = room.z + z * tileSpacing;
        const key = `${posX.toFixed(2)},${posZ.toFixed(2)}`;
        if (!placedFloors.has(key)) {
            placedFloors.add(key);
            loadDungeonTile('wall', posX, posZ, room.theme.color, Math.PI / 2);
        }
    }
}

// Build hallways
function buildHallway(hallway) {
    const hallColor = 0x555555;

    if (hallway.type === 'horizontal') {
        for (let x = 0; x < hallway.width; x += tileSpacing) {
            for (let z = 0; z < hallway.depth; z += tileSpacing) {
                const posX = hallway.x + x;
                const posZ = hallway.z + z;
                const key = `${posX.toFixed(2)},${posZ.toFixed(2)}`;

                if (!placedFloors.has(key)) {
                    placedFloors.add(key);
                    loadDungeonTile('floor', posX, posZ, hallColor);
                }
            }
        }
    } else {
        for (let x = 0; x < hallway.width; x += tileSpacing) {
            for (let z = 0; z < hallway.depth; z += tileSpacing) {
                const posX = hallway.x + x;
                const posZ = hallway.z + z;
                const key = `${posX.toFixed(2)},${posZ.toFixed(2)}`;

                if (!placedFloors.has(key)) {
                    placedFloors.add(key);
                    loadDungeonTile('floor', posX, posZ, hallColor);
                }
            }
        }
    }
}

// Shared geometries — created once, reused for every tile
const _bspGeometries = {
    floor: new THREE.BoxGeometry(3.8, 0.3, 3.8),
    wall: new THREE.BoxGeometry(3.8, 3.5, 0.3)
};

// Material cache keyed by "type_color" — reuses materials for matching tiles
const _bspMaterialCache = new Map();

function _getBSPMaterial(type, color) {
    const key = `${type}_${color}`;
    if (_bspMaterialCache.has(key)) return _bspMaterialCache.get(key);
    let mat;
    if (type === 'floor') {
        mat = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.1,
            roughness: 0.8,
            emissive: color,
            emissiveIntensity: 0.1
        });
    } else {
        mat = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0,
            roughness: 0.9,
            emissive: color,
            emissiveIntensity: 0.05
        });
    }
    _bspMaterialCache.set(key, mat);
    return mat;
}

// Load a dungeon tile (pooled geometry + cached material)
function loadDungeonTile(type, x, z, color, rotation = 0) {
    const geometry = _bspGeometries[type];
    if (!geometry) return null;

    const material = _getBSPMaterial(type, color);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.isDungeonTile = true;

    if (type === 'floor') {
        mesh.position.set(x, 0, z);
        mesh.receiveShadow = true;
    } else if (type === 'wall') {
        mesh.position.set(x, 1.75, z);
        mesh.rotation.y = rotation;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
    }

    scene.add(mesh);
    return mesh;
}
