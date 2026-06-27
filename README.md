# Mellow

Mellow is a minimalist, Apple-inspired vocabulary PWA built with plain HTML, CSS, and JavaScript. The app now ships with a frozen, per-screen viewport architecture, a native-feeling custom scrollbar, and a premium bottom navigation system that mirrors modern iOS Liquid Glass patterns.

## What is included

- A branded splash loader and onboarding flow
- A floating iOS-style bottom bar with a glassy translucent pill, animated reveal, and a morphing bubble indicator
- Five independent app screens: Home, Dictionaries, Cards, Tests, and Profile
- Per-screen scroll containers with a custom capsule scrollbar that fades in while scrolling and fades out after interaction stops
- Safe-area-aware layout spacing for notches, home indicators, and modern iOS 16–27 device safe zones
- Offline shell support through a service worker and manifest

## Project structure

- [index.html](index.html) — app shell, semantic blocks, screen wrappers, and interactive UI nodes
- [style.css](style.css) — layout, visual system, safe-area spacing, screen transitions, and the custom scrollbar visuals
- [app.js](app.js) — boot flow, onboarding, tab switching, flashcard logic, test feedback, and independent scroll-thumb math
- [manifest.json](manifest.json) — install metadata and standalone PWA configuration
- [sw.js](sw.js) — offline cache and app-shell fallback logic
- [ARCHITECTURE.md](ARCHITECTURE.md) — a beginner-friendly guide to the full system architecture

## Local development

Run a local static server from the project root:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 in a browser.

## Design principles

- No frameworks or build tooling
- Fast, hardware-accelerated UI transitions
- Content-first layout with no scrollbar layout shift
- Independent screen state and scroll behavior for tab switching
- Safe handling for hidden or inactive UI states
- Bottom-bar lifecycle logic that stays hidden until the loader completes and the home screen is revealed

## License

All rights reserved.
