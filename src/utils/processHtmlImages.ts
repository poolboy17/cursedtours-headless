/**
 * Utility to process HTML content and ensure all <img> tags have
 * explicit width and height attributes for CLS (Cumulative Layout Shift) prevention.
 * 
 * WordPress content often includes images without dimensions, which causes
 * layout shifts during page load. This utility adds default dimensions
 * or extracts them from existing attributes/styles.
 */

// Default dimensions for images without explicit size
const DEFAULT_WIDTH = 800
const DEFAULT_HEIGHT = 600

/**
 * Extract width/height from WordPress srcset or size hints
 */
function extractDimensionsFromSrcset(srcset: string): { width?: number; height?: number } {
	// WordPress often includes dimensions in srcset like: image-300x200.jpg 300w
	const match = srcset.match(/(\d+)x(\d+)/)
	if (match) {
		return { width: parseInt(match[1]), height: parseInt(match[2]) }
	}
	
	// Try to extract from width descriptor
	const widthMatch = srcset.match(/(\d+)w/)
	if (widthMatch) {
		const width = parseInt(widthMatch[1])
		return { width, height: Math.round(width * 0.75) } // Assume 4:3 aspect ratio
	}
	
	return {}
}

/**
 * Extract dimensions from inline style
 */
function extractDimensionsFromStyle(style: string): { width?: number; height?: number } {
	const widthMatch = style.match(/width:\s*(\d+)px/i)
	const heightMatch = style.match(/height:\s*(\d+)px/i)
	
	return {
		width: widthMatch ? parseInt(widthMatch[1]) : undefined,
		height: heightMatch ? parseInt(heightMatch[1]) : undefined,
	}
}

/**
 * Extract dimensions from WordPress class names (e.g., wp-image-123, size-medium)
 */
function extractDimensionsFromClass(className: string): { width?: number; height?: number } {
	// WordPress size classes
	if (className.includes('size-thumbnail')) return { width: 150, height: 150 }
	if (className.includes('size-medium')) return { width: 300, height: 225 }
	if (className.includes('size-large')) return { width: 1024, height: 768 }
	if (className.includes('size-full')) return { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT }
	
	return {}
}

/**
 * Process HTML string to add width/height attributes to all img tags
 * that don't already have them.
 */
export function processHtmlImages(html: string): string {
	if (!html || typeof html !== 'string') return html

	// Match img tags that might be missing width or height
	return html.replace(
		/<img\b([^>]*)>/gi,
		(match, attributes) => {
			// Check if width and height already exist
			const hasWidth = /\bwidth\s*=/i.test(attributes)
			const hasHeight = /\bheight\s*=/i.test(attributes)
			
			// If both exist, return unchanged
			if (hasWidth && hasHeight) return match
			
			// Extract existing dimensions from various sources
			let width: number | undefined
			let height: number | undefined
			
			// Try extracting from existing width/height attributes
			if (hasWidth && !hasHeight) {
				const widthAttr = attributes.match(/\bwidth\s*=\s*["']?(\d+)["']?/i)
				if (widthAttr) {
					width = parseInt(widthAttr[1])
					height = Math.round(width * 0.75) // Assume 4:3 aspect ratio
				}
			} else if (!hasWidth && hasHeight) {
				const heightAttr = attributes.match(/\bheight\s*=\s*["']?(\d+)["']?/i)
				if (heightAttr) {
					height = parseInt(heightAttr[1])
					width = Math.round(height * 1.33) // Assume 4:3 aspect ratio
				}
			}
			
			// Try srcset
			if (!width || !height) {
				const srcsetMatch = attributes.match(/\bsrcset\s*=\s*["']([^"']+)["']/i)
				if (srcsetMatch) {
					const dims = extractDimensionsFromSrcset(srcsetMatch[1])
					width = width || dims.width
					height = height || dims.height
				}
			}
			
			// Try inline style
			if (!width || !height) {
				const styleMatch = attributes.match(/\bstyle\s*=\s*["']([^"']+)["']/i)
				if (styleMatch) {
					const dims = extractDimensionsFromStyle(styleMatch[1])
					width = width || dims.width
					height = height || dims.height
				}
			}
			
			// Try class names
			if (!width || !height) {
				const classMatch = attributes.match(/\bclass\s*=\s*["']([^"']+)["']/i)
				if (classMatch) {
					const dims = extractDimensionsFromClass(classMatch[1])
					width = width || dims.width
					height = height || dims.height
				}
			}
			
			// Try to extract from src filename (WordPress pattern: image-WIDTHxHEIGHT.jpg)
			if (!width || !height) {
				const srcMatch = attributes.match(/\bsrc\s*=\s*["']([^"']+)["']/i)
				if (srcMatch) {
					const filenameMatch = srcMatch[1].match(/-(\d+)x(\d+)\.[a-z]+$/i)
					if (filenameMatch) {
						width = width || parseInt(filenameMatch[1])
						height = height || parseInt(filenameMatch[2])
					}
				}
			}
			
			// Use defaults if still not found
			width = width || DEFAULT_WIDTH
			height = height || DEFAULT_HEIGHT
			
			// Build the new attributes string
			let newAttributes = attributes.trim()
			
			if (!hasWidth) {
				newAttributes += ` width="${width}"`
			}
			if (!hasHeight) {
				newAttributes += ` height="${height}"`
			}
			
			// Add loading="lazy" if not present for better performance
			if (!/\bloading\s*=/i.test(newAttributes)) {
				newAttributes += ' loading="lazy"'
			}
			
			// Add decoding="async" if not present
			if (!/\bdecoding\s*=/i.test(newAttributes)) {
				newAttributes += ' decoding="async"'
			}
			
			return `<img${newAttributes}>`
		}
	)
}

export default processHtmlImages
