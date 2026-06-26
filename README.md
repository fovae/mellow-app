# Mellow

Mellow is a minimalist, Apple-inspired Progressive Web App for learning vocabulary through flashcards, quick tests, and a polished mobile-first interface. The app is built with plain HTML, CSS, and JavaScript only — no frameworks, no build tools, and no external UI libraries.

## Features

- Elegant onboarding experience with a branded loader and welcome modal
- Local username persistence using browser storage
- Glassmorphism-inspired mobile UI with iOS-safe spacing
- Floating bottom tab bar with animated indicator
- Five main screens:
  - Home
  - Dictionaries
  - Cards
  - Tests
  - Profile
- Interactive flashcards with flip animation
- Test answer selection with visual feedback
- Progressive Web App foundation with standalone install support
- Offline shell caching through a service worker
- Mobile-safe metadata for iOS and Android runtimes

## Project Structure

- `index.html` — app shell, screens, onboarding modal, tab bar, and content sections
- `style.css` — all visual styling, animations, layout, glass effects, and mobile-safe spacing
- `app.js` — app flow, local storage, screen switching, tab indicator animation, flashcards, tests, and profile actions
- `manifest.json` — standalone PWA manifest with install metadata and icon definitions
- `sw.js` — service worker for offline caching and app-shell fallback
- `public/` — static assets used by the app, including icons for the PWA manifest

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Progressive Web App basics
- Web app manifest
- Service worker offline caching

## Running the App

Because this project is a static web app, you can run it locally by opening `index.html` in a browser.

If you want a local development server, you can use any simple static server such as:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Design Notes

The interface follows a minimalist, iOS-inspired visual language with:

- soft gradients
- glass blur surfaces
- rounded cards and controls
- fluid animations and spring-like easing
- mobile-safe padding for notches and home indicators
- standalone PWA-ready metadata for iOS 16+ and modern Android devices

## App Flow

1. The page loader animates on startup.
2. The app checks local storage for a saved username.
3. If no username exists, the welcome modal appears.
4. After a valid username is saved, the main app becomes visible.
5. The user can navigate between the five app screens from the floating tab bar.

## PWA Notes

The app now includes a basic production-ready PWA foundation:

- a full manifest configuration with install metadata
- a service worker that caches the core application shell
- offline fallback behavior for visited resources
- safe service worker registration from the main application thread

Future enhancements may include:

- persistent dictionary and flashcard data
- real test scoring
- progress tracking
- backend integration
- richer install and update handling

## License

All rights reserved.
