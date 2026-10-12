# Web Application Security Project

A simple web app (Node.js + Express + SQLite) that follows security and compliance best practices.

## Security Features
1. **Input validation and sanitization**: express-validator checks name (2-50 characters) and email format. (`server.js`, `/register` route)
2. **SQL injection prevention**: prepared statements are used (`db.prepare(...).run(?, ?)`).
3. **XSS protection**: `.escape()` converts dangerous characters like `<script>` into safe text.
4. **HTTPS**: in production the app redirects HTTP to HTTPS (deployment platforms provide the HTTPS certificate).
5. **Security headers and monitoring**: Helmet adds headers like Content-Security-Policy; Morgan saves request logs in `access.log`.

## How to Run
1. `npm install`
2. `node server.js`
3. Open http://localhost:3000
