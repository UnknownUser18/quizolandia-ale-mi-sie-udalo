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
    'getCategoryName': 'SELECT category_name, id_category FROM category;',
    'addComment': `INSERT INTO comments (id_user, id_quiz, content, publicTime, stars) VALUES (?, ?, ?, ?, ?);`,
    'getUserID': `SELECT id_user FROM user WHERE username = ? AND password = ?;`,
    'getCommentsFromQuiz': 'SELECT id_comment, username, content, publicTime, avatar, stars FROM comments JOIN user ON comments.id_user = user.id_user WHERE id_quiz = ? ORDER BY publicTime DESC, username;',
    'checkUser': `SELECT EXISTS (SELECT 1 FROM user WHERE (username = ?) AND password = ?) AS userExists;`,
    'getQuizName': `SELECT name as quiz_name, difficulty FROM quiz WHERE id_quiz = ?;`,
    'getQuestions': `SELECT id_questions, index_quiz, question, type, multipleChoice, correctAnswers, hint FROM questions JOIN quiz ON quiz.id_quiz = questions.id_quiz WHERE quiz.id_quiz = ?;`,
    'getAnswers': `SELECT id_question, id_answer, index_answer, answer_name FROM answers JOIN questions ON questions.id_questions = answers.id_question JOIN quiz ON quiz.id_quiz = questions.id_quiz WHERE quiz.id_quiz = ?;`,
    'getQuiz': `SELECT quiz.name AS quiz_name, category_name, quiz.description, creationDate, lastUpdate, user.username, image, user.id_User FROM quiz JOIN user ON user.id_User = quiz.createdBy JOIN category ON quiz.id_category = category.id_category WHERE id_quiz = ?;`,
    'getQuizzes': `SELECT id_quiz, quiz.name AS quiz_name, quiz.description, user.username, category_name, image FROM quiz JOIN category ON quiz.id_category = category.id_category JOIN user ON user.id_User = quiz.createdBy = user.id_User WHERE quiz.name LIKE ? AND  (category_name IN(?) OR ? = 'wszystkie') AND isPublic = 1  ORDER BY quiz.name;`,
    'getQuizzesFromToday': `SELECT id_quiz, quiz.name AS quiz_name, category_name, image FROM quiz JOIN category ON quiz.id_category = category.id_category WHERE DATE(creationDate) = CURDATE() AND isPublic = 1 ORDER BY quiz.name LIMIT 4;`,
    'getQuizzesFromWeekend': `SELECT id_quiz, quiz.name AS quiz_name, category_name, image FROM quiz JOIN category ON quiz.id_category = category.id_category WHERE DATE(creationDate) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) AND isPublic = 1 ORDER BY quiz.name LIMIT 4;`,
    'insertReport': `INSERT INTO report(id_user, type, description) VALUES (?, ?, ?);`,
    'checkLogin': `SELECT EXISTS (SELECT 1 FROM user WHERE (username = ? OR email = ?) AND password = ?) AS userExists;`,
    'insertUser': `INSERT INTO user (email, username, password, accCreation, avatar) VALUES (?, ?, ?, ?, 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.IFpxNz18Dg9hE4nTR_GAgQHaHa%26pid%3DApi&f=1&ipt=cdf1d7913e3aca2929e55cc1be469f595b956c4148e24db30b08360dcc142241'); SET @last_user_id = LAST_INSERT_ID(); INSERT INTO permissions (id_user, name)VALUES (@last_user_id, 'USER'); UPDATE user SET permission = (SELECT id_permissions FROM permissions WHERE name = 'USER' AND id_user = @last_user_id) WHERE id_user = @last_user_id;`,
    'getUser': `SELECT u.username, u.avatar, u.nationality, u.accCreation, COUNT(q.id_quiz) AS quiz_count FROM user u LEFT JOIN quiz q ON q.createdBy = u.id_User WHERE username = ?;`,
    'getLeaderboard': `SELECT u.id_User, u.username, u.nationality, u.avatar, MAX(s.score) AS score, MIN(s.solveTime) AS solveTime FROM user u JOIN solve s ON u.id_User = s.id_user WHERE s.id_quiz = ? AND s.isPublic = 1 GROUP BY u.username, u.nationality, u.avatar ORDER BY score DESC, solveTime LIMIT 10;`,
    'insertSolve': `INSERT INTO solve (id_quiz, id_user, score, solveTime, isPublic) VALUES (?, ?, ?, ?, ?);`,
  }
function executeQuery(ws, value) {
  value = JSON.parse(value);
  let query = '';
  let params = [];
  if (value.type.toString() in queries) {
    query = queries[value.type.toString()];
    switch (value.type) {
      case 'getQuizzes':
        let categories = value.params.category_name;
        if (typeof categories === 'string') {
          categories = categories === 'wszystkie' ? [] : categories.split(',')
        }
        params = [`%${value.params.quiz_name}%`, categories.length ? categories : ['wszystkie'], value.params.category_name];
        break;
      case 'checkLogin':
        params = [value.params.username, value.params.username, value.params.password];
        break;
      case 'addComment':
        params = [value.params.id_user, value.params.id_quiz, value.params.content, value.params.publicTime, value.params.stars];
        break;
      case 'checkUser':
        params = [value.params.username, value.params.password];
        break;
      case 'insertSolve':
        params = [value.params.id_quiz, value.params.id_user, value.params.score, value.params.solveTime, value.params.isPublic];
        break;
      default:
        params = value ? Object.values(value.params) : {} || [];
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
