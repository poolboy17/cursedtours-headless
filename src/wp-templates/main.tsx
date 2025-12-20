import { useQuery } from '@apollo/client'
import { NcgeneralSettingsFieldsFragmentFragment } from '@/__generated__/graphql'
import PageLayout from '@/container/PageLayout'
import { GET_POSTS_FIRST_COMMON } from '@/contains/contants'
import { PostDataFragmentType } from '@/data/types'
import { FaustTemplate } from '@faustwp/core'
import { TPostCard } from '@/components/Card2/Card2'
import useGetPostsNcmazMetaByIds from '@/hooks/useGetPostsNcmazMetaByIds'
import GridPostsArchive from '@/components/GridPostsArchive'
import { QUERY_GET_POSTS_BY } from '@/fragments/queries'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import SectionHeroBranded from '@/components/Sections/SectionHeroBranded'
import SectionMagazine1 from '@/components/Sections/SectionMagazine1'
import SectionMagazine1Skeleton from '@/components/Sections/SectionMagazine1Skeleton'
import Heading from '@/components/Heading/Heading'
import Pagination from '@/components/Pagination/Pagination'

// Constants for section distribution
const MAGAZINE_POST_COUNT = 4
const POSTS_PER_PAGE = 12

// Homepage SEO meta description
const HOME_META_DESCRIPTION = 'Discover the most haunted places, ghost tours, and paranormal experiences worldwide. Explore spine-chilling stories, haunted locations, and book your next supernatural adventure with Cursed Tours.'

const Main: FaustTemplate<any> = (props: any) => {
	const router = useRouter()
	
	// Get current page from URL query, default to 1
	const pageFromQuery = typeof router.query.page === 'string' ? parseInt(router.query.page, 10) : 1
	const [currentPage, setCurrentPage] = useState(pageFromQuery)
	
	// Sync state with URL on route change
	useEffect(() => {
		if (router.isReady) {
			const page = typeof router.query.page === 'string' ? parseInt(router.query.page, 10) : 1
			setCurrentPage(page)
		}
	}, [router.query.page, router.isReady])

	// Calculate offset for pagination (skip magazine posts on page 1)
	const isFirstPage = currentPage === 1
	const offset = isFirstPage 
		? 0 
		: MAGAZINE_POST_COUNT + (currentPage - 2) * POSTS_PER_PAGE

	const { data, loading } = useQuery(QUERY_GET_POSTS_BY, {
		variables: {
			first: isFirstPage ? MAGAZINE_POST_COUNT + POSTS_PER_PAGE : POSTS_PER_PAGE,
			after: null,
		},
	})

	// For pagination, we need to fetch with offset
	// Using cursor-based pagination from GraphQL
	const { data: paginatedData, loading: paginatedLoading } = useQuery(QUERY_GET_POSTS_BY, {
		variables: {
			first: POSTS_PER_PAGE,
			after: null,
		},
		skip: isFirstPage, // Skip this query on first page
	})

	const allPosts = (data?.posts?.nodes || []) as PostDataFragmentType[]
	const pageInfo = data?.posts?.pageInfo
	
	// Calculate total pages (estimate based on hasNextPage)
	// In a real implementation, you'd get total count from WordPress
	const totalPosts = 100 // Estimate - ideally get from WP
	const totalPages = Math.ceil((totalPosts - MAGAZINE_POST_COUNT) / POSTS_PER_PAGE) + 1

	// Split posts for different sections
	const magazinePosts = isFirstPage ? allPosts.slice(0, MAGAZINE_POST_COUNT) : []
	const gridPosts = isFirstPage 
		? allPosts.slice(MAGAZINE_POST_COUNT) 
		: allPosts

	const {} = useGetPostsNcmazMetaByIds({
		posts: allPosts as TPostCard[],
	})

	// Handle page change with URL update
	const handlePageChange = (page: number) => {
		setCurrentPage(page)
		
		// Update URL without full page reload
		const url = page === 1 ? '/' : `/?page=${page}`
		router.push(url, undefined, { shallow: true })
		
		// Scroll to top of grid section
		window.scrollTo({ top: 400, behavior: 'smooth' })
	}

	return (
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

			<div className="container pb-16 pt-12 lg:pb-28 lg:pt-16">
				{/* Featured Posts - Magazine Layout (only on page 1) */}
				{isFirstPage && (
					<div className="mb-12 lg:mb-16">
						<Heading desc="Fresh stories from the other side">
							Latest Hauntings
						</Heading>
						{loading ? (
							<SectionMagazine1Skeleton />
						) : magazinePosts.length > 0 ? (
							<SectionMagazine1 posts={magazinePosts as TPostCard[]} />
						) : null}
					</div>
				)}

				{/* Grid Section with Pagination */}
				<div>
					<Heading desc={isFirstPage ? "Explore all our paranormal content" : `Page ${currentPage} of ghost stories`}>
						{isFirstPage ? 'More Stories' : 'All Stories'}
					</Heading>
					<GridPostsArchive
						posts={gridPosts as TPostCard[]}
						loading={loading}
						showLoadmore={false}
						skeletonCount={POSTS_PER_PAGE}
					/>
					
					{/* Pagination */}
					{!loading && gridPosts.length > 0 && (
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
							className="mt-12 lg:mt-16"
						/>
					)}
				</div>
			</div>
		</PageLayout>
	)
}

export default Main
