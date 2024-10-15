const express = require('express');
const router = express.Router();
const dbClient = require('../pgdatabase'); 

router.use(express.json());

router.get('/qrcodes/count', async (req, res) => {
    try {
        const result = await dbClient.query('SELECT COUNT(*) FROM codes');
        res.json({ count: result.rows[0].count });
    } catch (err) {
        res.status(500).json({ error: 'An error occured while fetching total number of generated QR codes' });
    }
});

router.post('/generate-code', async (req, res) => {
    if (req.body === undefined) {
        return res.status(400).json({ error: 'Invalid request!' });
    }

    const { vatin, firstName, lastName } = req.body;

    if (!vatin || !firstName || !lastName) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    try {
        // provjeri koliki je count
        const countQuery = 'SELECT COUNT(*) FROM codes WHERE vat = $1';
        const countResponse = await dbClient.query(countQuery, [vatin]);
        const countInt = parseInt(countResponse.rows[0].count);

        // ovdje je problem jer imamo previse kodova
        if (countInt > 2) {
            return res.status(400).json({ error: `No more QR codes are left for vat ${vatin}` });
        }
        // ako je 0 dodaj usera
        if (countInt === 0) {
            const addUserQuery = 'INSERT INTO users VALUES ($1, $2, $3)';
            // ne bi trebao - ali ako se desi slučaj da user postoji u bazi, a da nisu generirani kodovi
            try {
                const addUserResponse = await dbClient.query(addUserQuery, [vatin, firstName, lastName])
            } catch (err) {
                // ignore
            }
        } 
        // samo generiraj kod u vrati ga di i treba bit
        const generateCodeQuery = 'INSERT INTO codes (vat) VALUES ($1) RETURNING id';
        const generateCodeResponse = await dbClient.query(generateCodeQuery, [vatin])
        const generateCodeId = generateCodeResponse.rows[0].id;

        const codesLeft = 3 - 1 - countInt;
        
        return res.status(200).json({
            id: generateCodeId,
            left: codesLeft
        });
        
    } catch (err) {
        return res.status(500).json({ error: 'Server error while generating code' });
    }
});

module.exports = router;