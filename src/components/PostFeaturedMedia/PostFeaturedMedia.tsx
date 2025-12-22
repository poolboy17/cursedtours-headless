'use client'

import { FC, Suspense } from 'react'
import dynamic from 'next/dynamic'
import PostTypeFeaturedIcon from '@/components/PostTypeFeaturedIcon/PostTypeFeaturedIcon'
import MediaAudio from './MediaAudio'
import Link from 'next/link'
import { PostDataFragmentType } from '@/data/types'
import { getPostDataFromPostFragment } from '@/utils/getPostDataFromPostFragment'
import MyImage from '../MyImage'

// Dynamic imports for heavy components
const GallerySlider = dynamic(() => import('./GallerySlider'), {
	ssr: false,
	loading: () => (
		<div className="absolute inset-0 animate-pulse bg-neutral-200 dark:bg-neutral-700" />
	),
})

const MediaVideo = dynamic(() => import('./MediaVideo'), {
	ssr: false,
	loading: () => (
		<div className="absolute inset-0 flex items-center justify-center bg-neutral-900/30">
			<div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
		</div>
	),
})

export interface PostFeaturedMediaProps {
	className?: string
	post: PostDataFragmentType
	isHover?: boolean
	// Explicit dimensions to prevent CLS - defaults to 4:3 aspect ratio
	width?: number
	height?: number
	// Responsive sizes attribute - critical for image optimization
	// Default optimized for Card11 in 4-col grid (saves ~200KB vs previous 800px default)
	sizes?: string
}

const PostFeaturedMedia: FC<PostFeaturedMediaProps> = ({
	className = 'w-full h-full',
	post,
	isHover = false,
	width = 400,
	height = 300,
	// Optimized default: Card11 displays at ~280px in 4-col grid, ~380px in 3-col, ~50% on tablet
	sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px',
}) => {
	const {
		title,
		date,
		categories,
		excerpt,
		author,
		postFormats: postType,
		featuredImage,
		ncPostMetaData,
		commentCount,
		uri,
		databaseId,
		ncmazGalleryImgs,
		ncmazVideoUrl,
		ncmazAudioUrl,
	} = getPostDataFromPostFragment(post)

	const galleryImgs = [featuredImage, ...(ncmazGalleryImgs || [])]
		.map(img => img?.sourceUrl)
		.filter(img => !!img) as string[]

	const isPostMedia = () => postType === 'video' || postType === 'audio'

	const renderGallerySlider = () => {
		if (!galleryImgs || !galleryImgs.length) {
			return null
		}

		return (
			<GallerySlider
				href={uri || ''}
				galleryImgs={galleryImgs.filter(img => !!img) as string[]}
				className="absolute inset-0 z-10"
				galleryClass="absolute inset-0"
				ratioClass="absolute inset-0"
			/>
		)
	}

	const renderContent = () => {
		// GALLERY
		if (postType === 'gallery') {
			return renderGallerySlider()
		}

		// VIDEO
		if (postType === 'video' && !!ncmazVideoUrl?.videoUrl && isHover) {
			return <MediaVideo isHover videoUrl={ncmazVideoUrl.videoUrl} />
		}

		// AUDIO
		if (postType === 'audio' && !!ncmazAudioUrl) {
			return <MediaAudio post={post} />
		}

		// ICON
		return isPostMedia() ? (
			<span className="absolute inset-0 flex items-center justify-center">
				<PostTypeFeaturedIcon
					className="transform cursor-pointer transition-transform hover:scale-105"
					postType={postType}
				/>
			</span>
		) : null
	}

	return (
		<div className={`nc-PostFeaturedMedia relative ${className}`}>
			{postType !== 'gallery' && (
				<MyImage
					alt={title || 'Post Featured Image'}
					width={width}
					height={height}
					className="object-cover w-full h-full"
					src={featuredImage?.sourceUrl || ''}
					sizes={sizes}
				/>
			)}
			{renderContent()}
			{postType !== 'gallery' && (
				<Link
					href={uri || ''}
					className={`absolute inset-0 block ${
						!postType || postType === 'standard'
							? 'bg-black/20 opacity-0 transition-opacity group-hover:opacity-100'
							: ''
					}`}
				/>
			)}
		</div>
	)
}

export default PostFeaturedMedia
