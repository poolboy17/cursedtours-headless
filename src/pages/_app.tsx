import '@/../faust.config'
import React from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { FaustProvider } from '@faustwp/core'
import '@/styles/globals.css'
import '@/styles/index.scss'
import { AppProps } from 'next/app'
import { WordPressBlocksProvider, fromThemeJson } from '@faustwp/blocks'
import blocks from '@/wp-blocks'
import { Poppins } from 'next/font/google'
import SiteWrapperProvider from '@/container/SiteWrapperProvider'
import themeJson from '@/../theme.json'

// Lazy load non-critical components to reduce TBT and unused JS (~144KB savings)
const Toaster = dynamic(
	() => import('react-hot-toast').then(mod => mod.Toaster),
	{ ssr: false }
)
const NextNProgress = dynamic(() => import('nextjs-progressbar'), { ssr: false })
const GoogleAnalytics = dynamic(
	() => import('nextjs-google-analytics').then(mod => mod.GoogleAnalytics),
	{ ssr: false }
)

// Optimize font loading - reduced from 5 weights to 2 (saves ~60KB)
// Using swap ensures text is visible immediately with fallback font
const poppins = Poppins({
	subsets: ['latin'],
	display: 'swap',
	weight: ['400', '600'],
	preload: true,
	fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
	adjustFontFallback: true, // Auto-adjust fallback for less CLS
})

export default function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter()

	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
			</Head>
			
			{/* Defer analytics until after page loads */}
			<GoogleAnalytics trackPageViews />

			<FaustProvider pageProps={pageProps}>
				<WordPressBlocksProvider
					config={{
						blocks,
						theme: fromThemeJson(themeJson),
					}}
				>
					<SiteWrapperProvider {...pageProps}>
						<style jsx global>{`
							html {
								font-family: ${poppins.style.fontFamily};
							}
						`}</style>
						<NextNProgress 
							color="#818cf8" 
							options={{ showSpinner: false }} // Disable spinner for less JS
						/>
						<Component {...pageProps} key={router.asPath} />
						<Toaster
							position="bottom-left"
							toastOptions={{
								style: {
									fontSize: '14px',
									borderRadius: '0.75rem',
								},
							}}
							containerClassName="text-sm"
						/>
					</SiteWrapperProvider>
				</WordPressBlocksProvider>
			</FaustProvider>
		</>
	)
}
