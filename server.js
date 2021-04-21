const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    pingInterval: 15000,
    pingTimeout: 15000
});

app.use(express.static(path.join(__dirname, "Public")))
io.on('connection', (socket) => {
    //console.log(`New User: ${socket.id}`)
    socket.on('handshake', handshake => {
        socket.join(handshake.room);
        io.to(handshake.room).emit('message', { type: 'join', username: handshake.username, timestamp: Date.now() })
    });
    socket.on('sendMessage', msg => {
        socket.broadcast.to(msg.room).emit('message', msg);
    })
    socket.on('sendImg', (msg) => {
        socket.broadcast.to(msg.room).emit('message', msg);
    })



})

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`PORT: ${PORT}`));