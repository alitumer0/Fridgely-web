# iPhone 3D Landing Page Design

**Goal:** Replace broken CSS-class-based landing with a premium iPhone mockup landing page. All layout styles inline to avoid CSS class rendering issues.

## Architecture
- Single-file SPA (site.js + site.css), no build step
- All layout/component styles as inline `style=""` attributes in JS template literals
- Only base styles (CSS variables, body, fonts, keyframes) in site.css
- iPhone screen auto-cycles between 3 screens via CSS animation

## Sections

### Hero (2-column grid)
- Left: "Çok yakında" badge, headline, one sentence, 2 buttons
- Right: 3D-angled iPhone mockup with perspective
- iPhone enters with fadeInUp animation
- Screen content crossfades: Inventory → Recipe → Shopping (every 3s)

### Steps (3-column grid)
- 3 cards: Topla / Karar ver / Paylaş
- Number icon + title + one sentence each

### CTA Band
- Headline + buttons, gradient background

## iPhone Mockup Specs
- Realistic proportions (width: 280px, aspect-ratio ~19.5:9)
- Dynamic Island (dark capsule, top center)
- border-radius: 54px, thin bezel
- 3D perspective: `perspective(1200px) rotateY(-8deg)`
- Hover: rotateY(0) transition
- Subtle layered shadow

## Screen Content
- Inventory: emoji + name + expiry badge (colored)
- Recipe: card with progress bar
- Shopping: checklist with checkboxes

## Animations (in site.css @keyframes)
- fadeInUp: opacity 0→1, translateY 30px→0
- screenCycle: 3 screens crossfade via opacity, 9s total loop

## Technical Constraint
- ALL layout styles inline — zero dependency on CSS class selectors for layout
- CSS file only for: variables, body/html base, @keyframes, topbar, buttons, typography
