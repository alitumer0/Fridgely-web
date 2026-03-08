# Fridgely Web

Static marketing and deep-link fallback site for Fridgely.

## Files

- `index.html`: landing page shell
- `site.js`: route-aware page renderer
- `site.css`: shared design system and layout
- `404.html`: fallback shell for nested routes
- `privacy-policy.html`, `terms.html`, `premium.html`, `support.html`: legacy/direct entry shells

## Notes

- App-side links still target `https://fridgely.app`.
- This folder is intentionally separate from the Flutter app repo so deployment and website iteration can happen independently.
