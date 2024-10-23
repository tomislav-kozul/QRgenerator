require('dotenv').config(); // WEB2test!

const express = require('express');
const path = require('path');
const routes = require('./routes/routes');
const api = require('./routes/api');
const ticket = require('./routes/ticket');

require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pages'));

app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.static(path.join(__dirname, 'scripts')));

// Routes
app.use('/api', api);
app.use('/ticket', ticket);
app.use('/', routes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
