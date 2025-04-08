const mysql2 = require('mysql2');
const ws = require('ws');
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
console.log('WebSocket server started on ws://localhost:8080, waiting for connections...');
wss.on('connection', (ws) => {
  console.log('Connection connected');
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    executeQuery(ws, message);
  });
  ws.on('close', () => {
    console.log('Connection closed');
  });
});
const queries = {
    'getCategoryName': 'SELECT category_name FROM category;',
    'getCommentsFromQuiz': 'SELECT username, content, publicTime, avatar, stars FROM comments JOIN user ON comments.id_user = user.id_user WHERE id_quiz = ?;',
    'getQuiz': `SELECT quiz.name AS quiz_name, category_name, description, creationDate, lastUpdate, user.username, image FROM quiz JOIN user ON user.id_User = quiz.createdBy JOIN category ON quiz.id_category = category.id_category WHERE id_quiz = ?;`,
    'getQuizzes': `SELECT id_quiz, quiz.name AS quiz_name, description, user.username, category_name, image FROM quiz JOIN category ON quiz.id_category = category.id_category JOIN user ON user.id_User = quiz.createdBy = user.id_User WHERE quiz.name LIKE ? AND  (category_name = ? OR ? = 'wszystkie') AND isPublic = 1  ORDER BY quiz.name;`,
  }
function executeQuery(ws, value) {
  value = JSON.parse(value);
  let query = '';
  let params = [];
  if (value.type.toString() in queries) {
    query = queries[value.type.toString()];
    switch (value.type) {
      case 'getQuizzes':
        params = [`%${value.data.quiz_name}%`, value.data.category_name, value.data.category_name];
        break;
      case 'getQuiz':
        params = [`${value.data}`];
        break;
      default:
        if(value.data) {
          params = [`${value.data}`];
        }
        break;
    }
  }
  connection.query(query, params, function (err, results) {
    if (err) {
      console.error('Error executing query:', err);
      ws.send(JSON.stringify({ error: err.message }));
      return;
    }
    ws.send(JSON.stringify(results));
  })
}
