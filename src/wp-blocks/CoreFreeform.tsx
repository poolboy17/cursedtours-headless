import React from 'react'
import { processHtmlImages } from '@/utils/processHtmlImages'

//
const CoreFreeform = (props: any) => {
	const { renderedHtml } = props || {}

	let processedHtml = renderedHtml
	
	// Process images to add width/height for CLS prevention
	processedHtml = processHtmlImages(processedHtml)
	
	// Check if renderedHtml has <table> and wrap it
	if (processedHtml?.includes('<table')) {
		processedHtml = wrapTablesInDiv(processedHtml)
	}

	return (
		<div
			className="CoreFreeform overflow-hidden"
			dangerouslySetInnerHTML={{ __html: processedHtml || '' }}
		></div>
	)
}

export function wrapTablesInDiv(html: string): string {
	// Regex to find <table> tags not inside <code> and not already wrapped by div.table-wrapper
	const tableRegex =
		/(?<!<code[^>]*>)(?<!<div class="table-wrapper">[\s\S]*?)(<table\b[^>]*>[\s\S]*?<\/table>)(?![^<]*<\/code>)/gi

	// Replace each matching <table> with a <div> wrapper around it
	return html.replace(tableRegex, '<div class="table-wrapper">$1</div>')
}

CoreFreeform.displayName = 'CoreFreeform'
export default CoreFreeform
