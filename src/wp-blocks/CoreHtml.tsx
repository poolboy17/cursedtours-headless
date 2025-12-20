'use client'

import React, { useEffect, useRef } from 'react'
import { processHtmlImages } from '@/utils/processHtmlImages'

//
const CoreHtml = (props: any) => {
	const { renderedHtml } = props || {}

	const scriptExecutedRef = useRef(false)
	const containerRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		if (containerRef.current && !scriptExecutedRef.current) {
			// Process images to add width/height for CLS prevention, then insert the HTML
			const processedHtml = processHtmlImages(renderedHtml)
			containerRef.current.innerHTML = processedHtml

			// Execute any scripts
			const scripts = containerRef.current.getElementsByTagName('script')
			for (let i = 0; i < scripts.length; i++) {
				const script = scripts[i]
				const scriptContent = script.innerHTML

				// Use Function constructor to create a new scope for each script
				const executeScript = new Function(scriptContent)
				executeScript()
			}

			scriptExecutedRef.current = true
		}
	}, [renderedHtml])

	return <div ref={containerRef}></div>
}

CoreHtml.displayName = 'CoreHtml'
export default CoreHtml
