/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_URL || 'https://cursedtours.com',
  generateRobotsTxt: true,
  // Disable default sitemap generation - WordPress handles sitemaps
  generateIndexSitemap: false,
  exclude: ['/**'], // Exclude all pages from next-sitemap generation
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/preview/',
          '/edit/',
          '/login/',
          '/sign-up/',
          '/reset-password/',
          '/submission/',
          '/readinglist/',
          '/blog/',
          '/*?page=*',
          '/*?s=*',
          '/*?q=*',
          '/page/',
          '/*/page/',
        ],
      },
      // Block AI crawlers from training on content
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'Google-Extended',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        disallow: '/',
      },
      {
        userAgent: 'Claude-Web',
        disallow: '/',
      },
      {
        userAgent: 'cohere-ai',
        disallow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        disallow: '/',
      },
    ],
    // Point directly to WordPress sitemap - industry standard for headless WP
    additionalSitemaps: [
      'https://wp.cursedtours.com/sitemap_index.xml',
    ],
  },
}
