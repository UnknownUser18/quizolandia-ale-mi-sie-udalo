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
  multipleStatements: true,
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
    'getQuizzesFromToday': `SELECT id_quiz, quiz.name AS quiz_name, category_name, image FROM quiz JOIN category ON quiz.id_category = category.id_category WHERE DATE(creationDate) = CURDATE() AND isPublic = 1 ORDER BY quiz.name LIMIT 4;`,
    'getQuizzesFromWeekend': `SELECT id_quiz, quiz.name AS quiz_name, category_name, image FROM quiz JOIN category ON quiz.id_category = category.id_category WHERE DATE(creationDate) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND isPublic = 1 ORDER BY quiz.name LIMIT 4;`,
    'insertReport': `INSERT INTO report(id_user, type, description) VALUES (?, ?, ?);`,
    'checkLogin': `SELECT EXISTS (SELECT 1 FROM user WHERE (username = ? OR email = ?) AND password = ?) AS userExists;`,
    'insertUser': `INSERT INTO user (email, username, password, accCreation, avatar) VALUES (?, ?, ?, ?, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.IFpxNz18Dg9hE4nTR_GAgQHaHa%26pid%3DApi&f=1&ipt=cdf1d7913e3aca2929e55cc1be469f595b956c4148e24db30b08360dcc142241'); SET @last_user_id = LAST_INSERT_ID(); INSERT INTO permissions (id_user, name)VALUES (@last_user_id, 'USER'); UPDATE user SET permission = (SELECT id_permissions FROM permissions WHERE name = 'USER' AND id_user = @last_user_id) WHERE id_user = @last_user_id;`,
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
      case 'insertReport':
        params = [`${value.data.id_user}`, `${value.data.type}`, `${value.data.description}`];
        break;
      case 'checkLogin':
        params = [`${value.data.username}`, `${value.data.username}`, `${value.data.password}`];
        break;
      case 'insertUser':
        params = [`${value.data.email}`, `${value.data.username}`, `${value.data.password}`, `${value.data.date_sql}`];
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
