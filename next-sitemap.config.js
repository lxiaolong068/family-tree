/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.family-tree.cc',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://www.family-tree.cc/server-sitemap.xml',
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/*', '/admin/*'],
      },
    ],
  },
  exclude: ['/api/*', '/admin/*'],
  // Priority and changefreq for specific pages
  transform: async (config, path) => {
    // Custom priority for specific pages
    let priority = 0.7;
    let changefreq = 'weekly';

    // Home page
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    }
    
    // How to make a family tree guide
    if (path === '/how-to-make-a-family-tree/') {
      priority = 0.9;
      changefreq = 'weekly';
    }
    
    // Generator page
    if (path === '/generator/') {
      priority = 0.8;
      changefreq = 'weekly';
    }
    
    // Templates page
    if (path === '/templates/') {
      priority = 0.8;
      changefreq = 'weekly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs || [],
    };
  },
};
