var router = require('express').Router();
import authenticate from "../../middlewares/authenticate";

const commentController = require('./comment.controller');

router.route('/:id')
    .post(authenticate, commentController.comment)
    .put(authenticate, commentController.updateComment)
    .delete(authenticate, commentController.deleteComment)

module.exports = router;