// ==== BACKEND (Express + Socket.IO) ====
// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

let messages = [];

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', (room) => {
    socket.join(room);
    socket.emit('chatHistory', messages.filter(msg => msg.room === room));
  });

  socket.on('sendMessage', (msg) => {
    messages.push(msg);
    io.to(msg.room).emit('receiveMessage', msg);
  });
});

const PORT = 3001;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
