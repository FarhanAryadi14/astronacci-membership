const express = require('express');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

const logger = require('./shared/utils/logger');
const { errorHandler, notFoundHandler } = require('./shared/middleware/error.middleware');

// Import routes
const authRoutes = require('./modules/auth/routes');
const userRoutes = require('./modules/user/routes');
const articleRoutes = require('./modules/article/routes');
const videoRoutes = require('./modules/video/routes');
const membershipRoutes = require('./modules/membership/routes');
const dashboardRoutes = require('./modules/dashboard/routes');

// Initialize passport config
require('./shared/config/passport');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com"],
    },
  },
}));

// Request logging
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) },
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));

// Flash messages
app.use(flash());

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Global variables for views
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.appName = 'Astronacci Membership';
  next();
});

// Routes
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard');
  }
  res.render('home', { title: 'Welcome' });
});

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/articles', articleRoutes);
app.use('/videos', videoRoutes);
app.use('/membership', membershipRoutes);
app.use('/dashboard', dashboardRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
