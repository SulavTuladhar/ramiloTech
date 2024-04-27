var router = require('express').Router();

const authController = require('./auth.controller');

router.route('/login')
    .post(authController.login)

router.route('/register')
    .post(authController.register)

module.exports = router;