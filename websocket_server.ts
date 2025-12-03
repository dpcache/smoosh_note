import WebSocket, { WebSocketServer } from 'ws';

const PORT = 3001;
const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');

  ws.on('message', (message: WebSocket.RawData) => {
    const msg = message.toString();
    console.log(`Received: ${msg}`);

    // Broadcast message to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
  });

  ws.on('close', () => console.log('Client disconnected'));
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);