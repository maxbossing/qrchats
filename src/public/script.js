// Function to generate a random username
function generateRandomUsername() {
    const adjectives = ['Fast', 'Silent', 'Furious', 'Brave', 'Clever', 'Witty', 'Bloody', 'Annoying', 'Attractive', 'Arrogant'];
    const nouns = ['Tiger', 'Eagle', 'Lion', 'Shark', 'Panther', 'Falcon', 'Einstein', 'Shoe', 'Ability', 'Bedroom', 'Cat', 'Jellyfish', 'Family', 'Knowledge'];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    return `${adjective}${noun}${Math.floor(Math.random() * 10)}`;
}

const messagesDiv = document.querySelector('.messages');
const sendBtn = document.querySelector('.send-btn');
const messageInput = document.querySelector('.message-input');

const username = generateRandomUsername();
const chatroomId = window.location.pathname.split('/').pop();
const ws = new WebSocket(`ws://${window.location.hostname}:${window.location.port}/ws/${chatroomId}`);

ws.onopen = () => {
    console.log('Connected to the server as', username);
};

ws.onmessage = (event) => {
    console.log('Message received:', event.data);
    const messageData = JSON.parse(event.data);
    displayMessage(`${messageData.username}: ${messageData.message}`);
};

ws.onclose = () => {
    console.log('Disconnected from the server');
};

ws.onerror = (error) => {
    console.log('WebSocket error:', error);
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
    console.log('Sending message:', messageData);
    ws.send(JSON.stringify(messageData));
    displayMessage(`You: ${message}`);

    messageInput.value = ''; // Clear the input after sending
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});
