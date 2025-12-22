'use client'

import { FC } from 'react'
import dynamic from 'next/dynamic'
import { UserIcon } from '../Icons/Icons'

// Lazy load the heavy AvatarDropdown component (HeadlessUI + Redux + Apollo)
const AvatarDropdown = dynamic(() => import('./AvatarDropdown'), {
	ssr: false,
	loading: () => <AvatarDropdownPlaceholder />,
})

// Static placeholder matching AvatarDropdown's button structure
// Shows user icon (default state before auth check)
const AvatarDropdownPlaceholder: FC = () => (
	<div className="AvatarDropdown">
		<div className="relative">
			<button
				className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 focus:outline-none sm:h-12 sm:w-12 dark:text-neutral-300 dark:hover:bg-neutral-800"
				aria-label="User menu"
			>
				<UserIcon />
			</button>
		</div>
	</div>
)

interface Props {
	className?: string
}

/**
 * Lazy version of AvatarDropdown
 * - Shows static user icon placeholder immediately
 * - Defers HeadlessUI Popover + Redux + Auth logic until client hydration
 */
const AvatarDropdownLazy: FC<Props> = ({ className = '' }) => {
	return <AvatarDropdown className={className} />
}

export default AvatarDropdownLazy
