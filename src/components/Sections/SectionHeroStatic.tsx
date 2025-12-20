import { FC } from 'react'
import Link from 'next/link'
import { TPostCard } from '@/components/Card2/Card2'
import { getPostDataFromPostFragment } from '@/utils/getPostDataFromPostFragment'
import CategoryBadgeList from '@/components/CategoryBadgeList/CategoryBadgeList'
import PostCardMeta from '@/components/PostCardMeta/PostCardMeta'
import MyImage from '@/components/MyImage'

interface SectionHeroStaticProps {
	post: TPostCard
	className?: string
}

/**
 * Performance-optimized static hero component
 * - Uses priority loading for LCP optimization
 * - Explicit width/height to prevent CLS
 * - Proper sizes attribute for responsive images
 * - No animations or sliders
 */
const SectionHeroStatic: FC<SectionHeroStaticProps> = ({
	post,
	className = '',
}) => {
	const { title, excerpt, uri, featuredImage, categories, author, date } =
		getPostDataFromPostFragment(post)

	return (
		<section className={`nc-SectionHeroStatic relative ${className}`}>
			<Link href={uri || ''} className="block">
				<div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl sm:aspect-[16/9] lg:aspect-[21/9]">
					{/* Hero Image - Priority loaded for LCP with explicit dimensions */}
					<MyImage
						src={featuredImage?.sourceUrl || ''}
						alt={featuredImage?.altText || title || ''}
						width={1260}
						height={540}
						priority
						className="object-cover w-full h-full"
						sizes="100vw"
					/>
					{/* Gradient overlay */}
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
					
					{/* Content */}
					<div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 lg:p-12">
						<div className="max-w-3xl">
							<CategoryBadgeList
								categories={categories?.nodes || []}
								className="mb-3 flex flex-wrap gap-2"
							/>
							<h1
								className="mb-3 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl xl:text-5xl"
								dangerouslySetInnerHTML={{ __html: title || '' }}
							/>
							{excerpt && (
								<p
									className="mb-4 line-clamp-2 text-sm text-neutral-200 sm:text-base lg:text-lg"
									dangerouslySetInnerHTML={{ __html: excerpt }}
								/>
							)}
							<PostCardMeta
								className="text-neutral-300"
								meta={{ author, date }}
								avatarSize="h-9 w-9"
							/>
						</div>
					</div>
				</div>
			</Link>
		</section>
	)
}

export default SectionHeroStatic
