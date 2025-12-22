'use client'

import { FC } from 'react'
import dynamic from 'next/dynamic'
import PostCardCommentBtn, {
	PostCardCommentBtnProps,
} from '@/components/PostCardCommentBtn/PostCardCommentBtn'
import { PostCardLikeActionProps } from '@/components/PostCardLikeAction/PostCardLikeAction'
import PostCardViewCount from '../PostCardCommentBtn/PostCardViewCount'
import { NC_SITE_SETTINGS } from '@/contains/site-settings'
import { FavouriteIcon } from '../Icons/Icons'

// Lazy load the heavy PostCardLikeAction component (Apollo + Redux)
const PostCardLikeAction = dynamic(
	() => import('@/components/PostCardLikeAction/PostCardLikeAction'),
	{
		ssr: false,
		loading: () => <LikeButtonPlaceholder />,
	}
)

// Static placeholder matching PostCardLikeAction's visual structure
// Renders immediately without hydration cost
const LikeButtonPlaceholder: FC = () => (
	<div
		className="nc-PostCardLikeAction group/PostCardLikeAction relative flex items-center text-xs leading-none text-neutral-700 dark:text-neutral-200"
		title="Like this post"
	>
		<div className="h-9 w-9 flex flex-shrink-0 items-center justify-center rounded-full bg-neutral-50 dark:bg-neutral-800">
			<FavouriteIcon
				color="currentColor"
				fill="none"
				className="h-[18px] w-[18px]"
			/>
		</div>
		<span className="ms-2 min-w-[1.125rem] flex-shrink-0 text-start text-neutral-900 dark:text-neutral-200">
			0
		</span>
	</div>
)

export interface PostCardLikeAndCommentLazyProps
	extends Omit<PostCardLikeActionProps, ''>,
		Omit<PostCardCommentBtnProps, 'isATagOnSingle'> {
	className?: string
	itemClass?: string
	hiddenCommentOnMobile?: boolean
	useOnSinglePage?: boolean
	viewCount?: number
	showViewCount?: boolean
	showCommentCount?: boolean
}

/**
 * Lazy version of PostCardLikeAndComment
 * - Comment and View buttons render immediately (they're just links/divs)
 * - Like button is lazy loaded with ssr:false to defer Apollo/Redux hydration
 */
const PostCardLikeAndCommentLazy: FC<PostCardLikeAndCommentLazyProps> = ({
	className = '',
	itemClass,
	hiddenCommentOnMobile = true,
	useOnSinglePage = false,
	likeCount,
	commentCount,
	linkToPost,
	postDatabseId,
	showViewCount = NC_SITE_SETTINGS['post_card']?.show_view_cout,
	showCommentCount = NC_SITE_SETTINGS['post_card']?.show_comment_count,
	viewCount = 0,
}) => {
	return (
		<div
			className={`nc-PostCardLikeAndComment flex items-center gap-2 sm:gap-2.5 ${className}`}
		>
			<PostCardLikeAction
				className={itemClass}
				likeCount={likeCount}
				postDatabseId={postDatabseId}
			/>
			{showCommentCount && (
				<PostCardCommentBtn
					className={`${
						hiddenCommentOnMobile ? 'hidden sm:flex' : 'flex'
					} ${itemClass}`}
					isATagOnSingle={useOnSinglePage}
					linkToPost={linkToPost}
					commentCount={commentCount}
				/>
			)}
			{showViewCount && (
				<PostCardViewCount
					className={`${
						hiddenCommentOnMobile ? 'hidden sm:flex' : 'flex'
					} ${itemClass}`}
					viewCount={viewCount || 1}
				/>
			)}
		</div>
	)
}

export default PostCardLikeAndCommentLazy
