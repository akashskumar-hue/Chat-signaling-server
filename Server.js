const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_room', (roomName) => {
        socket.join(roomName);
        console.log(`User ${socket.id} joined room: ${roomName}`);
        socket.to(roomName).emit('peer_joined', socket.id);
    });

    socket.on('offer', (payload) => {
        io.to(payload.target).emit('offer', { sdp: payload.sdp, sender: socket.id });
    });

    socket.on('answer', (payload) => {
        io.to(payload.target).emit('answer', { sdp: payload.sdp, sender: socket.id });
    });

    socket.on('ice_candidate', (payload) => {
        io.to(payload.target).emit('ice_candidate', { candidate: payload.candidate, sender: socket.id });
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Signaling server listening on port ${PORT}`);
});
