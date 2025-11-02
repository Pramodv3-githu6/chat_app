// ✅ Wait until the page and scripts fully load
window.addEventListener('load', () => {
  // Connect to your Render-hosted Socket.IO server
  const socket = io('https://chat-app-1-6uo9.onrender.com');

  // DOM elements
  const form = document.getElementById('send-container');
  const messageInput = document.getElementById('messageInp');
  const messageContainer = document.querySelector('.container');

  // Sound for incoming messages
  const audio = new Audio('ting.mp3');

  // Function to append messages to chat
  const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message', position);
    messageContainer.appendChild(messageElement);

    // Always scroll to latest message
    messageContainer.scrollTop = messageContainer.scrollHeight;

    // Play sound only for received messages
    if (position === 'left') {
      audio.play();
    }
  };

  // Ask user for name
  const name = prompt('Enter your name to join');
  if (name) {
    socket.emit('new-user-joined', name);
  }

  // When a new user joins
  socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
  });

  // When receiving a message
  socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
  });

  // When a user leaves the chat
  socket.on('left', name => {
    append(`${name} left the chat`, 'right');
  });

  // Sending message from form
  form.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
      append(`You: ${message}`, 'right');
      socket.emit('send', message);
      messageInput.value = '';
    }
  });
});
