const { withFaust, getWpHostname } = require('@faustwp/core')
const { createSecureHeaders } = require('next-secure-headers')

// Bundle analyzer for visibility into bundle size (optional)
let withBundleAnalyzer = (config) => config
try {
	withBundleAnalyzer = require('@next/bundle-analyzer')({
		enabled: process.env.ANALYZE === 'true',
	})
} catch (e) {
	// bundle-analyzer not installed, skip
}

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

	// Experimental performance features
	experimental: {
		optimizeCss: true,
		// Optimize imports for tree-shaking heavy packages
		optimizePackageImports: [
			'@heroicons/react',
			'@heroicons/react/24/outline',
			'@heroicons/react/24/solid',
			'@heroicons/react/20/solid',
			'lodash',
			'lodash-es',
			'framer-motion',
			'@headlessui/react',
			'react-icons',
			'date-fns',
		],
	},

	// Compiler optimizations
	compiler: {
		// Remove console.log in production
		removeConsole: process.env.NODE_ENV === 'production' ? {
			exclude: ['error', 'warn'],
		} : false,
	},

	images: {
		// Use modern formats for better compression (saves ~227-534 KiB)
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

	// Webpack optimization for code splitting (reduces unused JS by ~144-166 KiB)
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.optimization.splitChunks = {
				chunks: 'all',
				minSize: 20000,
				maxSize: 244000, // Keep chunks under 244KB for better caching
				cacheGroups: {
					// Default vendor chunk
					defaultVendors: {
						test: /[\\/]node_modules[\\/]/,
						priority: -10,
						reuseExistingChunk: true,
					},
					// Apollo/GraphQL - heavy, load separately
					apollo: {
						test: /[\\/]node_modules[\\/](@apollo|apollo-client|graphql|@graphql)[\\/]/,
						name: 'apollo',
						chunks: 'all',
						priority: 40,
					},
					// Framer Motion - animations can load after initial paint
					framerMotion: {
						test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
						name: 'framer-motion',
						chunks: 'all',
						priority: 30,
					},
					// Headless UI - modals/dropdowns can load lazily
					headlessui: {
						test: /[\\/]node_modules[\\/]@headlessui[\\/]/,
						name: 'headlessui',
						chunks: 'all',
						priority: 30,
					},
					// React ecosystem
					react: {
						test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
						name: 'react',
						chunks: 'all',
						priority: 50,
					},
					// Commons chunk for shared code
					commons: {
						name: 'commons',
						minChunks: 2,
						priority: -20,
						reuseExistingChunk: true,
					},
				},
			}
		}
		return config
	},

	async headers() {
		return [
			{
				// Static assets - cache aggressively
				source: '/:path*.(js|css|woff|woff2|ico|png|jpg|jpeg|webp|avif|svg)',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
				],
			},
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
				],
			},
			// HTML pages - shorter cache with stale-while-revalidate
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
			// Redirect /home to / (SEO - avoid duplicate homepage)
			{
				source: '/home/',
				destination: '/',
				permanent: true,
			},
			{
				source: '/home',
				destination: '/',
				permanent: true,
			},
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
