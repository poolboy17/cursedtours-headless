'use client'

import { FC } from 'react'
import Link from 'next/link'
import ButtonPrimary from '@/components/Button/ButtonPrimary'
import ButtonSecondary from '@/components/Button/ButtonSecondary'

interface SectionHeroBrandedProps {
	className?: string
}

/**
 * Branded Hero Section for Cursed Tours
 * - Atmospheric dark design with ghostly elements
 * - Strong branding and call-to-action
 * - Animated subtle effects
 */
const SectionHeroBranded: FC<SectionHeroBrandedProps> = ({ className = '' }) => {
	return (
		<section className={`nc-SectionHeroBranded relative overflow-hidden ${className}`}>
			{/* Background with gradient and pattern */}
			<div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950">
				{/* Animated fog/mist effect */}
				<div className="absolute inset-0 opacity-30">
					<div className="absolute inset-0 bg-[url('/images/fog-pattern.png')] bg-cover animate-pulse" />
				</div>
				
				{/* Subtle grid pattern */}
				<div 
					className="absolute inset-0 opacity-5"
					style={{
						backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
						backgroundSize: '40px 40px'
					}}
				/>
				
				{/* Glowing orbs */}
				<div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
				<div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px]" />
			</div>

			{/* Content */}
			<div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
				<div className="max-w-4xl mx-auto text-center">
					{/* Badge */}
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
						</span>
						<span className="text-sm text-neutral-300">Discover the supernatural</span>
					</div>

					{/* Main Heading */}
					<h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
						<span className="block">Explore the World's Most</span>
						<span className="block bg-gradient-to-r from-red-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
							Haunted Destinations
						</span>
					</h1>

					{/* Subheading */}
					<p className="text-lg sm:text-xl text-neutral-300 mb-10 max-w-2xl mx-auto leading-relaxed">
						Uncover spine-chilling ghost tours, paranormal investigations, and haunted locations. 
						Your next supernatural adventure awaits.
					</p>

					{/* CTA Buttons */}
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
						<ButtonPrimary 
							href="/posts" 
							sizeClass="px-8 py-4 text-lg"
							className="bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 border-0 shadow-lg shadow-purple-500/25"
						>
							<svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
							Explore Ghost Tours
						</ButtonPrimary>
						<ButtonSecondary 
							href="/search/categories"
							sizeClass="px-8 py-4 text-lg"
							className="border-white/20 text-white hover:bg-white/10"
						>
							Browse Destinations
						</ButtonSecondary>
					</div>

					{/* Stats */}
					<div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
						<div className="text-center">
							<div className="text-3xl lg:text-4xl font-bold text-white mb-1">500+</div>
							<div className="text-sm text-neutral-400">Ghost Tours</div>
						</div>
						<div className="text-center border-x border-white/10">
							<div className="text-3xl lg:text-4xl font-bold text-white mb-1">50+</div>
							<div className="text-sm text-neutral-400">Destinations</div>
						</div>
						<div className="text-center">
							<div className="text-3xl lg:text-4xl font-bold text-white mb-1">24/7</div>
							<div className="text-sm text-neutral-400">Hauntings</div>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom fade to content */}
			<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent" />
		</section>
	)
}

export default SectionHeroBranded
