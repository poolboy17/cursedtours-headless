import { FC } from 'react'

interface CategoryGridSkeletonProps {
	count?: number
	className?: string
}

/**
 * Skeleton loader for CategoryGridStatic
 * Matches exact dimensions to prevent CLS
 */
const CategoryGridSkeleton: FC<CategoryGridSkeletonProps> = ({
	count = 8,
	className = '',
}) => {
	return (
		<div
			className={`grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6 ${className}`}
		>
			{Array.from({ length: count }).map((_, index) => (
				<div
					key={index}
					className="relative block w-full overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-800 animate-pulse"
					style={{ aspectRatio: '3 / 2' }}
				>
					{/* Shimmer effect */}
					<div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-300/50 dark:via-neutral-700/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
				</div>
			))}
		</div>
	)
}

export default CategoryGridSkeleton
