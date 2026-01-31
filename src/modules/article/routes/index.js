const router = require('express').Router();
const controller = require('../controller/components');
const { isAuthenticated } = require('../../../shared/middleware/auth.middleware');
const asyncHandler = require('../../../shared/utils/async-handler');

router.get('/', isAuthenticated, asyncHandler(controller.list));
router.get('/:slug', isAuthenticated, asyncHandler(controller.detail));

module.exports = router;
