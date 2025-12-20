import Head from "next/head";
import { useRouter } from "next/router";

// Site constants
const SITE_URL = process.env.NEXT_PUBLIC_URL || 'https://cursedtours.com';
const SITE_NAME = 'Cursed Tours';

interface Props {
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  url?: string | null;
  type?: 'website' | 'article';
  publishedTime?: string | null;
  modifiedTime?: string | null;
  author?: string | null;
  section?: string | null;
}

/**
 * Provide SEO related meta tags to a page.
 */
export default function SEO({ 
  title, 
  description, 
  imageUrl, 
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
}: Props) {
  const router = useRouter();
  
  // Build canonical URL from router if not provided - clean any whitespace/newlines
  const canonicalUrl = (url || `${SITE_URL}${router.asPath.split('?')[0]}`).replace(/\s+/g, '');
  
  // Fix image URL - ensure it uses frontend domain for proxied images
  const fixedImageUrl = imageUrl 
    ? imageUrl.includes('wp.cursedtours.com') 
      ? `${SITE_URL}/_next/image/?url=${encodeURIComponent(imageUrl)}&w=1200&q=75`
      : imageUrl
    : `${SITE_URL}/images/hero-ghost-tour.png`; // Default OG image

  const descriptionNoHtmlTags = description?.replace(/<[^>]*>?/gm, "").trim() || "";
  
  // Fix title - remove trailing " - " if site name is empty
  const cleanTitle = title?.replace(/ - $/, '') || SITE_NAME;

  return (
    <>
      <Head>
        {/* Basic Meta */}
        <title>{cleanTitle}</title>
        <meta name="title" content={cleanTitle} />
        {descriptionNoHtmlTags && (
          <meta name="description" content={descriptionNoHtmlTags} />
        )}
        
        {/* Canonical URL - Critical for SEO */}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:type" content={type} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={cleanTitle} />
        {descriptionNoHtmlTags && (
          <meta property="og:description" content={descriptionNoHtmlTags} />
        )}
        <meta property="og:image" content={fixedImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Article-specific OG tags */}
        {type === 'article' && publishedTime && (
          <meta property="article:published_time" content={publishedTime} />
        )}
        {type === 'article' && modifiedTime && (
          <meta property="article:modified_time" content={modifiedTime} />
        )}
        {type === 'article' && author && (
          <meta property="article:author" content={author} />
        )}
        {type === 'article' && section && (
          <meta property="article:section" content={section} />
        )}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@cursedtours" />
        <meta name="twitter:title" content={cleanTitle} />
        {descriptionNoHtmlTags && (
          <meta name="twitter:description" content={descriptionNoHtmlTags} />
        )}
        <meta name="twitter:image" content={fixedImageUrl} />
      </Head>
    </>
  );
}
