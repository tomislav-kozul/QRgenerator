const axios = require('axios');
require('dotenv').config();

const getToken = async () => {
    try {
        const response = await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            audience: process.env.AUTH0_AUDIENCE,
            grant_type: 'client_credentials'
        });
        return response.data.access_token;
    } catch (error) {
        throw new Error('Error occurred while fetching access token');
    }
};

module.exports = { getToken };