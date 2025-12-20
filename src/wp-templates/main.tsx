import { useQuery } from '@apollo/client'
import { NcgeneralSettingsFieldsFragmentFragment } from '@/__generated__/graphql'
import PageLayout from '@/container/PageLayout'
import { PostDataFragmentType } from '@/data/types'
import { FaustTemplate } from '@faustwp/core'
import { TPostCard } from '@/components/Card2/Card2'
import useGetPostsNcmazMetaByIds from '@/hooks/useGetPostsNcmazMetaByIds'
import GridPostsArchive from '@/components/GridPostsArchive'
import { QUERY_GET_POSTS_BY } from '@/fragments/queries'
import { useRouter } from 'next/router'
import SectionHeroBranded from '@/components/Sections/SectionHeroBranded'
import SectionMagazine1 from '@/components/Sections/SectionMagazine1'
import SectionMagazine1Skeleton from '@/components/Sections/SectionMagazine1Skeleton'
import Heading from '@/components/Heading/Heading'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

// Constants
const MAGAZINE_POST_COUNT = 4
const GRID_POST_COUNT = 8

// Homepage SEO meta description
const HOME_META_DESCRIPTION = 'Discover the most haunted places, ghost tours, and paranormal experiences worldwide. Explore spine-chilling stories, haunted locations, and book your next supernatural adventure with Cursed Tours.'

const Main: FaustTemplate<any> = (props: any) => {
	const router = useRouter()

	// Fetch posts for homepage - fixed amount, no infinite scroll
	const { data, loading } = useQuery(QUERY_GET_POSTS_BY, {
		variables: {
			first: MAGAZINE_POST_COUNT + GRID_POST_COUNT,
			after: null,
		},
	})

	const allPosts = (data?.posts?.nodes || []) as PostDataFragmentType[]
	
	// Split posts for different sections
	const magazinePosts = allPosts.slice(0, MAGAZINE_POST_COUNT)
	const gridPosts = allPosts.slice(MAGAZINE_POST_COUNT, MAGAZINE_POST_COUNT + GRID_POST_COUNT)

	const {} = useGetPostsNcmazMetaByIds({
		posts: allPosts as TPostCard[],
	})

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

				{/* Grid Section */}
				<div>
					<Heading desc="Explore all our paranormal content">
						More Stories
					</Heading>
					<GridPostsArchive
						posts={gridPosts as TPostCard[]}
						loading={loading}
						showLoadmore={false}
						skeletonCount={GRID_POST_COUNT}
					/>
					
					{/* View All Link - Goes to paginated /posts page */}
					{!loading && gridPosts.length > 0 && (
						<div className="mt-12 flex justify-center lg:mt-16">
							<Link 
								href="/posts"
								className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-red-600 px-8 py-4 text-base font-medium text-white shadow-lg shadow-purple-500/25 transition-all hover:from-purple-500 hover:to-red-500 hover:shadow-xl"
							>
								View All Posts
								<ArrowRightIcon className="h-5 w-5" />
							</Link>
						</div>
					)}
				</div>
			</div>
		</PageLayout>
	)
}

export default Main
