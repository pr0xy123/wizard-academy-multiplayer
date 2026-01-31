const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { 
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling']
});

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

const rooms = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('join-room', (roomId, playerName) => {
        socket.join(roomId);
        
        // Initialize room if it doesn't exist
        if (!rooms.has(roomId)) {
            rooms.set(roomId, new Map());
        }
        
        const room = rooms.get(roomId);
        
        // Send existing players to the new player
        const existingPlayers = Array.from(room.values()).map((player, index) => ({
            id: Array.from(room.keys())[index],
            name: player.name,
            x: player.x,
            z: player.z
        }));
        socket.emit('existing-players', existingPlayers);
        
        // Add new player to room
        room.set(socket.id, { name: playerName, x: 0, z: 0 });
        
        // Notify others in the room
        socket.to(roomId).emit('player-joined', { 
            id: socket.id, 
            name: playerName,
            x: 0,
            z: 0
        });
        
        console.log(`${playerName} joined room ${roomId}`);
    });
    
    socket.on('move', (data) => {
        const roomId = Array.from(socket.rooms)[1];
        if (roomId) {
            const room = rooms.get(roomId);
            if (room && room.has(socket.id)) {
                const player = room.get(socket.id);
                player.x = data.x;
                player.z = data.z;
                socket.to(roomId).emit('player-moved', { 
                    id: socket.id, 
                    x: data.x, 
                    z: data.z 
                });
            }
        }
    });
    
    socket.on('draw', (data) => {
        const roomId = Array.from(socket.rooms)[1];
        if (roomId) {
            socket.to(roomId).emit('draw', data);
        }
    });
    
    socket.on('clear-canvas', () => {
        const roomId = Array.from(socket.rooms)[1];
        if (roomId) {
            socket.to(roomId).emit('clear-canvas');
        }
    });
    
    socket.on('chat-message', (message) => {
        const roomId = Array.from(socket.rooms)[1];
        if (roomId) {
            const room = rooms.get(roomId);
            if (room && room.has(socket.id)) {
                const player = room.get(socket.id);
                io.to(roomId).emit('chat-message', {
                    name: player.name,
                    message: message
                });
            }
        }
    });
    
    socket.on('crystal-collected', (data) => {
        const roomId = Array.from(socket.rooms)[1];
        if (roomId) {
            socket.to(roomId).emit('crystal-collected', {
                playerId: socket.id,
                crystalId: data.crystalId
            });
        }
    });
    
    socket.on('signal', (data) => {
        socket.to(data.to).emit('signal', { 
            from: socket.id, 
            signal: data.signal 
        });
    });
    
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        rooms.forEach((room, roomId) => {
            if (room.has(socket.id)) {
                room.delete(socket.id);
                socket.to(roomId).emit('player-left', socket.id);
                console.log(`Player left room ${roomId}`);
            }
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🧙 Wizard Academy Server running on port ${PORT}`);
    console.log(`🌍 Server ready for connections`);
});
