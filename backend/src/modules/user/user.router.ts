var router = require('express').Router();

const userController = require('./user.controller');

router.route('/')
    .get(userController.fetchUser)
    .put(userController.updateUser)

router.route('/blogs')
    .get(userController.fetchOwnedBlogs)
    
module.exports = router;