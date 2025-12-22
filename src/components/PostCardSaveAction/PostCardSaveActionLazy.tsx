'use client'

import { FC } from 'react'
import dynamic from 'next/dynamic'
import { NcBookmarkProps } from '../NcBookmark/NcBookmark'
import getTrans from '@/utils/getTrans'
import { MyBookmarkIcon } from '../Icons/Icons'

const T = getTrans()

// Lazy load the heavy NcBookmark component (Apollo + Redux)
const NcBookmark = dynamic(() => import('../NcBookmark/NcBookmark'), {
	ssr: false,
	loading: () => <BookmarkPlaceholder />,
})

// Static placeholder matching NcBookmark's visual structure
// Renders immediately without hydration cost
const BookmarkPlaceholder: FC = () => (
	<div
		className="nc-NcBookmark relative flex items-center justify-center rounded-full h-9 w-9 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700"
		title="Save to reading list"
	>
		<MyBookmarkIcon fill="none" className="z-[1] h-[18px] w-[18px]" />
	</div>
)

export interface PostCardSaveActionLazyProps
	extends Omit<NcBookmarkProps, 'containerClassName'> {
	className?: string
	bookmarkClass?: string
	readingTime?: number
	hidenReadingTime?: boolean
}

/**
 * Lazy version of PostCardSaveAction
 * - Reading time renders immediately (static text)
 * - Bookmark button is lazy loaded with ssr:false to defer Apollo/Redux hydration
 */
const PostCardSaveActionLazy: FC<PostCardSaveActionLazyProps> = ({
	className = '',
	bookmarkClass,
	hidenReadingTime = false,
	readingTime = 3,
	postDatabseId,
}) => {
	return (
		<div
			className={`nc-PostCardSaveAction flex items-center gap-x-2 text-xs text-neutral-700 dark:text-neutral-300 ${className}`}
		>
			{!hidenReadingTime && !!readingTime && (
				<>
					<span className="hidden text-right sm:block">
						<span className="line-clamp-1">
							{readingTime} {T['min read'] ?? 'min read'}
						</span>
					</span>
					<span className="line-clamp-1 block text-right sm:hidden">
						<span className="line-clamp-1">
							{readingTime}' {T['read'] ?? 'read'}
						</span>
					</span>
				</>
			)}

			<NcBookmark
				postDatabseId={postDatabseId}
				containerClassName={bookmarkClass}
			/>
		</div>
	)
}

export default PostCardSaveActionLazy
