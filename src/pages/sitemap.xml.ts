import { GetServerSideProps } from 'next'
import { getServerSideSitemapLegacy } from 'next-sitemap'
import { gql } from '@apollo/client'
import { getApolloClient } from '@faustwp/core'

const client = getApolloClient()

const SITEMAP_QUERY = gql`
	query SitemapQuery($after: String) {
		contentNodes(
			where: { contentTypes: [POST, PAGE] }
			first: 50
			after: $after
		) {
			pageInfo {
				hasNextPage
				endCursor
			}
			nodes {
				uri
				modifiedGmt
			}
		}
	}
`

const CATEGORIES_QUERY = gql`
	query CategoriesQuery {
		categories(first: 100) {
			nodes {
				uri
			}
		}
	}
`

async function getAllWPContent(after = null, acc: any[] = []) {
	const { data } = await client.query({
		query: SITEMAP_QUERY,
		variables: { after },
	})

	acc = [...acc, ...data.contentNodes.nodes]

	if (data.contentNodes.pageInfo.hasNextPage) {
		acc = await getAllWPContent(data.contentNodes.pageInfo.endCursor, acc)
	}

	return acc
}

async function getAllCategories() {
	const { data } = await client.query({
		query: CATEGORIES_QUERY,
	})
	return data.categories.nodes
}

// Sitemap component (required but unused)
export default function Sitemap() {}

// Collect all posts, pages, and categories
export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const BASE_URL = process.env.NEXT_PUBLIC_URL || 'https://cursedtours.com'

	// Get all posts and pages
	const contentNodes = await getAllWPContent()
	
	// Get all categories
	const categories = await getAllCategories()

	const allRoutes = [
		// Posts and pages
		...contentNodes
			.filter((node: any) => node.uri)
			.map((node: any) => ({
				loc: `${BASE_URL}${node.uri}`,
				lastmod: node.modifiedGmt ? new Date(node.modifiedGmt).toISOString() : undefined,
				changefreq: 'daily' as const,
				priority: 0.8,
			})),
		// Categories
		...categories
			.filter((cat: any) => cat.uri)
			.map((cat: any) => ({
				loc: `${BASE_URL}${cat.uri}`,
				changefreq: 'weekly' as const,
				priority: 0.6,
			})),
	]

	return getServerSideSitemapLegacy(ctx, allRoutes)
}
