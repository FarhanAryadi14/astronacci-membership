const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    const videos = [];
    const videoTopics = [
      { title: 'JavaScript Crash Course', description: 'Complete JavaScript tutorial for beginners.', duration: 3600 },
      { title: 'React Tutorial for Beginners', description: 'Learn React from scratch with practical examples.', duration: 5400 },
      { title: 'Node.js Full Course', description: 'Build backend applications with Node.js.', duration: 7200 },
      { title: 'CSS Flexbox in 20 Minutes', description: 'Master CSS Flexbox layout quickly.', duration: 1200 },
      { title: 'TypeScript Fundamentals', description: 'Getting started with TypeScript.', duration: 2700 },
      { title: 'MongoDB Basics', description: 'Introduction to MongoDB database.', duration: 1800 },
      { title: 'Express.js Crash Course', description: 'Build REST APIs with Express.js.', duration: 2400 },
      { title: 'JWT Authentication Tutorial', description: 'Implement JWT authentication in Node.js.', duration: 1500 },
      { title: 'Docker Basics for Developers', description: 'Learn Docker containerization basics.', duration: 3000 },
      { title: 'Git & GitHub Tutorial', description: 'Version control with Git and GitHub.', duration: 2100 },
      { title: 'Unit Testing with Jest', description: 'Write unit tests using Jest framework.', duration: 1800 },
      { title: 'Web Performance Optimization', description: 'Optimize your website for speed.', duration: 2400 },
      { title: 'Microservices with Node.js', description: 'Building microservices architecture.', duration: 4500 },
      { title: 'GraphQL Complete Guide', description: 'Learn GraphQL from basics to advanced.', duration: 3600 },
      { title: 'AWS for Beginners', description: 'Getting started with Amazon Web Services.', duration: 5400 },
    ];

    // Sample YouTube video IDs for demo
    const youtubeIds = [
      'W6NZfCO5SIk', 'Ke90Tje7VS0', 'TlB_eWDSMt4', 'JJSoEo8JSnc', 'BwuLxPH8IDs',
      'pTFZFxd4hOI', 'L72fhGm1tfE', '7Q17ubqLfaM', 'fqMOX6JJhGo', 'RGOj5yH7evk',
      'FLvvgyuoY2s', 'AkGYPsA3Y1o', 'CdBtNQZH8a4', 'ed8SzALpx1Q', 'ulprqHHWlng',
    ];

    videoTopics.forEach((topic, index) => {
      const slug = topic.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      videos.push({
        id: uuidv4(),
        title: topic.title,
        slug: slug,
        description: topic.description,
        url: `https://www.youtube.com/embed/${youtubeIds[index]}`,
        thumbnail: `https://img.youtube.com/vi/${youtubeIds[index]}/maxresdefault.jpg`,
        duration: topic.duration,
        is_published: true,
        published_at: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)),
        view_count: Math.floor(Math.random() * 5000),
        created_at: new Date(),
        updated_at: new Date(),
      });
    });

    await queryInterface.bulkInsert('videos', videos);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('videos', null, {});
  },
};
