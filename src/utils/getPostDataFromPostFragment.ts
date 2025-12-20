import { TPostCard } from '@/components/Card2/Card2'
import { FragmentType, useFragment } from '../__generated__'
import {
	NC_IMAGE_MEDIA_HAS_DETAIL_FRAGMENT,
	NC_POST_CARD_FRAGMENT,
	NC_POST_FULL_FRAGMENT,
	NC_POST_META_DATA_FULL_FRAGMENT,
} from '../fragments'
import { getCatgoryDataFromCategoryFragment } from './getCatgoryDataFromCategoryFragment'
import { getTagDataFromTagFragment } from './getTagDataFromTagFragment'
import { getUserDataFromUserCardFragment } from './getUserDataFromUserCardFragment'
import { NcmazFcImageHasDetailFieldsFragment } from '@/__generated__/graphql'
import { FragmentTypePostFullFields } from '@/container/type'

export type PostFormatNameType =
	| ''
	| 'audio'
	| 'gallery'
	| 'video'
	| 'aside'
	| 'chat'
	| 'image'
	| 'quote'
	| 'status'
	| 'standard'

/**
 * Extract the first image URL from HTML content
 * Used as fallback when no featured image is set
 */
function extractFirstImageFromContent(content: string): string | null {
	if (!content) return null
	
	// Match img src attribute (handles both single and double quotes)
	const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i)
	if (imgMatch && imgMatch[1]) {
		return imgMatch[1]
	}
	
	return null
}

export function getPostDataFromPostFragment(
	post:
		| FragmentType<typeof NC_POST_CARD_FRAGMENT>
		| FragmentType<typeof NC_POST_FULL_FRAGMENT>
		| FragmentTypePostFullFields
		| TPostCard,
) {
	const query = useFragment(
		NC_POST_FULL_FRAGMENT,
		post as FragmentType<typeof NC_POST_FULL_FRAGMENT>,
	)

	//
	const postFormats = (
		query.postFormats?.nodes?.[0]?.name || ''
	).toLowerCase() as PostFormatNameType
	const postFormatSlug = (
		query.postFormats?.nodes?.[0]?.slug || ''
	).toLowerCase()
	const postFormatsArr = query.postFormats?.nodes
	//
	const featuredImageFromWP = useFragment(
		NC_IMAGE_MEDIA_HAS_DETAIL_FRAGMENT,
		query.featuredImage?.node,
	)
	
	// Fallback: extract first image from content if no featured image
	const contentImageUrl = !featuredImageFromWP?.sourceUrl 
		? extractFirstImageFromContent(query.content || '')
		: null
	
	// Create a fallback featured image object if we found an image in content
	const featuredImage = featuredImageFromWP?.sourceUrl 
		? featuredImageFromWP 
		: contentImageUrl 
			? { 
				sourceUrl: contentImageUrl, 
				altText: query.title || 'Post image',
				// Minimal required fields for the fragment type
				__typename: 'MediaItem' as const,
				databaseId: 0,
			} as NcmazFcImageHasDetailFieldsFragment
			: featuredImageFromWP
	
	//
	const ncPostMetaData = useFragment(
		NC_POST_META_DATA_FULL_FRAGMENT,
		query.ncPostMetaData,
	)

	// ncmazGalleryImgs is a list of 8 images
	const ncmazGalleryImg1 = useFragment(
		NC_IMAGE_MEDIA_HAS_DETAIL_FRAGMENT,
		query.ncmazGalleryImgs?.image1?.node,
	)
	const ncmazGalleryImg2 = useFragment(
		NC_IMAGE_MEDIA_HAS_DETAIL_FRAGMENT,
		query.ncmazGalleryImgs?.image2?.node,
	)
	const ncmazGalleryImg3 = useFragment(
		NC_IMAGE_MEDIA_HAS_DETAIL_FRAGMENT,
		query.ncmazGalleryImgs?.image3?.node,
	)
	const ncmazGalleryImg4 = useFragment(
		NC_IMAGE_MEDIA_HAS_DETAIL_FRAGMENT,
		query.ncmazGalleryImgs?.image4?.node,
	)
	const ncmazGalleryImg5 = useFragment(
		NC_IMAGE_MEDIA_HAS_DETAIL_FRAGMENT,
		query.ncmazGalleryImgs?.image5?.node,
	)
	const ncmazGalleryImg6 = useFragment(
		NC_IMAGE_MEDIA_HAS_DETAIL_FRAGMENT,
		query.ncmazGalleryImgs?.image6?.node,
	)
	const ncmazGalleryImg7 = useFragment(
		NC_IMAGE_MEDIA_HAS_DETAIL_FRAGMENT,
		query.ncmazGalleryImgs?.image7?.node,
	)
	const ncmazGalleryImg8 = useFragment(
		NC_IMAGE_MEDIA_HAS_DETAIL_FRAGMENT,
		query.ncmazGalleryImgs?.image8?.node,
	)

	const ncmazGalleryImgs = [
		ncmazGalleryImg1,
		ncmazGalleryImg2,
		ncmazGalleryImg3,
		ncmazGalleryImg4,
		ncmazGalleryImg5,
		ncmazGalleryImg6,
		ncmazGalleryImg7,
		ncmazGalleryImg8,
	].filter((img) => img) as NcmazFcImageHasDetailFieldsFragment[]

	return {
		...query,
		uri: query.uri || '',
		link: '',
		title: query.title || '',
		excerpt: query.excerpt || '',
		date: query.date || '',
		content: query.content || '',
		postFormats,
		postFormatSlug,
		postFormatsArr,
		featuredImage,
		ncPostMetaData,
		ncmazGalleryImgs,
		categories: {
			nodes: query.categories?.nodes?.map((term) =>
				getCatgoryDataFromCategoryFragment(term),
			),
		},
		tags: {
			nodes: query.tags?.nodes?.map((term) => getTagDataFromTagFragment(term)),
		},
		author: getUserDataFromUserCardFragment({ ...query.author?.node }),
		// @ts-ignore
		editorBlocks: query.editorBlocks || undefined,
	}
}
