const router = require('express').Router();
const controller = require('../controller/components');
const { isAuthenticated } = require('../../../shared/middleware/auth.middleware');
const { profileValidationRules, passwordValidationRules, validate } = require('../validators/profile.validator');

router.get('/profile', isAuthenticated, controller.showProfile);
router.post('/profile', isAuthenticated, profileValidationRules, validate, controller.updateProfile);
router.post('/password', isAuthenticated, passwordValidationRules, validate, controller.updatePassword);

module.exports = router;
