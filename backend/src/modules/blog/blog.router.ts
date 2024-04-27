import authenticate from "../../middlewares/authenticate";
import uploader from '../../middlewares/uploader';

var router = require('express').Router();

const blogController = require('./blog.controller');
var restrictTo = require('../../middlewares/restrictTo');

router.route('/')
    .get(blogController.fetchAllblogs)
    .post(authenticate, uploader.single('blog'), blogController.createBlog)

router.route('/search')
    .post(blogController.searchBlog)

// Tags Routes
router.route('/tag')
    .get(blogController.fetchAllTags)
    .post(authenticate, restrictTo.restrictTo('admin'), blogController.createTag)

router.route('/tag/:id')
    .delete(authenticate, restrictTo.restrictTo('admin'), blogController.deleteTag)

// Category Routes
router.route('/category')
    .get(blogController.fetchAllCategories)
    .post(authenticate, restrictTo.restrictTo('admin'), blogController.createCategory)

router.route('/category/:id')
    .get(blogController.fetchBlogByCat)
    .delete(authenticate, restrictTo.restrictTo('admin'), blogController.deleteCategory)

// blogs routes with params
router.route('/:id')
    .get(blogController.fetchBlog)
    .put(authenticate, uploader.single('blog'), blogController.updateBlog)
    .delete(authenticate, blogController.deleteBlog)


module.exports = router;