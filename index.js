const express = require('express');
const socketio = require('socket.io');
const path = require('path')
const http = require('http');



const app = express();
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, 'Public')))

io.on('connection', (socket) => {
    console.log("NEW CONNECTION")

    socket.emit('reqUsername', 'req');

    socket.on('username', username => {
        io.emit('newUser', username)
    })

    socket.on('message', (msg) => {

        socket.broadcast.emit('newMessage', msg);
    })

})



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(PORT))