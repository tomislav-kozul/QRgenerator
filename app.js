require('dotenv').config(); // WEB2test!

const express = require('express');
const path = require('path');
const routes = require('./routes/routes');
const api = require('./routes/api');
const ticket = require('./routes/ticket');

const { auth } = require('express-openid-connect');
const app = express();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_USER_SECRET,
  baseURL: 'http://localhost:3000',
  clientID: process.env.AUTH0_USER_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_USER_ISSUER
};

app.use(auth(config));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pages'));

app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.static(path.join(__dirname, 'scripts')));

app.use('/api', api);
app.use('/ticket', ticket);
app.use('/', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
