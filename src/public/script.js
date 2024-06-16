const messagesDiv = document.querySelector('.messages');
const sendBtn = document.querySelector('.send-btn');
const messageInput = document.querySelector('.message-input');

// Function to generate a random username
function generateRandomUsername() {
    const adjectives = ['Fast', 'Silent', 'Furious', 'Brave', 'Clever', 'Witty', 'Bloody', 'Annoying', 'Attractive', 'Arrogant'];
    const nouns = ['Tiger', 'Eagle', 'Lion', 'Shark', 'Panther', 'Falcon', 'Einstein', 'Shoe', 'Ability', 'Bedroom', 'Cat', 'Jellyfish', 'Family', 'Knowledge'];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adjective}${noun}${Math.floor(Math.random() * 10)}`;
}

const username = generateRandomUsername();
const chatroomId = window.location.pathname.split('/').pop();
const ws = new WebSocket(`ws://localhost:3000/ws/${chatroomId}`);

ws.onopen = () => {
    console.log('Connected to the server as', username);
};

ws.onmessage = (event) => {
    const messageData = JSON.parse(event.data);
    displayMessage(`${messageData.username}: ${messageData.message}`);
};

function displayMessage(message) {
    const msgDiv = document.createElement('div');
    msgDiv.textContent = message;
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

sendBtn.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim() === "") return; // Don't send empty messages

    const messageData = {
        username: username,
        message: message
    };
    ws.send(JSON.stringify(messageData));
    displayMessage(`You: ${message}`);

    messageInput.value = ''; // Clear the input after sending
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});
