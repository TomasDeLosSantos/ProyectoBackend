const express = require('express');
const { Router } = express;
const { postOrder } = require('../controllers/order');

const orderRouter = new Router();

orderRouter.post('/', postOrder);

module.exports = { orderRouter };