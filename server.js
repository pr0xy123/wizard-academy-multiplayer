const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*" }
});

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

const rooms = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('join-room', (roomId, playerName) => {
        socket.join(roomId);
        if (!rooms.has(roomId)) rooms.set(roomId, new Map());
        const room = rooms.get(roomId);
        room.set(socket.id, { name: playerName, x: 0, z: 0 });
        socket.to(roomId).emit('player-joined', { id: socket.id, name: playerName });
    });
    
    socket.on('move', (data) => {
        const roomId = Array.from(socket.rooms)[1];
        socket.to(roomId).emit('player-moved', { id: socket.id, x: data.x, z: data.z });
    });
    
    socket.on('signal', (data) => {
        socket.to(data.to).emit('signal', { from: socket.id, signal: data.signal });
    });
    
    socket.on('disconnect', () => {
        rooms.forEach((room, roomId) => {
            if (room.has(socket.id)) {
                room.delete(socket.id);
                socket.to(roomId).emit('player-left', socket.id);
            }
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
