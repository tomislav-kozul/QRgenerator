const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/logout', (req, res) => {
    console.log("logout")
    res.oidc.logout();
});
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

module.exports = router;