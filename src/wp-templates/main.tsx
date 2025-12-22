import { gql } from '@/__generated__'
import { NcgeneralSettingsFieldsFragmentFragment, MainPageQueryQuery } from '@/__generated__/graphql'
import PageLayout from '@/container/PageLayout'
import { PostDataFragmentType } from '@/data/types'
import { FaustTemplate } from '@faustwp/core'
import { TPostCard } from '@/components/Card2/Card2'
import useGetPostsNcmazMetaByIds from '@/hooks/useGetPostsNcmazMetaByIds'
import GridPostsArchive from '@/components/GridPostsArchive'
import SectionHeroBranded from '@/components/Sections/SectionHeroBranded'
import SectionMagazine1 from '@/components/Sections/SectionMagazine1'
import Heading from '@/components/Heading/Heading'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { WebsiteSchema, OrganizationSchema } from '@/components/StructuredData'
import { TCategoryCardFull } from '@/components/CardCategory1/CardCategory1'
import CategoryGridStatic from '@/components/CategoryGridStatic'
import { FOOTER_LOCATION, PRIMARY_LOCATION } from '@/contains/menu'

// Constants
const MAGAZINE_POST_COUNT = 4
const GRID_POST_COUNT = 8

// Homepage SEO meta description
const HOME_META_DESCRIPTION = 'Discover the most haunted places, ghost tours, and paranormal experiences worldwide. Explore spine-chilling stories, haunted locations, and book your next supernatural adventure with Cursed Tours.'

const Main: FaustTemplate<MainPageQueryQuery> = (props) => {
	// Data is now fetched at build time via SSR - no client-side loading needed!
	const allPosts = (props.data?.posts?.nodes || []) as PostDataFragmentType[]

	// Filter categories for homepage display per §4 UI PROMOTION rules:
	// 1. Exclude Historical Hauntings (junk drawer category ID 378)
	// 2. Only show categories WITH images (no placeholders)
	// 3. Limit to top 8 by post count
	const categories = ((props.data?.categories?.nodes || []) as TCategoryCardFull[])
		.filter(cat => cat.databaseId !== 378)
		.filter(cat => !!cat.ncTaxonomyMeta?.featuredImage?.node)
		.slice(0, 8)

	// Split posts for different sections
	const magazinePosts = allPosts.slice(0, MAGAZINE_POST_COUNT)
	const gridPosts = allPosts.slice(MAGAZINE_POST_COUNT, MAGAZINE_POST_COUNT + GRID_POST_COUNT)

	// Fetch additional post metadata (likes, views, etc.)
	const {} = useGetPostsNcmazMetaByIds({
		posts: allPosts as TPostCard[],
	})

	return (
		<>
			{/* Structured Data for Homepage */}
			<WebsiteSchema />
			<OrganizationSchema />

			<PageLayout
				headerMenuItems={props.data?.primaryMenuItems?.nodes || []}
				footerMenuItems={props.data?.footerMenuItems?.nodes || []}
				pageFeaturedImageUrl={null}
				pageTitle={'Home'}
				pageDescription={HOME_META_DESCRIPTION}
				generalSettings={
					props.data?.generalSettings as NcgeneralSettingsFieldsFragmentFragment
				}
			>
				{/* Branded Hero Section - Full Width */}
				<SectionHeroBranded className="-mt-2" />

				{/* Categories Section - STATIC GRID (CLS-safe, no slider) */}
				{categories.length > 0 && (
					<div className="container py-12 lg:py-16">
						<Heading desc="Browse our haunted content by topic">
							Explore Categories
						</Heading>
						<CategoryGridStatic categories={categories} />
					</div>
				)}

				<div className="container pb-16 lg:pb-28">
					{/* Featured Posts - Magazine Layout */}
					{magazinePosts.length > 0 && (
						<div className="mb-12 lg:mb-16">
							<Heading desc="Fresh stories from the other side">
								Latest Hauntings
							</Heading>
							<SectionMagazine1 posts={magazinePosts as TPostCard[]} />
						</div>
					)}

					{/* Grid Section */}
					{gridPosts.length > 0 && (
						<div>
							<Heading desc="Explore all our paranormal content">
								More Stories
							</Heading>
							<GridPostsArchive
								posts={gridPosts as TPostCard[]}
								loading={false}
								showLoadmore={false}
								skeletonCount={GRID_POST_COUNT}
							/>

							{/* View All Link - Goes to paginated /posts page */}
							<div className="mt-12 flex justify-center lg:mt-16">
								<Link
									href="/posts"
									className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-red-600 px-8 py-4 text-base font-medium text-white shadow-lg shadow-purple-500/25 transition-all hover:from-purple-500 hover:to-red-500 hover:shadow-xl"
								>
									View All Posts
									<ArrowRightIcon className="h-5 w-5" />
								</Link>
							</div>
						</div>
					)}
				</div>
			</PageLayout>
		</>
	)
}

// Variables for the GraphQL query
Main.variables = () => ({
	first: MAGAZINE_POST_COUNT + GRID_POST_COUNT,
	categoriesFirst: 12,
	headerLocation: PRIMARY_LOCATION,
	footerLocation: FOOTER_LOCATION,
})

// SSR Query - data fetched at build time, not client-side!
// This dramatically improves LCP by eliminating client-side data fetching
Main.query = gql(`
	query MainPageQuery(
		$first: Int!
		$categoriesFirst: Int!
		$headerLocation: MenuLocationEnum!
		$footerLocation: MenuLocationEnum!
	) {
		# Homepage posts
		posts(first: $first, where: { orderby: { field: DATE, order: DESC } }) {
			nodes {
				...NcmazFcPostCardFields
			}
		}
		# Top categories by post count
		categories(first: $categoriesFirst, where: { orderby: COUNT, order: DESC }) {
			nodes {
				...NcmazFcCategoryFullFieldsFragment
			}
		}
		# Common query for all pages
		generalSettings {
			...NcgeneralSettingsFieldsFragment
		}
		primaryMenuItems: menuItems(where: { location: $headerLocation }, first: 80) {
			nodes {
				...NcPrimaryMenuFieldsFragment
			}
		}
		footerMenuItems: menuItems(where: { location: $footerLocation }, first: 50) {
			nodes {
				...NcFooterMenuFieldsFragment
			}
		}
	}
`)

export default Main
