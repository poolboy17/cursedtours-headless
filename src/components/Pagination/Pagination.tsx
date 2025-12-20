'use client'

import { FC } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import twFocusClass from '@/utils/twFocusClass'

interface PaginationProps {
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
	className?: string
}

const Pagination: FC<PaginationProps> = ({
	currentPage,
	totalPages,
	onPageChange,
	className = '',
}) => {
	// Generate page numbers to display
	const getPageNumbers = () => {
		const pages: (number | string)[] = []
		const showEllipsisStart = currentPage > 3
		const showEllipsisEnd = currentPage < totalPages - 2

		if (totalPages <= 7) {
			// Show all pages if 7 or fewer
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i)
			}
		} else {
			// Always show first page
			pages.push(1)

			if (showEllipsisStart) {
				pages.push('...')
			}

			// Show pages around current
			const start = Math.max(2, currentPage - 1)
			const end = Math.min(totalPages - 1, currentPage + 1)

			for (let i = start; i <= end; i++) {
				if (i !== 1 && i !== totalPages) {
					pages.push(i)
				}
			}

			if (showEllipsisEnd) {
				pages.push('...')
			}

			// Always show last page
			pages.push(totalPages)
		}

		return pages
	}

	if (totalPages <= 1) return null

	const pages = getPageNumbers()

	return (
		<nav
			className={`nc-Pagination flex items-center justify-center gap-1 ${className}`}
			aria-label="Pagination"
		>
			{/* Previous button */}
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className={`flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 ${twFocusClass()}`}
				aria-label="Previous page"
			>
				<ChevronLeftIcon className="h-5 w-5" />
			</button>

			{/* Page numbers */}
			{pages.map((page, index) => {
				if (page === '...') {
					return (
						<span
							key={`ellipsis-${index}`}
							className="flex h-10 w-10 items-center justify-center text-neutral-500"
						>
							...
						</span>
					)
				}

				const pageNum = page as number
				const isActive = pageNum === currentPage

				return (
					<button
						key={pageNum}
						onClick={() => onPageChange(pageNum)}
						className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${twFocusClass()} ${
							isActive
								? 'bg-gradient-to-r from-purple-600 to-red-600 text-white shadow-lg'
								: 'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'
						}`}
						aria-label={`Page ${pageNum}`}
						aria-current={isActive ? 'page' : undefined}
					>
						{pageNum}
					</button>
				)
			})}

			{/* Next button */}
			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className={`flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 ${twFocusClass()}`}
				aria-label="Next page"
			>
				<ChevronRightIcon className="h-5 w-5" />
			</button>
		</nav>
	)
}

export default Pagination
