import { getWordPressProps, WordPressTemplate } from '@faustwp/core'
import { GetStaticProps } from 'next'
import { WordPressTemplateProps } from '../types'
import { REVALIDATE_TIME } from '@/contains/contants'

export default function Page(props: WordPressTemplateProps) {
	return <WordPressTemplate {...props} />
}

export async function getStaticPaths() {
	const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL?.replace(/\/$/, '')
	
	try {
		// Fetch only the 10 most recent posts and all categories
		// This keeps build-time requests low to avoid rate limiting
		const [postsRes, categoriesRes] = await Promise.all([
			fetch(`${wpUrl}/wp-json/wp/v2/posts?per_page=10&_fields=slug`),
			fetch(`${wpUrl}/wp-json/wp/v2/categories?per_page=20&_fields=slug`),
		])

		const posts = postsRes.ok ? await postsRes.json() : []
		const categories = categoriesRes.ok ? await categoriesRes.json() : []

		const paths = [
			// Pre-generate all category pages (important for SEO)
			...categories.map((cat: { slug: string }) => ({
				params: { wordpressNode: ['category', cat.slug] },
			})),
			// Pre-generate 10 most recent posts
			...posts.map((post: { slug: string }) => ({
				params: { wordpressNode: [post.slug] },
			})),
		]

		return {
			paths,
			// Other pages generate on first visit, then cache
			fallback: 'blocking',
		}
	} catch (error) {
		console.error('Error fetching paths:', error)
		// If WordPress is down, build succeeds and pages generate on-demand
		return {
			paths: [],
			fallback: 'blocking',
		}
	}
}

export const getStaticProps: GetStaticProps = (ctx) => {
	return getWordPressProps({ ctx, revalidate: REVALIDATE_TIME })
}
