# Minimal Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the text-heavy landing page with a minimal, hero-driven design featuring CSS phone mockups and drastically reduced copy.

**Architecture:** Single-file SPA (site.js + site.css). No build step. homePage() rewritten from scratch. Sub-pages simplified. CSS cleaned of unused classes, new mockup and layout styles added.

**Tech Stack:** Vanilla JS, CSS custom properties, Cloudflare Pages

---

### Task 1: Rewrite homePage() in site.js

**Files:**
- Modify: `site.js` — replace `homePage()` function (lines 226-518)

**Step 1: Replace homePage() with new minimal structure**

New structure has 5 sections:
1. **Hero** — eyebrow + heading + one paragraph + CTA buttons + phone mockup (right side)
2. **How it works** — 3 step cards (icon number + title + one sentence)
3. **Surfaces** — 3 phone mockups side by side with one-line captions
4. **CTA band** — heading + 3 action links
5. Footer (already exists)

Phone mockup HTML pattern (reusable):
```html
<div class="phone-mockup">
  <div class="phone-notch"></div>
  <div class="phone-screen">
    <!-- screen content: simple UI items via HTML -->
  </div>
</div>
```

Hero mockup shows inventory screen: 4-5 food items with emoji, name, expiry status.
Surfaces mockups show: inventory list, recipe card, shopping checklist.

**Step 2: Simplify topbar**

Remove nav-links (Akış, Yüzeyler, Premium, SSS hash links — sections are gone or renamed). Keep: logo, premium link, destek link, theme toggle.

**Step 3: Simplify footer**

Keep existing footer structure but it's already minimal enough.

---

### Task 2: Simplify sub-pages in site.js

**Files:**
- Modify: `site.js` — simplify `supportPage()`, `premiumPage()`, `legalPage()`

**Step 1: supportPage()**
- Remove page-rail aside
- Reduce to: eyebrow + heading + one paragraph + 4 action cards (keep support-grid but simpler text)

**Step 2: premiumPage()**
- Remove page-rail aside
- Keep comparison grid but reduce text in each card to title + 3 bullet points only

**Step 3: legalPage()**
- Remove aside cards ("Neden bu kadar açık?", "Ürün ve güven...")
- Keep just the legal content card, simpler layout

---

### Task 3: Rewrite site.css

**Files:**
- Modify: `site.css` — full rewrite

**Step 1: Keep**
- CSS custom properties (both themes)
- Base resets, typography, body background
- Topbar styles
- Button/link styles
- Skip link, nav toggle, responsive nav
- Footer styles
- Deep-link panel styles
- Media queries structure

**Step 2: Remove** (unused after JS changes)
- hero-highlights, hero-visual, kitchen-brief, brief-* classes
- proof-strip, proof-chip, proof-intro
- journey-grid, journey-step, journey-main, aside-quote
- feature-grid, feature-card, feature-icon (old grid)
- pricing-grid, pricing-card, price
- editorial-grid, manifesto-card, manifesto-tag
- outcome-grid, outcome-card
- board-*, mini-panel, timeline-*
- trust-row, trust-chip
- showcase-grid, showcase-card, showcase-tag
- pill-list, pricing-list, brief-list
- comparison-note
- All hover transitions on removed classes

**Step 3: Add new styles**

Phone mockup system:
```css
.phone-mockup — container with phone frame shape, border-radius, shadow
.phone-notch — top notch bar
.phone-screen — content area with subtle bg
.phone-item — inventory/recipe/shopping list items inside mockup
.phone-status — expiry status indicators (green/yellow/red dots)
```

New layout classes:
```css
.hero — two-column: copy left, mockup right
.steps-row — 3-column grid for "how it works"
.step-card — icon + title + one sentence
.step-icon — numbered circle
.surfaces-row — 3 phone mockups with captions
.surface-caption — single line below mockup
```

Keep/adapt:
```css
.comparison-grid, .comparison-card — for premium page
.support-grid, .support-card — for support page
.legal-layout, .legal-card — for legal pages
.page-hero, .page-copy — for sub-pages (simplified)
.cta-band — bottom CTA
.faq-grid, .faq-card — if FAQ stays
.signal-list — if used in sub-pages
.eyebrow, .display, .lead — typography classes
```

**Step 4: Responsive**
- 980px: all grids → single column, phone mockups stack
- 720px: mobile nav, reduced padding/radius

---

### Task 4: Deploy and verify

**Step 1: Validate**
```bash
# Check CSS balance
python3 -c "..."
# Check all JS classes have CSS
python3 -c "..."
```

**Step 2: Deploy**
```bash
npx wrangler pages deploy . --project-name=fridgely --commit-dirty=true
```

**Step 3: Commit**
```bash
git add site.js site.css
git commit -m "refactor: minimal hero-driven redesign"
```
