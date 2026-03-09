# Fridgely Design Brief V1

## Objective

Create a clear, high-trust, pre-launch marketing site for Fridgely that:

- explains the product in one screen
- makes the product feel worth waiting for
- supports SEO with useful content
- gives users one honest next step

This brief is the visual and UX companion to:

- `docs/plans/2026-03-08-site-strategy-v1.md`

## Product Context

Fridgely is not being presented as a generic recipe app or a generic grocery list app.

Working product frame:

`Fridgely, evdeki gıdaları takip edip israfı azaltmanı ve elindekilerle ne pişireceğini bulmanı sağlayan akıllı mutfak asistanıdır.`

Primary promise:

- Know what you have
- Waste less food
- Decide what to cook faster

Priority order:

1. Inventory visibility
2. Expiry awareness / waste reduction
3. Recipe help
4. Shopping support

## Site Role

The website is not the app.

The website's role is:

- marketing
- SEO
- trust
- launch routing

The site should not behave like:

- an app demo site pretending the product is already live
- a generic startup landing page
- a deep-link fallback system that accidentally became the main brand surface

## Recommended Design Direction

Direction:

- Calm premium pantry tool

Visual character:

- warm
- orderly
- trustworthy
- domestic, not corporate
- premium, but restrained

Avoid:

- loud startup energy
- techy AI aesthetics
- cold, sterile Apple imitation
- too many glowing effects
- visually identical sections

## Reference Pattern Takeaways

Competitor categories reviewed:

- grocery/family list tools
- pantry/inventory tools
- expiry tracking tools
- recipe-from-ingredients tools

Design takeaway:

- strong products usually sell one core use case first
- weak products try to say grocery + recipe + AI + home + family + planning all at once
- Fridgely should lead with inventory and waste reduction, then support with recipes

## Visual System

### Color

Keep the current direction:

- warm cream base
- deep green structure color
- one warm accent for action and emphasis

Rules:

- one dominant accent, not multiple accents competing
- use dark green for trust and structure
- use coral/warm orange for CTA and highlights
- avoid adding extra bright colors unless they communicate state

### Typography

Tone:

- editorial headline
- practical body copy

Rules:

- large serif display for section anchors and hero
- clean sans-serif for body, controls, and utility text
- more scale contrast between hero, section titles, and supporting text
- keep body width controlled; do not let copy span too wide

### Spacing

Rules:

- hero gets the most breathing room
- every section should have a distinct internal rhythm
- alternate dense and open sections so the page does not feel mechanically repeated
- keep utility pages tighter and simpler than the landing

## Layout Principles

### Landing

Landing should follow this order:

1. Hero
2. How it works
3. Core value blocks
4. FAQ teaser
5. Launch CTA

Rules:

- hero must explain the product without scrolling
- only one hero mockup should dominate
- feature sections should explain outcomes, not just show UI
- launch CTA should feel like a real next step, not filler

### Blog

Blog should feel like an extension of the landing, not a separate product.

Rules:

- keep article pages quieter and more editorial
- use blog to build trust and signal progress
- internally link blog posts back to landing and FAQ

### FAQ

FAQ should remove hesitation.

Rules:

- answer platform, pricing, product state, and usage questions directly
- avoid speculative language unless clearly marked
- keep answers short and practical

### Utility Pages

Support, privacy, and terms should be intentionally simple.

Rules:

- no heavy visual experimentation
- no oversized mockups
- use these pages to reduce friction and improve trust

## Component Rules

### Buttons

Rules:

- one primary CTA style
- one secondary CTA style
- one outline style for low-pressure actions
- primary button should always represent the current product state

Do not:

- mix `indir`, `yakında`, and `testflight` messaging at the same time
- create multiple “primary” actions in the same viewport

### Cards

Use cards for:

- value blocks
- blog entries
- utility navigation

Rules:

- cards must earn their borders and shadows
- not every section should be card-based
- vary card density based on content type

### Mockups

Rules:

- mockups should explain product logic
- hero mockup should feel like a weekly kitchen snapshot
- feature mockups should support the claim next to them
- avoid making every mockup look like a floating template

### Forms

Rules:

- forms should look trustworthy and light
- every field must have a visible label
- success states should reduce uncertainty
- if a form is preview-only, say so explicitly

## Motion Rules

Use motion in only three places:

1. Hero entry
2. Mockup depth / reveal
3. CTA and form feedback

Rules:

- no continuous decorative motion loops unless they are cheap and subtle
- prefer fade, rise, and light depth over bounce
- motion should make the site feel alive, not busy
- respect `prefers-reduced-motion`

## Do / Don't

### Do

- make the product understandable in 5 seconds
- lead with inventory and waste reduction
- use warm, domestic cues
- keep launch messaging honest
- connect landing, blog, and FAQ into one story
- prefer trust over hype

### Don't

- design around old fallback pages
- introduce a second visual style for blog or utility pages
- add more features to hero just because they exist
- use motion to solve messaging problems
- over-design legal/support pages

## Content Readiness Gates

Before calling the site launch-ready, these must be finalized:

- hero copy
- CTA state
- actual waitlist/TestFlight destination
- FAQ answers for pricing and platforms
- support flow
- final privacy text
- final terms text
- at least 3 useful blog posts

## Two-Week Execution Roadmap

### Week 1

Goal:

- lock product state, messaging, and information hierarchy

Tasks:

1. finalize CTA state: waitlist, TestFlight, or live app
2. finalize hero and section copy
3. align README and docs with actual site architecture
4. tighten landing hierarchy and reduce repeated section rhythm
5. expand FAQ with launch-critical questions

Deliverable:

- stable v1 marketing structure

### Week 2

Goal:

- improve trust and content depth

Tasks:

1. add 2 more blog posts
2. finalize support page language
3. replace legal placeholders with real copy
4. connect waitlist UI to a real backend or destination
5. apply final polish to spacing, typography, and motion

Deliverable:

- publishable pre-launch marketing site

## Working North Star

Fridgely web should feel like:

`A calm, high-trust product site that makes the app feel useful before it is even installed.`
