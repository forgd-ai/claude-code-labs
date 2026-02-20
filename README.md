# Claude Code Labs

A workshop platform for running guided Claude Code tutorials. Trainers create sessions from markdown-based labs, share a URL, and participants work through steps with real-time progress tracking and a live leaderboard.

## Features

- **Markdown-driven labs** — Write lab content in `labs/*.md` with YAML frontmatter and step metadata. Parsed at build time via a Vite plugin.
- **Session management** — Trainers create unique session URLs. Participants join by name, no accounts needed.
- **Progress tracking** — Participants mark steps complete. Points are tracked per step with optimistic UI updates synced to Supabase.
- **Real-time leaderboard** — Live participant rankings via Supabase Realtime. Cast mode for projecting on a big screen.
- **Admin dashboard** — Trainer view with completion stats, per-step histogram, participant search, and CSV export.
- **Preview mode** — View any lab at `/preview/<slug>` without creating a session.

## Available Labs

| Lab | Language | Difficulty | Duration |
|-----|----------|-----------|----------|
| Excalidraw | TypeScript/React | Beginner | 75 min |
| Flask Microblog | Python/Flask | Beginner | 75 min |
| Spring Petclinic | Java/Spring Boot | Intermediate | 90 min |
| eShopOnWeb | .NET/ASP.NET Core | Intermediate | 90 min |
| Go RealWorld | Go/Gin | Intermediate | 90 min |
| Rust Zero2Prod | Rust/Actix-web | Advanced | 90 min |

## Getting Started

### Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project (free tier works)

### Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` with your Supabase credentials:

```
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Database

Run the migration in your Supabase SQL Editor:

```
supabase/migrations/001_initial_schema.sql
```

This creates the `sessions`, `participants`, and `progress` tables, a `leaderboard` view, RLS policies, and RPC functions.

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
npm run preview   # preview the static build locally
```

## Writing a Lab

Create a markdown file in `labs/`:

```markdown
---
slug: my-lab
title: "My Lab Title"
difficulty: beginner
estimated_duration: "60 minutes"
prerequisites: ["Git", "Claude Code installed"]
tags: [python, beginner]
---

## Step 1: Getting Started
<!-- step: { "id": "step-1", "points": 10, "category": "core" } -->

Step content here. Standard GFM markdown — code blocks, links, lists, etc.

## Step 2: Next Step
<!-- step: { "id": "step-2", "points": 15, "category": "core" } -->

More content...

## Bonus: Extra Challenge
<!-- step: { "id": "bonus-1", "points": 20, "category": "bonus" } -->

Bonus steps are displayed in a separate section.
```

The lab is automatically available after rebuild.

## Deployment

The included GitHub Actions workflow deploys to GitHub Pages on push to `main`.

Add these as **repository variables** (not secrets) in Settings > Secrets and variables > Actions > Variables:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`

## Tech Stack

- [SvelteKit 5](https://svelte.dev) with `@sveltejs/adapter-static`
- [Supabase](https://supabase.com) (Postgres + Realtime)
- [unified](https://unifiedjs.com) / remark / rehype for markdown processing
- GitHub Pages with `404.html` SPA fallback
