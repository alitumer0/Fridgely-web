# Sage Web

Static multi-page marketing site for Sage — AI Kitchen Assistant.

Live at **[sage.kitchen](https://sage.kitchen)** — deployed via GitHub Pages from this repo's `main` branch (custom domain configured via `CNAME`). The repo name is still `Fridgely-web` for legacy reasons; rename to `sage-web` does not affect the deployment.

## Current Site Mode

- Marketing-first
- SEO-supported
- Utility-backed
- Current product state: pre-launch

This repo is the website layer around the mobile product. Its job is to explain Sage clearly, build trust, and route users to the right next step.

## Active Pages

- `index.html`: landing page
- `blog.html`: blog index
- `blog/ilk-yazi.html`: article detail
- `faq.html`: FAQ
- `support.html`: support and product-status utility page
- `privacy-policy.html`: privacy placeholder until final legal copy is ready
- `terms.html`: terms placeholder until final legal copy is ready
- `site.css`: shared design system and page styles
- `404.html`: fallback page

## Architecture

- No build step
- Static HTML pages with shared CSS
- Small inline JavaScript only where needed
- Cloudflare Pages Functions retained for the waitlist endpoint (legacy; not active under GitHub Pages)
- GitHub Pages deploy target (custom domain: sage.kitchen)

## Design Direction

- Warm, calm, premium pantry tool
- Explain one core promise clearly: know what you have, waste less, decide what to cook faster
- Avoid mixing `coming soon`, `download now`, and `live app` states
- Motion should support clarity, not become the product

## Waitlist Integration

- The launch form now posts to `/api/waitlist` by default
- The endpoint lives at `functions/api/waitlist.js`
- Live storage can be configured in one of two ways:
  - set `WAITLIST_WEBHOOK_URL` in Cloudflare Pages environment variables to forward submissions to your automation/backend
  - add a `WAITLIST_KV` binding in Cloudflare Pages to store submissions in KV
- Optional:
  - `WAITLIST_WEBHOOK_BEARER_TOKEN` for authenticated webhook forwarding
  - `TESTFLIGHT_URL` to return a follow-up TestFlight link after successful submission
- Local example env file: `.dev.vars.example`
- The site will not pretend a submission succeeded if the server-side waitlist endpoint is not configured

## Social Previews

- Social preview assets now live in:
  - `og-home.svg`
  - `og-blog.svg`
  - `og-legal.svg`
- Landing, blog/article and legal pages reference separate OG images instead of a broken shared placeholder

See:

- `docs/plans/2026-03-08-site-strategy-v1.md`
- `docs/plans/2026-03-09-design-brief-v1.md`

## Deployment

- Source repo: `https://github.com/alitumer0/Sage-web`
- Live site: `https://sage.pages.dev`
- Production deployment snapshot: `https://bd7fcbdd.sage.pages.dev`
- `sage.kitchen` custom domain is not active yet, so app-side hardcoded production links will not resolve until DNS is configured
