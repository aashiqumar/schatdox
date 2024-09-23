const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid'); // Import UUID library

// Create an Express app
const app = express();

// Serve static files (like index.html) from the 'public' folder
app.use(express.static('public'));

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Set up WebSocket server on the same HTTP server
const wss = new WebSocket.Server({ server });

// WebSocket connection handler
wss.on('connection', (ws) => {
  ws.id = uuidv4(); // Assign a unique ID to each client
  console.log(`A client connected: ${ws.id}`);

  ws.on('message', (message) => {
    console.log(`Received from ${ws.id}:`, message);

    // Broadcast message to all connected clients except the sender
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client.id !== ws.id) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log(`Client disconnected: ${ws.id}`);
  });
});

// Start the server on port 4000
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});