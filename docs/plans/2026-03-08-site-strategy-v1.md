# Sage Site Strategy V1

## Objective

Define a coherent direction for the Sage website so design, copy, SEO, and app-directed actions stop conflicting with each other.

Primary goal:
- Explain Sage clearly
- Build trust
- Drive the user to the correct next step

Recommended site mode:
- Marketing-first
- SEO-supported
- Utility-backed

This means:
- The landing page sells the product
- Blog and FAQ capture organic traffic and answer intent
- Support, privacy, and terms provide trust and reduce friction
- Deep-link fallback pages remain secondary, not the center of the site

---

## Product Positioning

Working one-line positioning:

`Sage, evdeki gıdaları takip edip israfı azaltmanı ve elindekilerle ne pişireceğini bulmanı sağlayan akıllı mutfak asistanıdır.`

Working promise:
- Know what you have
- Waste less food
- Decide what to cook faster

Tone:
- Clear
- Practical
- Calm
- Premium but not flashy

Avoid:
- Mixing "coming soon" with "download now"
- Over-claiming AI
- Generic "all-in-one app" wording

---

## V1 Sitemap

### Core Pages

1. `/`
   Landing page
   Purpose: explain product value and move user to install/waitlist/TestFlight

2. `/blog`
   Blog index
   Purpose: SEO entry point and educational content hub

3. `/blog/:slug`
   Blog article
   Purpose: capture search intent and internally link to landing / FAQ / app CTA

4. `/faq`
   FAQ page
   Purpose: reduce hesitation and answer common objections

5. `/support`
   Support page
   Purpose: route users to help, contact, and app-related guidance

6. `/privacy`
   Privacy policy
   Purpose: trust/legal

7. `/terms`
   Terms of use
   Purpose: trust/legal

### Optional Utility Pages

8. `/premium`
   Optional
   Purpose: only if premium messaging needs a dedicated commercial page

9. Deep-link / fallback routes
   Optional
   Purpose: only for app-share links and invite flows

Recommended rule:
- Do not let fallback pages shape the main brand/site architecture

---

## Landing Wireframe

### Section 1: Hero

Goal:
- Explain what Sage is in one screen
- Give one primary CTA

Structure:
- Eyebrow
- H1
- One short supporting paragraph
- Primary CTA
- Secondary CTA
- One clean product mockup

Content intent:
- Show inventory and food-waste reduction first
- Treat recipe suggestions as a downstream benefit

Wireframe:

```text
+-------------------------------------------------------------+
| Logo | Nav: How it works / Blog / FAQ                CTA    |
+-------------------------------------------------------------+
| Eyebrow: Akıllı mutfak asistanı                            |
| H1: Evdeki gıdaları takip et, israfı azalt.                |
| Body: Sage neyin kaldığını, neyin biteceğini ve        |
| elindekilerle ne pişirebileceğini tek yerde gösterir.      |
| [Primary CTA] [Secondary CTA]                              |
|                                              [App mockup]  |
+-------------------------------------------------------------+
```

### Section 2: How It Works

Goal:
- Make product mechanics obvious

Structure:
- 3 steps

Steps:
1. Ürünleri ekle
2. Ne biteceğini gör
3. Elindekilerle ne pişireceğini bul

### Section 3: Core Value Blocks

Goal:
- Translate features into outcomes

Recommended cards:
- Envanter görünürlüğü
- Son kullanma takibi
- Tarif önerileri
- Alışveriş listesi

### Section 4: Trust / Why Use It

Goal:
- Reduce skepticism

Examples:
- Daha az israf
- Daha az unutulan ürün
- Daha hızlı yemek kararı

### Section 5: FAQ Teaser

Goal:
- Catch objections before the user leaves

Show:
- 2-3 high-value questions
- Link to full FAQ

### Section 6: Final CTA

Goal:
- One clear conversion decision

If app is live:
- `Uygulamayı indir`

If app is not live:
- `Yakında haberdar et`
or
- `TestFlight'a katıl`

---

## Hero Copy Options

### Option A: Best Balanced

Eyebrow:
- `Akıllı mutfak asistanı`

Headline:
- `Evdeki gıdaları takip et, israfı azalt.`

Body:
- `Sage, neyin kaldığını, neyin biteceğini ve elindekilerle ne pişirebileceğini tek yerde gösterir.`

Why this works:
- Most understandable
- Strong consumer value
- Not overdesigned or vague

