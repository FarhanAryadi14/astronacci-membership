module.exports = {
  app: {
    name: 'Astronacci Membership',
    url: process.env.APP_URL || 'http://localhost:3000',
  },

  membership: {
    types: ['A', 'B', 'C'],
    default: 'A',
    limits: {
      A: { articles: 3, videos: 3 },
      B: { articles: 10, videos: 10 },
      C: { articles: Infinity, videos: Infinity },
    },
    names: {
      A: 'Basic',
      B: 'Premium',
      C: 'Unlimited',
    },
    descriptions: {
      A: 'Access to 3 articles and 3 videos',
      B: 'Access to 10 articles and 10 videos',
      C: 'Unlimited access to all content',
    },
    prices: {
      A: 0,
      B: 99000,
      C: 199000,
    },
  },

  pagination: {
    defaultLimit: 12,
    maxLimit: 100,
  },
};
