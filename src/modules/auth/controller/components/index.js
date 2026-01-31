const { showRegisterPage, register } = require('./register');
const { showLoginPage, login } = require('./login');
const { logout } = require('./logout');
const { googleAuth, googleCallback } = require('./google');
const { facebookAuth, facebookCallback } = require('./facebook');

module.exports = {
  showRegisterPage,
  register,
  showLoginPage,
  login,
  logout,
  googleAuth,
  googleCallback,
  facebookAuth,
  facebookCallback,
};
