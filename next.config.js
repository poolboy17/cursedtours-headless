const { withFaust, getWpHostname } = require('@faustwp/core')
const { createSecureHeaders } = require('next-secure-headers')

// Bundle analyzer for visibility into bundle size
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
	trailingSlash: true,
	reactStrictMode: true,
	typedRoutes: false,
	allowedDevOrigins: ['*.replit.dev', '*.repl.co', '127.0.0.1', 'localhost'],
	devIndicators: false,

	// Performance optimizations
	compress: true,
	poweredByHeader: false,
	// Note: swcMinify is enabled by default in Next.js 15+

	// Experimental performance features
	experimental: {
		optimizeCss: true,
		optimizePackageImports: [
			'@heroicons/react',
			'lodash',
			'framer-motion',
		],
	},

	images: {
		// Use modern formats for better compression
		formats: ['image/avif', 'image/webp'],
		// Optimize image sizing
		deviceSizes: [640, 750, 828, 1080, 1200, 1920],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		// Minimize image processing overhead
		minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'http',
				hostname: getWpHostname(),
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: getWpHostname(),
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: '0.gravatar.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: '1.gravatar.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: '2.gravatar.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: '3.gravatar.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'secure.gravatar.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'images.pexels.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
				port: '',
				pathname: '/**',
			},
			// Viator/TripAdvisor CDN for tour images
			{
				protocol: 'https',
				hostname: 'media-cdn.tripadvisor.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'hare-media-cdn.tripadvisor.com',
				port: '',
				pathname: '/**',
			},
			// from env
			{
				protocol: 'https',
				hostname:
					process.env.NEXT_PUBLIC_IMAGE_REMOTE_HOSTNAME_1 || '1.gravatar.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname:
					process.env.NEXT_PUBLIC_IMAGE_REMOTE_HOSTNAME_2 || '1.gravatar.com',
				port: '',
				pathname: '/**',
			},
		],
	},

	// Webpack optimization for code splitting
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.optimization.splitChunks = {
				...config.optimization.splitChunks,
				cacheGroups: {
					...config.optimization.splitChunks?.cacheGroups,
					// Separate heavy libraries into their own chunks
					apollo: {
						test: /[\\/]node_modules[\\/](@apollo|apollo-client)[\\/]/,
						name: 'apollo',
						chunks: 'all',
						priority: 30,
					},
					framerMotion: {
						test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
						name: 'framer-motion',
						chunks: 'all',
						priority: 30,
					},
				},
			}
		}
		return config
	},

	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					...createSecureHeaders({
						xssProtection: false,
						frameGuard: [
							'allow-from',
							{ uri: process.env.NEXT_PUBLIC_WORDPRESS_URL },
						],
					}),
					// Cache static assets aggressively
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
				],
			},
			// HTML pages - shorter cache
			{
				source: '/',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=0, s-maxage=86400, stale-while-revalidate=86400',
					},
				],
			},
			// Add noindex for tag pagination pages
			{
				source: '/tag/:tag/page/:num/',
				headers: [
					{
						key: 'X-Robots-Tag',
						value: 'noindex, nofollow',
					},
				],
			},
			// Add noindex for category pagination pages
			{
				source: '/category/:cat/page/:num/',
				headers: [
					{
						key: 'X-Robots-Tag',
						value: 'noindex, nofollow',
					},
				],
			},
		]
	},
	async redirects() {
		return [
			// Redirect /blog/ to /posts/
			{
				source: '/blog/',
				destination: '/posts/',
				permanent: true,
			},
			{
				source: '/blog',
				destination: '/posts/',
				permanent: true,
			},
			// Redirect www to non-www
			{
				source: '/:path*',
				has: [
					{
						type: 'host',
						value: 'www.cursedtours.com',
					},
				],
				destination: 'https://cursedtours.com/:path*',
				permanent: true,
			},
		]
	},
}

module.exports = withBundleAnalyzer(withFaust(nextConfig))
