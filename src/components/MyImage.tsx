import Image, { ImageProps } from 'next/image'
import { FC } from 'react'

export interface Props extends ImageProps {
	enableDefaultPlaceholder?: boolean
	defaultPlaceholderDataUrl?: string
}

// Low-quality image placeholder to prevent CLS
const BLUR_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwYABQoBgKHhfPsAAAAASUVORK5CYII='

const MyImage: FC<Props> = ({
	enableDefaultPlaceholder = true,
	defaultPlaceholderDataUrl = BLUR_DATA_URL,
	loading = 'lazy',
	sizes: propSizes,
	...props
}) => {
	// Determine if we should use blur placeholder
	const shouldUseBlur = enableDefaultPlaceholder && !props.priority && props.src
	const sizes = propSizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'

	return (
		<Image
			{...props}
			sizes={sizes}
			loading={props.priority ? undefined : loading}
			placeholder={shouldUseBlur ? 'blur' : 'empty'}
			blurDataURL={shouldUseBlur ? defaultPlaceholderDataUrl : undefined}
			className={`${props.className || ''} ${
				props.src ? '' : 'dark:brightness-75 dark:filter'
			}`}
			src={props.src || '/images/placeholder.png'}
		/>
	)
}

export default MyImage
