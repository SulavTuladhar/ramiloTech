import authenticate from "./middlewares/authenticate";
import uploader from './middlewares/uploader';

var router = require('express').Router();

var authRouter = require('./modules/auth/auth.router');
var userRouter = require('./modules/user/user.router');
var blogRouter = require('./modules/blog/blog.router');
var commentRouter = require('./modules/comment/comment.router');

router.use('/auth', authRouter)
router.use('/user', authenticate, uploader.single('profile'), userRouter)
router.use('/blog', blogRouter)
router.use('/comment', commentRouter)

module.exports = router;