const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    const articles = [];
    const topics = [
      { title: 'Getting Started with JavaScript', excerpt: 'Learn the fundamentals of JavaScript programming language.' },
      { title: 'Understanding React Hooks', excerpt: 'Deep dive into React Hooks and how to use them effectively.' },
      { title: 'Node.js Best Practices', excerpt: 'Essential best practices for building scalable Node.js applications.' },
      { title: 'CSS Grid Layout Guide', excerpt: 'Master CSS Grid Layout with practical examples.' },
      { title: 'Introduction to TypeScript', excerpt: 'Why TypeScript is becoming the standard for large applications.' },
      { title: 'Database Design Principles', excerpt: 'Learn how to design efficient and scalable databases.' },
      { title: 'REST API Design Guidelines', excerpt: 'Best practices for designing RESTful APIs.' },
      { title: 'Authentication & Security', excerpt: 'Implementing secure authentication in web applications.' },
      { title: 'Docker for Developers', excerpt: 'Getting started with Docker containerization.' },
      { title: 'Git Version Control Mastery', excerpt: 'Advanced Git techniques for professional developers.' },
      { title: 'Testing Strategies in JavaScript', excerpt: 'Unit testing, integration testing, and E2E testing explained.' },
      { title: 'Performance Optimization Tips', excerpt: 'Techniques to improve your web application performance.' },
      { title: 'Microservices Architecture', excerpt: 'Building scalable applications with microservices.' },
      { title: 'GraphQL vs REST', excerpt: 'Comparing GraphQL and REST for API development.' },
      { title: 'Cloud Deployment Strategies', excerpt: 'Deploying applications to AWS, GCP, and Azure.' },
    ];

    topics.forEach((topic, index) => {
      const slug = topic.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      articles.push({
        id: uuidv4(),
        title: topic.title,
        slug: slug,
        excerpt: topic.excerpt,
        content: `<h2>${topic.title}</h2>
<p>${topic.excerpt}</p>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
<h3>Key Points</h3>
<ul>
  <li>Understanding the basics</li>
  <li>Practical implementation</li>
  <li>Best practices and patterns</li>
  <li>Common pitfalls to avoid</li>
</ul>
<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
<h3>Conclusion</h3>
<p>By following these guidelines, you'll be well on your way to mastering this topic. Remember to practice regularly and stay updated with the latest developments in the field.</p>`,
        thumbnail: `https://picsum.photos/seed/article${index + 1}/800/400`,
        is_published: true,
        published_at: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)),
        view_count: Math.floor(Math.random() * 1000),
        created_at: new Date(),
        updated_at: new Date(),
      });
    });

    await queryInterface.bulkInsert('articles', articles);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('articles', null, {});
  },
};
