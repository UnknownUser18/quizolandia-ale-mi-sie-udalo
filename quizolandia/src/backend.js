const mysql2 = require('mysql2');
const ws = require('ws');
require('dotenv').config();
const wss = new ws.WebSocketServer({
  port: 8080,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      level: 3,
      memLevel: 7
    },
    zlibInflateOptions: {
      chunkSize: 10240
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  }
});

console.log('WebSocket server started on ws://localhost:8080, waiting for connections...');
wss.on('connection', (ws) => {
  console.log('Connection connected');
  wss.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
  ws.on('message', (message) => {
    console.log('Received:', message);

    const response = `Server received: ${message}`;
    ws.send(response);
  });
  wss.on('close', () => {
    console.log('Connection closed');
  });
});
const db_config = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
}
const connection = mysql2.createConnection(db_config);
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});
