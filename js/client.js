// const socket = io('http://localhost:8000');
// // Get DOM elements in respective Js variables
// const form = document.getElementById('send-container');
// const messageInput = document.getElementById('messageInp')
// const messageContainer =document.querySelector(".container")
// // Audio that will play on recieving messages
// var audio = new Audio('ting.mp3');
// // Function which will append to the contaner
// const append = (message, position) => {
//     const messageElement = document.createElement('div');
//     messageElement.innerText = message;
//     messageElement.classList.add('message');
//     messageElement.classList.add(position);
//     messageContainer.append(messageElement);
//     if (position == 'left') {
//         audio.play();
//     }
// }
//     // Ask new user for his/her name and let the server know
// const name = prompt("Enter your name to join");
// socket.emit('new-user-joined', name);
// // If a new user joins, receive his/her name from the server
// socket.on('user-joined', name =>{
// append(`${name} joined the chat`, 'right')
//  })

// // If server sends a message, receive it
// socket.on('receive', data =>{
// append(`${data.name}: ${data.message}`, 'left')
// })
// // If a user leaves the chat, append the info to the container
// socket.on('left', name => {
// append(`${name} left the chat`, 'right')
// })

// // If the form get
// form.addEventListener('submit', (e) => {
// e.preventDefault();
// const message = messageInput.value;
// append(`You: ${message}`, 'right');
// socket.emit('send', message);
// messageInput.value =''
// })


// Client-side JavaScript for the chat application
// Ensure you have socket.io-client installed: npm install socket.io-client

const socket = io('http://localhost:8000');  // Connect to the server at the specified URL

// Get DOM elements in respective Js variables using their IDs

const form = document.getElementById('send-container');     
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

// Audio to play on receiving messages
const audio = new Audio('ting.mp3');

// Function to append messages to the container with appropriate classes
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message', position);
    messageContainer.appendChild(messageElement);
    if (position === 'left') {
        audio.play();
    }
    else if (position === 'right') {
        audio.play();
    }
};

// Ask user for their name and notify server
const name = prompt("Enter your name to join");
// If the user provides a name, emit the 'new-user-joined' event
if (name) {
    socket.emit('new-user-joined', name);
}

// When a new user joins
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
    
});

// When receiving a message from the server
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

// When a user leaves the chat room 
socket.on('left', name => {
    append(`${name} left the chat`, 'right');
});

// When the form is submitted (sending message)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    }
});
