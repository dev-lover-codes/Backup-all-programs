const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the current directory
app.use(express.static(__dirname));

// Game State Management
const rooms = new Map(); // roomId -> { players: [socketId], board: [], turn: socketId }

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_game', (data) => {
        // Simple matchmaking: Find a room with 1 player, or create new
        let roomId = null;
        
        for (const [id, room] of rooms) {
            if (room.players.length === 1) {
                roomId = id;
                break;
            }
        }

        if (!roomId) {
            roomId = Math.random().toString(36).substring(7);
            rooms.set(roomId, { players: [socket.id], board: Array(9).fill(null), turn: socket.id });
            socket.join(roomId);
            socket.emit('game_created', { roomId, player: 'p1' });
        } else {
            const room = rooms.get(roomId);
            room.players.push(socket.id);
            socket.join(roomId);
            socket.emit('game_joined', { roomId, player: 'p2' });
            io.to(roomId).emit('game_start', { startTurn: room.turn });
        }
    });

    socket.on('make_move', ({ roomId, index, player }) => {
        const room = rooms.get(roomId);
        if (!room) return;

        // Validate turn
        // In a real app, we'd check socket.id === room.turn
        
        room.board[index] = player;
        socket.to(roomId).emit('opponent_move', { index, player });
        
        // Switch turn logic would be handled here or on client
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Find room and notify opponent
        for (const [roomId, room] of rooms) {
            if (room.players.includes(socket.id)) {
                socket.to(roomId).emit('opponent_left');
                rooms.delete(roomId);
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
