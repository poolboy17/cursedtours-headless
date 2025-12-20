# Cursed Tours - Headless WordPress Setup Guide

This guide covers the complete setup for running cursedtours.com as a headless WordPress site with a Next.js frontend on Vercel.

---

## Architecture Overview

```
┌─────────────────────┐      GraphQL      ┌─────────────────────┐
│   WordPress (WP)    │◄─────────────────►│   Next.js (Vercel)  │
│   cursedtours.com   │                   │   cursedtours.com   │
│   (content API)     │                   │   (frontend)        │
└─────────────────────┘                   └─────────────────────┘
         │                                          │
    WP Admin only                            All public traffic
    /wp-admin/                               serves from here
```

---

## Part 1: Vercel Configuration

### 1.1 Add Domain to Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (`new-headless-site`)
3. Go to **Settings** → **Domains**
4. Add `cursedtours.com`
5. Also add `www.cursedtours.com` (redirect to root)

### 1.2 Configure Environment Variables in Vercel

Go to **Settings** → **Environment Variables** and add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_WORDPRESS_URL` | `https://cursedtours.com` | All |
| `FAUST_SECRET_KEY` | `[from WordPress]` | All |
| `NEXT_PUBLIC_URL` | `https://cursedtours.com` | Production |

**To get FAUST_SECRET_KEY:**
1. Log into WordPress admin: `https://cursedtours.com/wp-admin/`
2. Go to **Settings** → **Faust**
3. Copy the **Secret Key**

---

## Part 2: WordPress Configuration

### 2.1 FaustWP Settings

1. Go to **Settings** → **Faust**
2. Configure:
   - **Front-end site URL**: `https://cursedtours.com`
   - **Enable Post/Page Previews**: ✅ Checked
   - **Disable WordPress theme site**: ✅ Checked

### 2.2 Permalink Settings

1. Go to **Settings** → **Permalinks**
2. Select **Post name**: `/%postname%/`

---

## Part 3: Verification Checklist

- [ ] `https://cursedtours.com` loads the Next.js site
- [ ] `https://cursedtours.com/robots.txt` returns valid robots file
- [ ] `https://cursedtours.com/wordpress-sitemap.xml` generates sitemap
- [ ] `https://cursedtours.com/wp-admin/` still works for admin
- [ ] Blog posts load correctly
- [ ] Images load from WordPress media library

---

## Part 4: Google Search Console

### Submit Sitemaps
- `https://cursedtours.com/sitemap.xml`
- `https://cursedtours.com/wordpress-sitemap.xml`

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_WORDPRESS_URL` | ✅ | WordPress site URL |
| `FAUST_SECRET_KEY` | ✅ | FaustWP authentication |
| `NEXT_PUBLIC_URL` | ✅ | Frontend URL (for sitemaps) |
