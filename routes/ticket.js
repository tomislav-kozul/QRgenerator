const express = require('express');
const router = express.Router();
const dbClient = require('../pgdatabase'); 
const { requiresAuth } = require('express-openid-connect');

router.use(express.json()); 

router.get('/:ticketID', requiresAuth(), async (req, res) => {
    const userID = req.oidc.user.name;
    const ticketID = req.params.ticketID;

    try {
        const ticketDataQuery = 'SELECT * FROM codes INNER JOIN users ON codes.vat = users.vat WHERE codes.id = $1';
        const ticketDataResponse = await dbClient.query(ticketDataQuery, [ticketID]);
        const rowsCount = parseInt(ticketDataResponse.rows.length);
        if (rowsCount === 0) {
            err_msg = "Ticked ID not found";
            return res.status(404).render('error', { message: err_msg, user: userID });
        } else {
            const ticketData = ticketDataResponse.rows[0]
            return res.render('ticket', { ticketData, user: userID });
        }
    } catch (err) {
        err_msg = "Invalid ticket URL"
        return res.status(400).render('error', { message: err_msg, user: userID });
    }
});

module.exports = router;