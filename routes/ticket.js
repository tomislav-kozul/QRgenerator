const express = require('express');
const router = express.Router();
const dbClient = require('../pgdatabase'); 
require('dotenv').config();
const { auth } = require('express-oauth2-jwt-bearer');


router.use(express.json()); 

const checkJwt = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
    tokenSigningAlg: 'RS256'
});

router.get('/:ticketID', checkJwt, async (req, res) => {
    const userInfo = req.auth;
    const ticketID = req.params.ticketID;

    try {
        const ticketDataQuery = 'SELECT * FROM codes INNER JOIN users ON codes.vat = users.vat WHERE codes.id = $1';
        const ticketDataResponse = await dbClient.query(ticketDataQuery, [ticketID]);
        const rowsCount = parseInt(ticketDataResponse.rows.length);
        if (rowsCount === 0) {
            err_msg = "Ticked ID not found";
            return res.status(404).render('error', { message: err_msg });
        } else {
            const ticketData = ticketDataResponse.rows[0]
            const usernameURL = 'https://' + process.env.AUTH0_DOMAIN + '/username'
            const username = userInfo.claims[usernameURL];
            console.log(username)
            console.log("username")
            return res.render('ticket', { ticketData, username });
        }
    } catch (err) {
        err_msg = "Invalid ticket URL"
        return res.status(400).render('error', { message: err_msg });
    }
});

module.exports = router;