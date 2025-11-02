const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.get('/', (req, res) => {
  res.send('Socket.IO chat server is running!');
});

const users = {};

io.on('connection', socket => {
  console.log('User connected:', socket.id);

  socket.on('new-user-joined', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
  });

  socket.on('send', message => {
    socket.broadcast.emit('receive', { message, name: users[socket.id] });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  });
});

// Use dynamic port for Render
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
