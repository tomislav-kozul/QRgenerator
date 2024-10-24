require('dotenv').config(); // WEB2test!

const express = require('express');
const path = require('path');
const routes = require('./routes/routes');
const api = require('./routes/api');
const ticket = require('./routes/ticket');

const { auth } = require('express-openid-connect');
const app = express();

const externalUrl = process.env.RENDER_EXTERNAL_URL; // dodano
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 3000; // dodano

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_USER_SECRET,
  //baseURL: 'http://localhost:3000',
  baseURL: externalUrl || `https://localhost:${port}`, // dodano
  clientID: process.env.AUTH0_USER_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_USER_ISSUER
};

app.use(auth(config));

app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'scripts')));

app.use('/api', api);
app.use('/ticket', ticket);
app.use('/', routes);

/*const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});*/ // -> zamijenjeno s novim kodom za render

if (externalUrl) {
  const hostname = '0.0.0.0'; //ne 127.0.0.1
  app.listen(port, hostname, () => {
  console.log(`Server locally running at http://${hostname}:${port}/ and from 
  outside on ${externalUrl}`);
  });
} else {
  https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
  }, app)
  .listen(port, function () {
  console.log(`Server running at https://localhost:${port}/`);
  });
}