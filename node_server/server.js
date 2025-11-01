// Node server to handle Socket.IO connections

const { Server } = require('socket.io'); // Import Socket.IO Server class
const http = require('http');

// Optional: Create a basic HTTP server if you plan to serve files
const server = http.createServer(); // Not required if you're just using sockets

// Bind Socket.IO to the server on port 8000
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins — change this for security in production
    }
});

const users = {};

// Handle new socket connections
io.on('connection', socket => {
    // When a new user joins
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // When a user sends a message
    socket.on('send', message => {
        socket.broadcast.emit('receive', {
            message: message,
            name: users[socket.id]
        });
    });

    // When a user disconnects
    socket.on('disconnect', () => {
        if (users[socket.id]) {
            socket.broadcast.emit('left', users[socket.id]);
            delete users[socket.id];
        }
    });
});

// Start the HTTP server
server.listen(8000, () => {
    console.log("Socket.IO server running on port 8000");
});
