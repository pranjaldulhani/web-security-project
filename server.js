const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const Database = require('better-sqlite3');
const { body, validationResult } = require('express-validator');

const app = express();
const db = new Database('users.db');
db.exec('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)');

// Step 4: HTTPS redirect (production mein)
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
});

// Step 5: Security headers + monitoring (logs)
app.use(helmet());
app.use(morgan('combined', { stream: fs.createWriteStream('access.log', { flags: 'a' }) }));

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Step 1 + 3: Validation, sanitization, XSS protection (escape)
app.post('/register',
  body('name').trim().isLength({ min: 2, max: 50 }).escape(),
  body('email').trim().isEmail().normalizeEmail(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send('Invalid input');

    // Step 2: Prepared statement (SQL injection se bachav)
    db.prepare('INSERT INTO users (name, email) VALUES (?, ?)')
      .run(req.body.name, req.body.email);
    res.send('User registered safely!');
  });

app.listen(process.env.PORT || 3000, () => console.log('Running on port 3000'));