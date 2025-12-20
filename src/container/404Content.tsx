import MyImage from '@/components/MyImage'
import SEO from '@/components/SEO/SEO'
import { NC_SITE_SETTINGS } from '@/contains/site-settings'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

const POPULAR_CATEGORIES = [
	{ name: 'Haunted Locations', slug: 'haunted-places-case-studies' },
	{ name: 'Abandoned Asylums & Hospitals', slug: 'abandoned-asylums-hospitals' },
	{ name: 'Ghost Hunting Guides', slug: 'ghost-hunting-techniques-tools' },
	{ name: 'Historical Hauntings', slug: 'historical-hauntings-insights' },
	{ name: 'Personal Ghost Encounters', slug: 'personal-ghost-encounters' },
]

const RECENT_POSTS = [
	{ title: 'Victorian Haunted House Investigations', slug: '5-victorian-haunted-house-investigation-tips' },
	{ title: '10 Best Documented Paranormal Investigations', slug: '10-best-documented-paranormal-investigations-and-hauntings' },
	{ title: 'Abandoned Asylum Ghost Tours', slug: 'top-abandoned-asylum-ghost-tour-locations-worldwide-2' },
]

export default function Page404Content() {
	const router = useRouter()
	const [searchQuery, setSearchQuery] = useState('')

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (searchQuery.trim()) {
			router.push(`/search/posts/?search=${encodeURIComponent(searchQuery.trim())}`)
		}
	}

	return (
		<div className="">
			<SEO
				title={'Page Not Found (404) - Cursed Tours'}
				description={'Sorry, we couldn\'t find the page you\'re looking for. Explore our haunted destinations, ghost hunting guides, and paranormal investigations.'}
			/>

			<main className="mx-auto w-full max-w-7xl px-6 pb-16 pt-5 sm:pb-20 lg:px-8">
				<div className="mx-auto max-w-2xl text-center">
					<Image
						src={'/images/404.webp'}
						width={750}
						height={500}
						alt="404 - Page not found"
						className="mx-auto w-auto"
					/>
				</div>
				<div className="mx-auto max-w-2xl text-center">
					<h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
						Page not found
					</h1>
					<p className="mt-4 text-base leading-7 text-gray-600 dark:text-neutral-400">
						Sorry, we couldn&apos;t find the page you&apos;re looking for. 
						It may have been moved, deleted, or never existed.
					</p>

					{/* Search Box */}
					<form onSubmit={handleSearch} className="mt-8 mx-auto max-w-md">
						<label htmlFor="search-404" className="sr-only">Search our site</label>
						<div className="relative">
							<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
								<svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
									<path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
								</svg>
							</div>
							<input
								id="search-404"
								name="search"
								type="search"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search haunted places, ghost tours..."
								className="block w-full rounded-full border-0 bg-gray-100 py-3 pl-12 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:bg-neutral-800 dark:text-white dark:ring-neutral-700 dark:placeholder:text-neutral-500 sm:text-sm sm:leading-6"
							/>
						</div>
						<button
							type="submit"
							className="mt-3 w-full rounded-full bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:bg-primary-500 dark:hover:bg-primary-400"
						>
							Search
						</button>
					</form>

					{/* Back to Home */}
					<div className="mt-8 flex justify-center">
						<Link
							href="/"
							className="text-sm font-semibold leading-7 text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-500"
						>
							<span className="me-2 rtl:rotate-180" aria-hidden="true">
								&larr;
							</span>
							Back to home
						</Link>
					</div>
				</div>

				{/* Popular Categories & Recent Posts */}
				<div className="mx-auto mt-16 max-w-4xl">
					<div className="grid gap-8 sm:grid-cols-2">
						{/* Popular Categories */}
						<div className="rounded-2xl bg-gray-50 p-6 dark:bg-neutral-800/50">
							<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
								Explore Categories
							</h2>
							<p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
								Browse our most popular topics
							</p>
							<ul className="mt-4 space-y-3">
								{POPULAR_CATEGORIES.map((category) => (
									<li key={category.slug}>
										<Link
											href={`/category/${category.slug}/`}
											className="group flex items-center text-sm text-gray-600 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400"
										>
											<span className="mr-2 text-gray-400 group-hover:text-primary-500 dark:text-neutral-500">→</span>
											{category.name}
										</Link>
									</li>
								))}
							</ul>
						</div>

						{/* Recent Posts */}
						<div className="rounded-2xl bg-gray-50 p-6 dark:bg-neutral-800/50">
							<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
								Popular Articles
							</h2>
							<p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
								Start with these reader favorites
							</p>
							<ul className="mt-4 space-y-3">
								{RECENT_POSTS.map((post) => (
									<li key={post.slug}>
										<Link
											href={`/${post.slug}/`}
											className="group flex items-center text-sm text-gray-600 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400"
										>
											<span className="mr-2 text-gray-400 group-hover:text-primary-500 dark:text-neutral-500">→</span>
											{post.title}
										</Link>
									</li>
								))}
							</ul>
							<div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700">
								<Link
									href="/posts/"
									className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
								>
									View all posts →
								</Link>
							</div>
						</div>
					</div>
				</div>
			</main>

			<footer className="border-t border-gray-100 py-6 sm:py-10 dark:border-neutral-600">
				<div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-8 px-6 sm:flex-row lg:px-8">
					<p className="text-sm leading-7 text-gray-400">
						{NC_SITE_SETTINGS.site_footer?.all_rights_reserved_text}
					</p>
					<div className="hidden sm:block sm:h-7 sm:w-px sm:flex-none sm:bg-gray-200 dark:bg-neutral-600" />
					<div className="flex gap-x-4">
						{NC_SITE_SETTINGS.site_socials?.map(item => (
							<a
								key={item?.name}
								href={item?.url}
								className="relative block"
								target="_blank"
								rel="noreferrer"
							>
								<span className="absolute -inset-0.5 hidden rounded-lg bg-neutral-300 dark:block"></span>
								<span className="sr-only">{item?.name}</span>
								<MyImage
									width={22}
									height={22}
									className="max-h-[22px] opacity-60 hover:opacity-100"
									src={item?.icon || ''}
									alt={item?.name || ''}
								/>
							</a>
						))}
					</div>
				</div>
			</footer>
		</div>
	)
}
