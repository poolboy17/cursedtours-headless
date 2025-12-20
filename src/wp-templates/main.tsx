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
import { useState } from 'react'
import SectionHeroBranded from '@/components/Sections/SectionHeroBranded'
import SectionMagazine1 from '@/components/Sections/SectionMagazine1'
import SectionMagazine1Skeleton from '@/components/Sections/SectionMagazine1Skeleton'
import Heading from '@/components/Heading/Heading'

// Constants for section distribution
const MAGAZINE_POST_COUNT = 4
const GRID_START_INDEX = MAGAZINE_POST_COUNT

// Homepage SEO meta description
const HOME_META_DESCRIPTION = 'Discover the most haunted places, ghost tours, and paranormal experiences worldwide. Explore spine-chilling stories, haunted locations, and book your next supernatural adventure with Cursed Tours.'

const Main: FaustTemplate<any> = (props: any) => {
	const [after, setAfter] = useState<string | null>(null)

	const { data, loading, fetchMore } = useQuery(QUERY_GET_POSTS_BY, {
		variables: {
			first: GET_POSTS_FIRST_COMMON,
			after: null,
		},
	})

	const posts = (data?.posts?.nodes || []) as PostDataFragmentType[]
	const pageInfo = data?.posts?.pageInfo
	const hasNextPage = pageInfo?.hasNextPage || false

	// Split posts for different sections
	const magazinePosts = posts.slice(0, MAGAZINE_POST_COUNT)
	const gridPosts = posts.slice(GRID_START_INDEX)

	const {} = useGetPostsNcmazMetaByIds({
		posts: posts as TPostCard[],
	})

	const handleClickShowMore = () => {
		if (pageInfo?.endCursor) {
			fetchMore({
				variables: {
					after: pageInfo.endCursor,
				},
				updateQuery: (prev, { fetchMoreResult }): typeof prev => {
					if (!fetchMoreResult?.posts) return prev
					return {
						...prev,
						posts: {
							...prev.posts,
							...fetchMoreResult.posts,
							nodes: [
								...(prev.posts?.nodes || []),
								...(fetchMoreResult.posts?.nodes || []),
							],
							pageInfo: fetchMoreResult.posts.pageInfo ?? prev.posts?.pageInfo,
						},
					}
				},
			})
		}
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
				{/* Featured Posts - Magazine Layout */}
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

				{/* Grid Section - Load more enabled */}
				<div>
					<Heading desc="Explore all our paranormal content">
						More Stories
					</Heading>
					<GridPostsArchive
						posts={gridPosts as TPostCard[]}
						loading={loading}
						showLoadmore={hasNextPage}
						onClickLoadmore={handleClickShowMore}
						skeletonCount={12}
					/>
				</div>
			</div>
		</PageLayout>
	)
}

export default Main
