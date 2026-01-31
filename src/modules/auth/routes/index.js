const router = require('express').Router();
const controller = require('../controller/components');
const { isGuest, isAuthenticated } = require('../../../shared/middleware/auth.middleware');
const { registerValidationRules, validate: validateRegister } = require('../validators/register.validator');
const { loginValidationRules, validate: validateLogin } = require('../validators/login.validator');

// Register routes
router.get('/register', isGuest, controller.showRegisterPage);
router.post('/register', isGuest, registerValidationRules, validateRegister, controller.register);

// Login routes
router.get('/login', isGuest, controller.showLoginPage);
router.post('/login', isGuest, loginValidationRules, validateLogin, controller.login);

// Logout route
router.get('/logout', isAuthenticated, controller.logout);
router.post('/logout', isAuthenticated, controller.logout);

// Google OAuth routes
router.get('/google', isGuest, controller.googleAuth);
router.get('/google/callback', controller.googleCallback);

// Facebook OAuth routes
router.get('/facebook', isGuest, controller.facebookAuth);
router.get('/facebook/callback', controller.facebookCallback);

module.exports = router;
