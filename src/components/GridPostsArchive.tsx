import { NcmazFcPostFullFieldsFragment } from '@/__generated__/graphql'
import { FC } from 'react'
import Empty from './Empty'
import Card11Skeleton from './Card11/Card11Skeleton'
import Card11 from './Card11/Card11'
import ButtonPrimary from './Button/ButtonPrimary'
import getTrans from '@/utils/getTrans'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import Button from './Button/Button'

const T = getTrans()

interface Props {
	posts: NcmazFcPostFullFieldsFragment[] | null
	className?: string
	loading?: boolean
	showLoadmore?: boolean
	onClickLoadmore?: () => void
	showNextPagination?: boolean
	showPrevPagination?: boolean
	onClickNext?: () => void
	onClickPrev?: () => void
	currentPage?: number
	/** Number of skeleton cards to show during loading - should match expected post count to prevent CLS */
	skeletonCount?: number
}

const GridPostsArchive: FC<Props> = ({
	className = '',
	posts: currentPosts,
	loading,
	onClickLoadmore,
	showLoadmore,
	showNextPagination,
	showPrevPagination,
	onClickNext,
	onClickPrev,
	currentPage = 1,
	skeletonCount = 8,
}) => {
	return (
		<div className={className}>
			{/* LOOP ITEMS */}
			{!currentPosts?.length && !loading ? (
				<Empty />
			) : (
				<div className="mt-8 grid gap-6 sm:grid-cols-2 md:gap-x-7 md:gap-y-8 lg:mt-12 lg:grid-cols-3 xl:grid-cols-4">
					{!currentPosts?.length && loading
						? Array.from({ length: skeletonCount }, (_, i) => <Card11Skeleton key={i} />)
						: (currentPosts || []).map((post) => (
								<Card11 key={post.databaseId} post={post} />
							))}
				</div>
			)}

			{/* LEGACY LOADMORE - kept for backwards compatibility */}
			{showLoadmore ? (
				<div className="mt-12 flex justify-center lg:mt-14">
					<ButtonPrimary loading={loading} onClick={onClickLoadmore}>
						{T['Show me more']}
					</ButtonPrimary>
				</div>
			) : null}

			{/* PAGINATION */}
			{(showNextPagination || showPrevPagination) ? (
				<nav 
					className="mt-12 flex flex-col items-center gap-4 lg:mt-14"
					aria-label="Pagination"
				>
					<div className="flex items-center gap-4">
						<Button
							pattern="third"
							loading={loading}
							onClick={onClickPrev}
							disabled={!showPrevPagination || loading}
							aria-label="Go to previous page"
						>
							<ArrowLeftIcon className="me-2 h-5 w-5 rtl:rotate-180" />
							{T['Prev']}
						</Button>
						
						<span className="flex items-center justify-center min-w-[100px] px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-full">
							Page {currentPage}
						</span>
						
						<Button
							pattern="third"
							loading={loading}
							onClick={onClickNext}
							disabled={!showNextPagination || loading}
							aria-label="Go to next page"
						>
							{T['Next']}
							<ArrowRightIcon className="ms-2 h-5 w-5 rtl:rotate-180" />
						</Button>
					</div>
				</nav>
			) : null}
		</div>
	)
}

export default GridPostsArchive
