const express = require('express');
const router = express.Router();

const controller = require('../controller/mchat-controller');

module.exports = (connection) => {

    const { get } = controller(connection);

    router.get('/posts', get);

    return router;
}