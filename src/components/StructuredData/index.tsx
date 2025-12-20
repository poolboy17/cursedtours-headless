import Head from 'next/head';

const SITE_URL = process.env.NEXT_PUBLIC_URL || 'https://cursedtours.com';
const SITE_NAME = 'Cursed Tours';

interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  imageUrl?: string | null;
  publishedTime: string;
  modifiedTime?: string | null;
  authorName: string;
  section?: string | null;
}

export function ArticleSchema({
  title,
  description,
  url,
  imageUrl,
  publishedTime,
  modifiedTime,
  authorName,
  section,
}: ArticleSchemaProps) {
  // Fix image URL if it's from wp subdomain
  const fixedImageUrl = imageUrl?.includes('wp.cursedtours.com')
    ? `${SITE_URL}/_next/image/?url=${encodeURIComponent(imageUrl)}&w=1200&q=75`
    : imageUrl || `${SITE_URL}/images/hero-ghost-tour.png`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description.replace(/<[^>]*>?/gm, '').substring(0, 160),
    image: fixedImageUrl,
    url: url,
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(section && { articleSection: section }),
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}

interface WebsiteSchemaProps {
  name?: string;
  description?: string;
}

export function WebsiteSchema({ 
  name = SITE_NAME, 
  description = 'Discover the most haunted places, ghost tours, and paranormal experiences worldwide.' 
}: WebsiteSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: name,
    description: description,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search/posts/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}

interface OrganizationSchemaProps {
  name?: string;
  description?: string;
}

export function OrganizationSchema({
  name = SITE_NAME,
  description = 'Discover the most haunted places, ghost tours, and paranormal experiences worldwide.',
}: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: name,
    description: description,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    sameAs: [
      // Add social media URLs here when available
    ],
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}
