const express = require('express');
const path = require('path');
const routes = require('./routes/routes');
const api = require('./routes/api');
const dbClient = require('./pgdatabase'); // Import the client from pgdatabase.js


const app = express();

// Middleware to serve static files from the "pages" folder
app.use(express.static(path.join(__dirname, 'pages')));
app.use(express.static(path.join(__dirname, 'scripts')));

// Routes
app.use('/api', api);
app.use('/', routes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});