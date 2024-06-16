const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const url = require('url');
const path = require('path');

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ noServer: true });

const chatrooms = {};

wss.on('connection', (ws, request) => {
    const pathname = url.parse(request.url).pathname;
    const chatroomId = pathname.split('/').pop();

    if (!chatrooms[chatroomId]) {
        chatrooms[chatroomId] = new Set();
    }
    chatrooms[chatroomId].add(ws);

    ws.on('message', (message) => {
        const messageData = JSON.parse(message);
        chatrooms[chatroomId].forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(messageData));
            }
        });
    });

    ws.on('close', () => {
        chatrooms[chatroomId].delete(ws);
        if (chatrooms[chatroomId].size === 0) {
            delete chatrooms[chatroomId];
        }
    });
});

server.on('upgrade', (request, socket, head) => {
    const pathname = url.parse(request.url).pathname;

    if (pathname.startsWith('/ws/')) {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route to serve the index.html file for any other URL paths
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
