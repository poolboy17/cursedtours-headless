'use client'

import { FC } from 'react'
import Image from 'next/image'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import ButtonSecondary from '@/components/Button/ButtonSecondary'

interface SectionHeroBrandedProps {
	className?: string
}

/**
 * Branded Hero Section for Cursed Tours
 * - Split layout: Text left, Image right (LCP optimized)
 * - Tagline: "Where History Haunts"
 */
const SectionHeroBranded: FC<SectionHeroBrandedProps> = ({ className = '' }) => {
	return (
		<section className={`nc-SectionHeroBranded relative overflow-hidden ${className}`}>
			{/* Background */}
			<div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950">
				<div 
					className="absolute inset-0 opacity-5"
					style={{
						backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
						backgroundSize: '40px 40px'
					}}
				/>
				<div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
				<div className="absolute bottom-20 right-1/3 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
			</div>

			{/* Content */}
			<div className="relative z-10 container mx-auto px-4 py-12 lg:py-20">
				<div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
					
					{/* Left: Text Content */}
					<div className="text-center lg:text-left order-2 lg:order-1">
						{/* Brand Name */}
						<h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 tracking-tight">
							Cursed Tours
						</h1>

						{/* Tagline */}
						<p className="text-xl sm:text-2xl lg:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 mb-6">
							Where History Haunts
						</p>

						{/* Subheading */}
						<p className="text-base sm:text-lg text-neutral-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
							Discover spine-chilling ghost tours, haunted locations, and paranormal experiences in cities around the world.
						</p>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
							<ButtonPrimary 
								href="/posts" 
								sizeClass="px-6 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg"
								className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 border-0 shadow-lg shadow-purple-500/25"
							>
								<svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
								</svg>
								Explore Ghost Tours
							</ButtonPrimary>
							<ButtonSecondary 
								href="/search/categories"
								sizeClass="px-6 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg"
								className="border-white/20 text-white hover:bg-white/10"
							>
								Browse Destinations
							</ButtonSecondary>
						</div>

						{/* Stats */}
						<div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-md mx-auto lg:mx-0">
							<div className="text-center lg:text-left">
								<div className="text-2xl sm:text-3xl font-bold text-white mb-1">500+</div>
								<div className="text-xs sm:text-sm text-neutral-400">Ghost Tours</div>
							</div>
							<div className="text-center lg:text-left border-x border-white/10 px-2">
								<div className="text-2xl sm:text-3xl font-bold text-white mb-1">50+</div>
								<div className="text-xs sm:text-sm text-neutral-400">Destinations</div>
							</div>
							<div className="text-center lg:text-left">
								<div className="text-2xl sm:text-3xl font-bold text-white mb-1">24/7</div>
								<div className="text-xs sm:text-sm text-neutral-400">Hauntings</div>
							</div>
						</div>
					</div>

					{/* Right: Hero Image */}
					<div className="order-1 lg:order-2 relative">
						<div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/20">
							{/* Glow effect behind image */}
							<div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 blur-2xl" />
							
							<div className="relative aspect-[3/2] lg:aspect-[4/3]">
								<Image
									src="/images/hero-ghost-tour.png"
									alt="Ghost tour group walking through haunted dungeon with flashlights"
									fill
									className="object-cover"
									sizes="(max-width: 1024px) 100vw, 50vw"
									priority={false}
									loading="lazy"
								/>
								{/* Subtle overlay for better blending */}
								<div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-purple-950/30" />
							</div>

							{/* Decorative border */}
							<div className="absolute inset-0 rounded-2xl lg:rounded-3xl border border-white/10" />
						</div>

						{/* Floating badge */}
						<div className="absolute -bottom-3 -left-3 lg:-bottom-4 lg:-left-4 bg-gradient-to-r from-red-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
							👻 Real Haunted Locations
						</div>
					</div>
				</div>
			</div>

			{/* Bottom fade */}
			<div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent" />
		</section>
	)
}

export default SectionHeroBranded