### Option B: Slightly Warmer

Eyebrow:
- `Mutfağını daha sakin yönet`

Headline:
- `Dolaptakileri unutma, ne pişireceğini daha hızlı bul.`

Body:
- `Sage, evdeki gıdaları düzenli tutmana ve elindekilerle en doğru yemeği seçmene yardımcı olur.`

Why this works:
- More human
- Less startup-like
- Strong for family/home audience

### Option C: More Outcome-Focused

Eyebrow:
- `Daha az israf, daha net mutfak`

Headline:
- `Neyin var, ne bitiyor, ne pişer: hepsi tek yerde.`

Body:
- `Sage ile envanterini takip et, son kullanma tarihlerini kaçırma ve elindeki malzemelere göre tarif önerileri al.`

Why this works:
- Strong product summary
- Slightly denser than Option A

### Recommended Choice

Pick:
- Option A for v1

Reason:
- Clearest
- Best balance of product + consumer language
- Works well with SEO and ad traffic

---

## CTA Decision Matrix

### Decision Rule

The site must communicate exactly one state:
- Live app
- Pre-launch / coming soon
- TestFlight / limited access

Do not mix them.

### Matrix

| Product State | Primary CTA | Secondary CTA | Avoid |
|---|---|---|---|
| App live | `Uygulamayı indir` | `Nasıl çalışır` | `Çok yakında` |
| TestFlight active | `TestFlight'a katıl` | `Nasıl çalışır` | App Store / Google Play buttons if unavailable |
| Pre-launch | `Haberdar ol` or `Yakında App Store'da` | `Blog'u keşfet` | Direct install CTA |

### Recommendation

Choose one of these now:

1. If Sage is downloadable:
   Primary CTA: `Uygulamayı indir`

2. If Sage is not yet public but can accept early users:
   Primary CTA: `TestFlight'a katıl`

3. If Sage is still pre-launch:
   Primary CTA: `Yakında App Store'da`
   Secondary CTA: `Nasıl çalışır`

### Best Current Guess

Based on current site language, the product seems closest to:
- Pre-launch or limited-access

So the current mixed state should be replaced with one of:
- `TestFlight'a katıl`
or
- `Yakında App Store'da`

Not:
- `Çok Yakında` + `App Store'dan İndir`

---

## V1 Content Rules

### Landing Rules

- One headline only
- One primary CTA only
- One product narrative only
- Focus on outcomes before features

### Blog Rules

- Every blog post should link back to landing
- Every post should end with a product CTA
- Use educational search intent, not generic lifestyle fluff

Suggested content themes:
- Gıda israfını azaltma
- Son kullanma tarihi yönetimi
- Haftalık mutfak planlama
- Evdeki malzemelerle tarif çıkarma

### FAQ Rules

- Answer objections directly
- Keep answers short
- Focus on trust, pricing, platforms, data, and usage

### Legal / Support Rules

- Minimal visual complexity
- Maximum clarity
- No marketing overload

---

## UI Direction

Recommended visual direction:
- Minimal
- Warm
- Product-first
- Soft premium

Rules:
- One hero mockup is enough
- Do not overload the first screen with too many device frames
- Motion should support clarity, not become the product
- Performance is part of perceived quality

Avoid:
- Heavy SVG device rigs
- Constant looping animation in multiple zones
- Multiple competing gradients and glows

---

## Immediate Next Moves

### Priority 1

Lock the product state:
- Live
- TestFlight
- Pre-launch

### Priority 2

Replace hero with final v1 messaging:
- Choose Hero Copy Option A
- Choose one CTA state from the decision matrix

### Priority 3

Reduce landing complexity:
- Keep one hero device
- Keep 3-step explanation
- Keep 3-4 value blocks
- Keep FAQ teaser

### Priority 4

Make blog and FAQ visually consistent with landing

### Priority 5

Update README to match actual architecture

---

## Recommended Execution Order

1. Finalize CTA state
2. Finalize hero copy
3. Simplify landing structure
4. Standardize blog/FAQ layout
5. Clean support/legal/fallback architecture
6. Update docs/README

---

## Final Recommendation

Sage web should stop behaving like a hybrid experiment and become:

`A calm, high-trust product marketing site with SEO support.`

That means:
- Fewer UI tricks
- Clearer messaging
- Stronger CTA discipline
- Cleaner separation between marketing pages and utility pages
