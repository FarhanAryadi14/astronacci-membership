# Astronacci Membership Application

A full-stack membership application built with Express.js, MySQL, and Tailwind CSS. Features OAuth authentication (Google & Facebook), manual registration/login, and tiered membership access control.

## Features

- **Authentication**
  - Manual Register & Login with email/password
  - OAuth Login with Google
  - OAuth Login with Facebook
  - Session-based authentication with Passport.js

- **Membership Tiers**
  - **Type A (Basic)**: Access to 3 articles and 3 videos
  - **Type B (Premium)**: Access to 10 articles and 10 videos
  - **Type C (Unlimited)**: Access to all articles and videos

- **Content Management**
  - Articles with rich content
  - Video tutorials with embedded players
  - Access control based on membership tier

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL with Sequelize ORM
- **Frontend**: EJS Templates, Tailwind CSS v3, Alpine.js
- **Authentication**: Passport.js (Local, Google, Facebook strategies)
- **Logging**: Winston


## Prerequisites

- Node.js v16+
- MySQL 5.7+ or 8.0
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd astronacci-skiltest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create MySQL database**
   ```sql
   CREATE DATABASE astronacci_membership;
   ```

4. **Configure environment variables**
   Edit `.env` with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   APP_URL=http://localhost:3000

   SESSION_SECRET=your-super-secret-session-key

   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=astronacci_membership
   DB_USER=root
   DB_PASSWORD=your-password

   # OAuth (see OAUTH_SETUP.md for instructions)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

   FACEBOOK_APP_ID=your-facebook-app-id
   FACEBOOK_APP_SECRET=your-facebook-app-secret
   FACEBOOK_CALLBACK_URL=http://localhost:3000/auth/facebook/callback
   ```

5. **Build Tailwind CSS**
   ```bash
   npm run css:build
   ```

6. **Run database seeders** (optional, for demo data)
   ```bash
   npm run db:seed
   ```

7. **Start the application**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

8. **Open browser**
   ```
   http://localhost:3000
   ```

## Demo Accounts

After running seeders, you can use these accounts:

| Email | Password | Membership |
|-------|----------|------------|
| admin@astronacci.com | password123 | Unlimited (C) |
| user.a@example.com | password123 | Basic (A) |
| user.b@example.com | password123 | Premium (B) |
| user.c@example.com | password123 | Unlimited (C) |

## License

MIT
