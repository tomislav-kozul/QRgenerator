const express = require('express');
const router = express.Router();
const path = require('path');

// Serve index.html on the root route "/"
router.get('/', (req, res) => {
    console.log("macka")
    res.sendFile(path.join(__dirname, '../pages/index.html'));
});

module.exports = router;