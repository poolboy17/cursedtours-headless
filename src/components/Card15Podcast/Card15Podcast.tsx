import { FC } from 'react'
import Link from 'next/link'
import { CommonPostCardProps } from '../Card2/Card2'
import { getPostDataFromPostFragment } from '@/utils/getPostDataFromPostFragment'
import MyImage from '../MyImage'
import ncFormatDate from '@/utils/formatDate'

export interface Card15PodcastProps extends CommonPostCardProps {}

const Card15Podcast: FC<Card15PodcastProps> = ({
	className = 'h-full',
	post,
}) => {
	const {
		title,
		date,
		featuredImage,
		uri,
	} = getPostDataFromPostFragment(post)

	return (
		<div
			className={`nc-Card15Podcast group relative flex items-center rounded-3xl border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900 ${className}`}
		>
			<div className="w-1/4 flex-shrink-0">
				<Link
					href={uri || ''}
					className="aspect-h-1 aspect-w-1 relative block h-0 overflow-hidden rounded-full shadow-lg"
				>
					<MyImage
						className="h-full w-full object-cover"
						src={featuredImage?.sourceUrl || ''}
						fill
						alt={title || ''}
						sizes="100px"
					/>
				</Link>
			</div>

			<div className="ms-4 flex flex-grow flex-col">
				<h2
					className={`nc-card-title block text-sm font-semibold sm:text-base 2xl:text-lg`}
				>
					<Link
						href={uri || ''}
						className="line-clamp-2"
						title={title || ''}
						dangerouslySetInnerHTML={{ __html: title }}
					></Link>
				</h2>
				<span className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
					{ncFormatDate(date || '')}
				</span>
			</div>
		</div>
	)
}

export default Card15Podcast
