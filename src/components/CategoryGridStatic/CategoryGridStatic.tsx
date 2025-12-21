import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getCatgoryDataFromCategoryFragment } from '@/utils/getCatgoryDataFromCategoryFragment'
import { TCategoryCardFull } from '@/components/CardCategory1/CardCategory1'

export interface CategoryGridStaticProps {
	categories: TCategoryCardFull[]
	className?: string
}

/**
 * CLS-Safe Static Category Grid
 * - Fixed aspect-ratio containers prevent layout shift
 * - First row (4 desktop, 2 mobile) loads eagerly
 * - No animations, no hover transforms that change size
 * - Grid only: 4 cols desktop, 2 cols tablet/mobile
 */
const CategoryGridStatic: FC<CategoryGridStaticProps> = ({
	categories,
	className = '',
}) => {
	return (
		<div
			className={`grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6 ${className}`}
		>
			{categories.map((cat, index) => {
				const { name, uri, featuredImageMeta } =
					getCatgoryDataFromCategoryFragment(cat)

				// First 4 items load eagerly (visible on desktop first row)
				// On mobile, first 2 are visible but we load 4 eagerly for safety
				const isAboveFold = index < 4
				const priority = index < 2 // Only first 2 get priority

				return (
					<Link
						key={cat.databaseId || index}
						href={uri}
						className="group relative block w-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800"
						style={{ aspectRatio: '3 / 2' }}
					>
						{/* Image container - fills parent with aspect-ratio */}
						{featuredImageMeta?.sourceUrl && (
							<Image
								src={featuredImageMeta.sourceUrl}
								alt={name || 'Category'}
								fill
								sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 25vw"
								className="object-cover transition-transform duration-300 group-hover:scale-105"
								priority={priority}
								loading={isAboveFold ? 'eager' : 'lazy'}
							/>
						)}

						{/* Gradient overlay */}
						<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

						{/* City name - centered at bottom */}
						<div className="absolute inset-x-0 bottom-0 p-3 lg:p-4">
							<h3 className="text-center text-sm font-semibold text-white sm:text-base lg:text-lg">
								{name}
							</h3>
						</div>
					</Link>
				)
			})}
		</div>
	)
}

export default CategoryGridStatic
