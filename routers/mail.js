const { Router } = require('express');
const { sendSingupMail, sendPurchaseMail } = require('../controllers/mail');

const mailRouter = new Router();

mailRouter.post('/signup', sendSingupMail);

mailRouter.post('/order', sendPurchaseMail);

module.exports = { mailRouter }