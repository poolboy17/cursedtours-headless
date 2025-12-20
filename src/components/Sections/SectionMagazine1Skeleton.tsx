import { FC } from 'react'
import Skeleton from '@/components/Skeleton/Skeleton'

interface SectionMagazine1SkeletonProps {
	className?: string
}

/**
 * Card skeleton that matches Card2 (large) dimensions
 */
const Card2Skeleton: FC = () => (
	<div className="group relative flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-neutral-900">
		<div className="relative aspect-w-4 aspect-h-3 w-full flex-shrink-0 overflow-hidden rounded-3xl sm:aspect-h-4">
			<Skeleton
				width="100%"
				height="100%"
				containerClassName="absolute inset-0 leading-none"
				borderRadius={24}
			/>
		</div>
		<div className="absolute inset-x-3 top-3 z-10">
			<Skeleton width={80} height={24} borderRadius={16} />
		</div>
		<div className="mt-5 flex flex-col space-y-3 px-4">
			<Skeleton width="40%" height={16} />
			<Skeleton width="90%" height={24} />
			<Skeleton width="70%" height={24} />
			<div className="flex items-center gap-3">
				<Skeleton width={32} height={32} circle />
				<Skeleton width={100} height={14} />
			</div>
		</div>
	</div>
)

/**
 * Card skeleton that matches Card6 dimensions (horizontal layout)
 * CRITICAL: Card6 has image on the RIGHT, text on LEFT
 * Card6 classes: flex flex-row border-neutral-200 sm:rounded-3xl sm:border sm:bg-white sm:p-4
 * Image classes: ms-3 w-24 flex-shrink-0 rounded-2xl sm:ms-5 sm:w-40
 */
const Card6Skeleton: FC = () => (
	<div className="nc-Card6 group relative flex h-full flex-row border-neutral-200 sm:rounded-3xl sm:border sm:bg-white sm:p-4 dark:border-neutral-700 sm:dark:bg-neutral-900">
		{/* Text content on LEFT (flex-grow) */}
		<div className="flex flex-grow flex-col">
			<div className="mb-4 space-y-3">
				{/* Category badge */}
				<Skeleton width={80} height={20} borderRadius={16} />
				{/* Title - 2 lines */}
				<div>
					<Skeleton width="100%" height={18} className="mb-1" />
					<Skeleton width="70%" height={18} />
				</div>
				{/* Author meta */}
				<div className="flex items-center gap-2">
					<Skeleton width={24} height={24} circle />
					<Skeleton width={80} height={12} />
				</div>
			</div>
			{/* Footer actions */}
			<div className="mt-auto flex flex-wrap items-center justify-between">
				<Skeleton width={80} height={16} />
				<Skeleton width={60} height={16} />
			</div>
		</div>
		{/* Image on RIGHT - matches Card6: ms-3 w-24 sm:ms-5 sm:w-40 max-h-28 sm:max-h-full */}
		<div className="relative ms-3 block max-h-28 w-24 flex-shrink-0 overflow-hidden rounded-2xl sm:ms-5 sm:max-h-full sm:w-40">
			<Skeleton
				width="100%"
				height="100%"
				containerClassName="absolute inset-0 leading-none"
				borderRadius={16}
			/>
		</div>
	</div>
)

/**
 * Skeleton loader for SectionMagazine1
 * Matches exact layout to prevent CLS
 */
const SectionMagazine1Skeleton: FC<SectionMagazine1SkeletonProps> = ({
	className = '',
}) => {
	return (
		<div className={`nc-SectionMagazine1Skeleton ${className}`}>
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2 2xl:gap-7">
				{/* Large card skeleton (Card2) */}
				<Card2Skeleton />
				{/* Right column with 3 horizontal cards (Card6) */}
				<div className="grid gap-6 2xl:gap-7">
					<Card6Skeleton />
					<Card6Skeleton />
					<Card6Skeleton />
				</div>
			</div>
		</div>
	)
}

export default SectionMagazine1Skeleton
