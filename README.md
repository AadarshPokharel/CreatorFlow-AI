# CreatorFlow AI

CreatorFlow AI is a full-stack Next.js 15 application for creating and organizing **original** short-form content for TikTok, Instagram Reels, and YouTube Shorts.

The product is explicitly designed to avoid scraping, downloading, copying, or reposting copyrighted social content. It generates only original draft ideas and helps manage a creator-owned workflow.

## Stack

- Next.js 15 App Router
- React + TypeScript
- Tailwind CSS
- Supabase Auth + Database + Storage
- Zustand
- React Hook Form
- Zod
- Vercel-ready architecture

## What’s Included

- Premium dark UI inspired by Linear, Notion, and Framer
- Authentication flows: sign up, login, forgot password, email verification callback
- Protected app shell with sidebar + mobile navigation
- Dashboard with:
  - today’s content
  - scheduled content
  - drafts
  - posted content
  - analytics pulse
  - AI suggestions
  - recent projects
  - calendar preview
  - notifications
  - daily auto-generate controls
- AI Workspace for original content generation:
  - platform
  - niche
  - tone
  - duration
  - video idea
  - hook
  - script
  - shot list
  - voiceover script
  - CTA
  - caption
  - SEO title
  - hashtags
  - thumbnail idea
- Video staging area for creator-owned assets, subtitles, overlays, progress-bar planning, and export queue hooks
- Content library with search, filter, sort, archive, delete, duplicate, folders, tags, and favorites
- Calendar planner
- Analytics page with manual metric entry and performance summaries
- Settings page with profile, profile photo upload, AI preferences, notification settings, storage usage, and API-key readiness
- Supabase schema with normalized tables and Row Level Security
- Daily draft cron endpoint for future automated generation

## Project Structure

```text
src/
  app/
    (auth)/
    (app)/
    api/cron/daily-drafts/
  components/
    analytics/
    auth/
    dashboard/
    layout/
    settings/
    ui/
    workspace/
  lib/
    ai/
    auth/
    server/
    security/
    supabase/
    validations/
  store/
supabase/
  schema.sql
  seed.sql
```

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Copy the environment template:

```bash
cp .env.example .env.local
```

3. Add your Supabase credentials:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_STORAGE_BUCKET=creatorflow-assets
CRON_SECRET=...
```

4. Apply the database schema in Supabase SQL Editor:

- Run [`supabase/schema.sql`](/Users/mr.apokharelgmail.com/Desktop/Auto Video Factory/supabase/schema.sql)
- Optionally run [`supabase/seed.sql`](/Users/mr.apokharelgmail.com/Desktop/Auto Video Factory/supabase/seed.sql) after at least one auth user exists

5. Start the app:

```bash
pnpm dev
```

## Demo Mode

If Supabase environment variables are missing, the app falls back to demo data so the interface can still be explored locally. Auth, persistence, and storage features become real once Supabase is configured.

## Daily Auto Generation

The dashboard includes:

- `Daily Video Amount: min / max`
- `Auto Generate: On / Off`

When enabled, the system is structured to generate the selected range of **original** drafts per day. The cron endpoint is:

- `GET /api/cron/daily-drafts`

Send:

```http
Authorization: Bearer <CRON_SECRET>
```

This route is intended for Vercel Cron or another scheduler.

## Security Notes

- Supabase Auth protects user access
- RLS policies scope data to each authenticated user or workspace member
- Server-side validation uses Zod
- Generation actions include a basic rate limiter
- Storage is intended only for creator-owned or properly licensed assets

## Future-Ready Architecture

The codebase is structured so these can be added without rewriting the main UI shell:

- AI agents
- multiple workspaces
- team collaboration
- brand kits
- TikTok API integration
- Instagram API integration
- YouTube API integration
- cloud video rendering
- AI voice generation
- AI avatars

## Important Compliance Rule

CreatorFlow AI should only be used to produce original, legal, appropriate content. It must not be used to scrape, download, clone, or repost copyrighted content from social media platforms.
