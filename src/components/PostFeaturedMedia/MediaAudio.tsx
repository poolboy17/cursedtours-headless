import { FC } from 'react'
import { PostDataFragmentType } from '@/data/types'

export interface MediaAudioProps {
	post: PostDataFragmentType
}

// Audio player functionality removed - posts display as regular content
const MediaAudio: FC<MediaAudioProps> = ({ post }) => {
	return null
}

export default MediaAudio
