import { FC } from 'react'
import Skeleton from '../Skeleton/Skeleton'
import PostCardLikeCommentSaveSkeleton from '../Skeleton/PostCardLikeCommentSaveSkeleton'

export interface Card11SkeletonProps {
	className?: string
	ratio?: string
}

const Card11Skeleton: FC<Card11SkeletonProps> = ({
	className = 'h-full',
	ratio = 'aspect-w-4 aspect-h-3',
}) => {
	return (
		<div
			className={`nc-Card11 group relative flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-neutral-900 ${className}`}
		>
			{/* Image placeholder - matches Card11 structure */}
			<div
				className={`relative z-10 block w-full flex-shrink-0 overflow-hidden rounded-t-3xl ${ratio}`}
			>
				<div>
					<Skeleton
						width="100%"
						height="100%"
						containerClassName="absolute inset-0 leading-none"
					/>
				</div>
			</div>

			{/* Content area - MUST match Card11 exactly to prevent CLS */}
			{/* Card11 uses: flex flex-1 flex-col space-y-3 rounded-b-3xl border border-t-0 border-neutral-100 px-3.5 py-4 */}
			<div className="flex flex-1 flex-col space-y-3 rounded-b-3xl border border-t-0 border-neutral-100 px-3.5 py-4 dark:border-neutral-800">
				{/* Author/date placeholder */}
				<Skeleton width="60%" height={16} />
				{/* Title placeholder - matches nc-card-title structure */}
				<h3 className="nc-card-title block text-base font-semibold text-neutral-900 dark:text-neutral-100">
					<Skeleton height={20} />
					<Skeleton width="80%" height={20} className="mt-1" />
				</h3>
				{/* Footer actions placeholder */}
				<div className="mt-auto">
					<PostCardLikeCommentSaveSkeleton />
				</div>
			</div>
		</div>
	)
}

export default Card11Skeleton
