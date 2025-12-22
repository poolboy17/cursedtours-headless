import { FC } from 'react'
import Image from 'next/image'
import ButtonSecondary from '@/components/Button/ButtonSecondary'

// Base64 blur placeholder for hero image (dark purple/slate tones)
// This shows instantly while the full image loads, improving perceived LCP
const HERO_BLUR_PLACEHOLDER = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAKABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUH/8QAIxAAAgEDBAIDAQAAAAAAAAAAAQIDBAURAAYSITFBE1Fh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwT/xAAcEQACAgIDAAAAAAAAAAAAAAABAgADBBESITH/2gAMAwEAAhEDEEA/ANHuG4rnb7hUU1Lb6aop4pGSKdpyjOoOAwGDjI9ajf3PuP8A0NF/Y/1T9xf5Vc/7yf8AZpWs4TqOlVcxMjk2YE+yT7J96n/Z'

interface SectionHeroBrandedProps {
	className?: string
}

/**
 * Branded Hero Section for Cursed Tours
 * - Split layout: Text left, Image right (LCP optimized)
 * - Responsive: Side-by-side on md+, stacked on mobile
 * - Tagline: "Where History Haunts"
 */
const SectionHeroBranded: FC<SectionHeroBrandedProps> = ({ className = '' }) => {
	return (
		<section className={`nc-SectionHeroBranded relative overflow-hidden ${className}`}>
			{/* Background - Static gradients only, no animations for better LCP */}
			<div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950">
				<div 
					className="absolute inset-0 opacity-5"
					style={{
						backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
						backgroundSize: '40px 40px'
					}}
				/>
				<div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px]" />
				<div className="absolute bottom-20 right-1/3 w-96 h-96 bg-red-500/10 rounded-full blur-[120px]" />
			</div>

			{/* Content */}
			<div className="relative z-10 container mx-auto px-4 py-8 md:py-12 lg:py-16">
				<div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
					
					{/* Left: Text Content - Always first on mobile for above-fold visibility */}
					<div className="text-center md:text-left">
						{/* Brand Name */}
						<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-2 md:mb-3 tracking-tight">
							Cursed Tours
						</h1>

						{/* Tagline */}
						<p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 mb-4 md:mb-6">
							Where History Haunts
						</p>

						{/* Subheading */}
						<p className="text-sm sm:text-base md:text-lg text-neutral-300 mb-6 md:mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
							Discover spine-chilling ghost tours, haunted locations, and paranormal experiences in cities around the world.
						</p>

						{/* CTA Button */}
						<div className="flex items-center justify-center md:justify-start mb-6 md:mb-10">
							<ButtonSecondary 
								href="/search/categories"
								sizeClass="px-5 py-3 sm:px-6 sm:py-3.5 md:px-8 md:py-4 text-sm sm:text-base md:text-lg"
								className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto"
							>
								Browse Destinations
							</ButtonSecondary>
						</div>

						{/* Stats */}
						<div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-sm md:max-w-md mx-auto md:mx-0">
							<div className="text-center md:text-left">
								<div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">500+</div>
								<div className="text-xs sm:text-sm text-neutral-400">Ghost Tours</div>
							</div>
							<div className="text-center md:text-left border-x border-white/10 px-2">
								<div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">50+</div>
								<div className="text-xs sm:text-sm text-neutral-400">Destinations</div>
							</div>
							<div className="text-center md:text-left">
								<div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">24/7</div>
								<div className="text-xs sm:text-sm text-neutral-400">Hauntings</div>
							</div>
						</div>
					</div>

					{/* Right: Hero Image */}
					<div className="relative mt-4 md:mt-0">
						<div className="relative rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/20">
							{/* Glow effect behind image */}
							<div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 blur-2xl" />
							
							{/* Optimized WebP for LCP - 62KB vs 2.1MB PNG */}
							<Image
								src="/images/hero-ghost-tour.webp"
								alt="Ghost tour group walking through haunted dungeon with flashlights"
								width={1536}
								height={1024}
								className="w-full h-auto object-cover rounded-xl md:rounded-2xl lg:rounded-3xl"
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 700px"
								priority
								fetchPriority="high"
								placeholder="blur"
								blurDataURL={HERO_BLUR_PLACEHOLDER}
							/>
							{/* Subtle overlay for better blending */}
							<div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-purple-950/30 rounded-xl md:rounded-2xl lg:rounded-3xl" />

							{/* Decorative border */}
							<div className="absolute inset-0 rounded-xl md:rounded-2xl lg:rounded-3xl border border-white/10" />
						</div>

						{/* Floating badge */}
						<div className="absolute -bottom-2 -left-2 md:-bottom-3 md:-left-3 lg:-bottom-4 lg:-left-4 bg-gradient-to-r from-red-600 to-purple-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium shadow-lg">
							👻 Real Haunted Locations
						</div>
					</div>
				</div>
			</div>

			{/* Bottom fade */}
			<div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent" />
		</section>
	)
}

export default SectionHeroBranded
