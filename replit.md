# NCMAZ Faust - Next.js Headless WordPress Template

## Overview
This is a Next.js headless WordPress application built with Faust.js. It serves as a frontend for a WordPress backend using the WPGraphQL API.

## Technology Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Sass
- **State Management**: Redux Toolkit
- **CMS**: WordPress with Faust.js, WPGraphQL
- **Build Tools**: Faust CLI, GraphQL Codegen

## Project Structure
```
/src
├── app/             # Next.js app directory
├── components/      # React components
├── container/       # Page containers
├── data/           # Static data
├── fragments/      # GraphQL fragments
├── hooks/          # Custom React hooks
├── pages/          # Next.js pages
├── stores/         # Redux stores
├── styles/         # CSS/SCSS styles
├── utils/          # Utility functions
├── wp-blocks/      # WordPress block components
└── wp-templates/   # WordPress template components
/public             # Static assets
```

## Required Environment Variables
The following secrets/environment variables must be configured:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_WORDPRESS_URL` | Your WordPress site URL (without trailing slash) |
| `FAUST_SECRET_KEY` | Secret key from WordPress Faust plugin settings |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | (Optional) Google Analytics ID |

## Development Commands
- `npm run dev` - Start development server on port 5000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run generate` - Generate GraphQL types
- `npm run codegen` - Run GraphQL codegen

## WordPress Requirements
The WordPress backend must have these plugins installed:
- **Faust.js WordPress Plugin** - Connects WordPress to the headless frontend
- **WPGraphQL** - Exposes WordPress data via GraphQL API
- **WPGraphQL Content Blocks** - Exposes Gutenberg block data to GraphQL (required for post content)
- **ncmaz-faust-core** - Custom plugin for theme-specific fields (located at `NCMAZ_FAUST/wp-plugin/ncmaz-faust-core.zip`)

The ncmaz-faust-core plugin adds:
- Post metadata (views, reactions, etc.)
- User profile fields (social links, bio, etc.)
- Gallery images and multimedia post types

## Sitemap Configuration
- **next-sitemap** generates sitemap.xml and robots.txt after build
- Site URL configured in `.env.local` as `NEXT_PUBLIC_URL=https://cursedtours.com`
- Sitemap excludes dashboard/admin pages
- Links to WordPress sitemap for dynamic content

Generated files:
- `public/sitemap.xml` - Sitemap index
- `public/sitemap-0.xml` - Main sitemap with all pages
- `public/robots.txt` - Search engine directives

## Vercel Deployment

To deploy to Vercel:

1. Push this repository to GitHub
2. Import the project in Vercel
3. Add these environment variables in Vercel Project Settings:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_WORDPRESS_URL` | Yes | WordPress site URL (no trailing slash) |
| `FAUST_SECRET_KEY` | Yes | From WordPress Settings > Headless |
| `NEXT_PUBLIC_URL` | Yes | Your Vercel domain for sitemap |
| `NEXT_PUBLIC_SITE_DIRECTION` | No | `ltr` or `rtl` (default: ltr) |
| `NEXT_PUBLIC_SITE_GEAR_ICON` | No | `true` or `false` (default: false) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | Google Analytics ID |

See `.env.example` for the complete template.

## MCP Server (WordPress Content Management)

The `mcp-server/` directory contains an MCP server for managing WordPress content:

```bash
cd mcp-server
npm install
npm run build
npm start
```

**Available Tools:**
- Posts: list, get, create, update, delete
- Categories: list, create, update, delete
- Tags: list, create, update, delete
- Media: list, upload, delete
- GraphQL: introspect schema, execute queries

**Required Credentials** (for write operations):
- `WP_USERNAME`: WordPress admin username
- `WP_APPLICATION_PASSWORD`: Application password from WordPress

See `mcp-server/README.md` for full documentation.

## Recent Changes
- Added MCP server for WordPress content management
- Configured for Replit environment (port 5000, allowed dev origins)
- Set up environment variables for development
- Disabled persisted queries for broader WordPress compatibility
- Simplified dev script to avoid codegen watcher issues
- Fixed sitemap generation with correct production URL
- Added WPGraphQL Content Blocks plugin requirement
- Added `.env.example` for Vercel deployment
