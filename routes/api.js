const express = require('express');
const router = express.Router();
const dbClient = require('../pgdatabase'); 

router.get('/qrcodes/count', async (req, res) => {
    try {
        const result = await dbClient.query('SELECT COUNT(*) FROM codes');
        res.json({ count: result.rows[0].count });
    } catch (err) {
        res.status(500).send('An error occured while fetching total number of generated QR codes');
    }
});

module.exports = router;