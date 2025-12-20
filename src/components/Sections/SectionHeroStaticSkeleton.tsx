import { FC } from 'react'
import Skeleton from '@/components/Skeleton/Skeleton'

interface SectionHeroStaticSkeletonProps {
	className?: string
}

/**
 * Skeleton loader for SectionHeroStatic
 * Matches exact dimensions to prevent CLS
 */
const SectionHeroStaticSkeleton: FC<SectionHeroStaticSkeletonProps> = ({
	className = '',
}) => {
	return (
		<section className={`nc-SectionHeroStaticSkeleton relative ${className}`}>
			<div className="block">
				<div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl sm:aspect-[16/9] lg:aspect-[21/9]">
					{/* Hero Image Skeleton */}
					<Skeleton
						width="100%"
						height="100%"
						containerClassName="absolute inset-0 leading-none"
						borderRadius={24}
					/>
					
					{/* Content Skeleton - positioned at bottom */}
					<div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 lg:p-12">
						<div className="max-w-3xl">
							{/* Category badges */}
							<div className="mb-3 flex flex-wrap gap-2">
								<Skeleton width={80} height={24} borderRadius={16} />
								<Skeleton width={100} height={24} borderRadius={16} />
							</div>
							{/* Title */}
							<div className="mb-3">
								<Skeleton width="90%" height={40} className="mb-2" />
								<Skeleton width="70%" height={40} />
							</div>
							{/* Excerpt */}
							<div className="mb-4">
								<Skeleton width="100%" height={20} className="mb-1" />
								<Skeleton width="80%" height={20} />
							</div>
							{/* Author meta */}
							<div className="flex items-center gap-3">
								<Skeleton width={36} height={36} circle />
								<Skeleton width={120} height={16} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default SectionHeroStaticSkeleton
