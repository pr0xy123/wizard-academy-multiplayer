// dungeon-bsp.js - Fixed dungeon generation
const tileSpacing = 4;
const wallColliders = [];
let dungeonReady = false;

class BSPNode {
    constructor(x, z, width, depth) {
        this.x = x;
        this.z = z;
        this.width = width;
        this.depth = depth;
        this.room = null;
        this.leftChild = null;
        this.rightChild = null;
    }

    isLeaf() {
        return !this.leftChild && !this.rightChild;
    }

    getCenter() {
        if (this.room) {
            return {
                x: this.room.x + this.room.width / 2,
                z: this.room.z + this.room.depth / 2
            };
        }
        return {
            x: this.x + this.width / 2,
            z: this.z + this.depth / 2
        };
    }

    createRoom() {
        const padding = 2;
        const roomWidth = Math.max(4, this.width - padding * 2);
        const roomDepth = Math.max(4, this.depth - padding * 2);
        
        this.room = {
            x: this.x + padding,
            z: this.z + padding,
            width: roomWidth,
            depth: roomDepth,
            centerX: this.x + padding + roomWidth / 2,
            centerZ: this.z + padding + roomDepth / 2
        };
    }

    split() {
        if (!this.isLeaf()) return false;
        
        const minSize = 8;
        if (this.width < minSize * 2 && this.depth < minSize * 2) return false;
        
        const horizontal = this.width < this.depth; // Split longer axis
        
        if (horizontal) {
            const splitZ = this.z + Math.floor(this.depth / 2) + Math.floor((Math.random() - 0.5) * this.depth * 0.3);
            this.leftChild = new BSPNode(this.x, this.z, this.width, splitZ - this.z);
            this.rightChild = new BSPNode(this.x, splitZ, this.width, this.depth - (splitZ - this.z));
        } else {
            const splitX = this.x + Math.floor(this.width / 2) + Math.floor((Math.random() - 0.5) * this.width * 0.3);
            this.leftChild = new BSPNode(this.x, this.z, splitX - this.x, this.depth);
            this.rightChild = new BSPNode(splitX, this.z, this.width - (splitX - this.x), this.depth);
        }
        return true;
    }
}

function generateBSPTree(node, depth = 0, maxDepth = 4) {
    if (depth >= maxDepth) {
        node.createRoom();
        return;
    }
    
    if (!node.split()) {
        node.createRoom();
        return;
    }
    
    generateBSPTree(node.leftChild, depth + 1, maxDepth);
    generateBSPTree(node.rightChild, depth + 1, maxDepth);
}

function createTile(type, x, z) {
    const posX = x * tileSpacing;
    const posZ = z * tileSpacing;
    
    if (type === 'floor') {
        const geometry = new THREE.BoxGeometry(tileSpacing * 0.95, 0.2, tileSpacing * 0.95);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xcccccc,
            roughness: 0.5,
            metalness: 0.2
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(posX, 0, posZ);
        mesh.receiveShadow = true;
        scene.add(mesh);
        return mesh;
    } else {
        const geometry = new THREE.BoxGeometry(tileSpacing * 0.95, 3, tileSpacing * 0.95);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xd0d0d0,
            roughness: 0.5,
            metalness: 0.2
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(posX, 1.5, posZ);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
        
        const box = new THREE.Box3().setFromObject(mesh);
        wallColliders.push({
            min: box.min,
            max: box.max,
            mesh: mesh
        });
        return mesh;
    }
}

function buildRoom(room) {
    // Floor
    for (let x = 0; x < room.width; x++) {
        for (let z = 0; z < room.depth; z++) {
            createTile('floor', room.x + x, room.z + z);
        }
    }
    
    // Walls with doorways
    const doorX = Math.floor(room.width / 2);
    const doorZ = Math.floor(room.depth / 2);
    
    for (let x = 0; x < room.width; x++) {
        if (x !== doorX) {
            createTile('wall', room.x + x, room.z - 1);
            createTile('wall', room.x + x, room.z + room.depth);
        }
    }
    
    for (let z = 0; z < room.depth; z++) {
        if (z !== doorZ) {
            createTile('wall', room.x - 1, room.z + z);
            createTile('wall', room.x + room.width, room.z + z);
        }
    }
}

function connectRooms(node) {
    if (node.isLeaf()) return;
    
    connectRooms(node.leftChild);
    connectRooms(node.rightChild);
    
    const leftCenter = node.leftChild.getCenter();
    const rightCenter = node.rightChild.getCenter();
    
    // Create L-shaped hallway between centers
    const midX = leftCenter.x;
    const midZ = rightCenter.z;
    
    // Horizontal then vertical (or vice versa)
    const minX = Math.min(leftCenter.x, rightCenter.x);
    const maxX = Math.max(leftCenter.x, rightCenter.x);
    const minZ = Math.min(leftCenter.z, rightCenter.z);
    const maxZ = Math.max(leftCenter.z, rightCenter.z);
    
    // Build corridor floor
    for (let x = Math.floor(minX); x <= Math.ceil(maxX); x++) {
        for (let z = Math.floor(minZ - 1); z <= Math.ceil(maxZ + 1); z++) {
            // Check if this tile is in the corridor path
            const inHorizontal = z >= Math.floor(leftCenter.z - 1) && z <= Math.ceil(leftCenter.z + 1);
            const inVertical = x >= Math.floor(rightCenter.x - 1) && x <= Math.ceil(rightCenter.x + 1);
            
            if (inHorizontal || inVertical) {
                createTile('floor', x, z);
            }
        }
    }
}

function buildWorld() {
    console.log("🏰 Building dungeon...");
    wallColliders.length = 0;
    dungeonReady = false;
    
    // Clear existing dungeon geometry ONLY (preserve lights and other objects)
    // Store lights and other non-geometry objects
    const lightsToKeep = [];
    for (let i = scene.children.length - 1; i >= 0; i--) {
        const child = scene.children[i];
        // Keep lights, camera, and playerContainer
        if (child instanceof THREE.Light || child === playerContainer || child === camera) {
            lightsToKeep.push(child);
        } else if (child.isMesh || child.isGroup) {
            // Remove geometry (meshes and groups)
            scene.remove(child);
        }
    }
    
    const root = new BSPNode(-20, -20, 40, 40);
    generateBSPTree(root, 0, 3);
    
    // Build rooms
    function buildNodes(node) {
        if (node.room) buildRoom(node.room);
        if (node.leftChild) buildNodes(node.leftChild);
        if (node.rightChild) buildNodes(node.rightChild);
    }
    buildNodes(root);
    
    // Connect with hallways
    connectRooms(root);
    
    dungeonReady = true;
    window.dungeonReady = true;
    console.log("✅ Dungeon ready");
}

function checkWallCollision(playerPos, radius = 1) {
    for (const wall of wallColliders) {
        const closestX = Math.max(wall.min.x, Math.min(playerPos.x, wall.max.x));
        const closestZ = Math.max(wall.min.z, Math.min(playerPos.z, wall.max.z));
        
        const dx = playerPos.x - closestX;
        const dz = playerPos.z - closestZ;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance < radius) return true;
    }
    return false;
}

window.checkWallCollision = checkWallCollision;
window.dungeonReady = false;
