const axios = require('axios').create({
    baseURL: process.env.SERVER_URL || 'http://localhost:3000/'
});

module.exports = axios;