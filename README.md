# Blossom for Savings frontend

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/sakshit2004s-projects/v0-blossom-for-savings-frontend)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/eq8GPCZXu3L)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/sakshit2004s-projects/v0-blossom-for-savings-frontend](https://vercel.com/sakshit2004s-projects/v0-blossom-for-savings-frontend)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/eq8GPCZXu3L](https://v0.app/chat/projects/eq8GPCZXu3L)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
<<<<<<< Current (Your changes)
=======

## Lonniee – AI Savings Assistant

Setup
- Copy `.env.example` to `.env.local` and fill values for OpenAI, Supabase, Plaid MCP, and APP_BASE_URL.
- Apply SQL in `scripts/penny_chat.sql` to your Supabase database.
- Run dev server: `pnpm dev`.

Server components
- System prompt: `lib/ai/system-prompts.ts`
- Tool wrappers and OpenAI tool schemas: `lib/lonniee/tools.ts`
- Chat SSE endpoint: `app/api/lonniee/chat/route.ts`
- DB tables: `scripts/penny_chat.sql`

Client components
- Agent chat with streaming + approvals: `app/agent/page.tsx`

Notes
- Approval-required actions are proposed via `actionPreview` SSE events; UI posts approval back to `/api/lonniee/chat`.
- Tools call real APIs: OpenAI, your app routes, and Plaid MCP sandbox.
>>>>>>> Incoming (Background Agent changes)
