# Mellow architecture guide

## 1. Structural map

```text
MAIN CONTAINER
├── PAGE LOADER
├── ONBOARDING
├── NAVIGATION
│   └── tab-item (x5)
└── HOME SCREEN
    ├── app-screen (home)
    │   ├── custom-scroll-thumb
    │   └── scroll-content
    │       └── home screen container
    ├── app-screen (dictionaries)
    │   ├── custom-scroll-thumb
    │   └── scroll-content
    ├── app-screen (cards)
    │   ├── custom-scroll-thumb
    │   └── scroll-content
    ├── app-screen (tests)
    │   ├── custom-scroll-thumb
    │   └── scroll-content
    └── app-screen (profile)
        ├── custom-scroll-thumb
        └── scroll-content
```

## 2. Component directory

### PAGE LOADER
The intro overlay shows the branded loading experience before the app becomes interactive. It is controlled by the `.pl` block and fades out after a fixed delay.

### ONBOARDING
The welcome modal collects the username and stores it in localStorage. It appears when no stored name exists and hides once the app is ready.

### NAVIGATION
The bottom tab bar contains `.tab-item` buttons. Clicking one updates the active state, moves the tab indicator, and switches the visible `.app-screen`.

### APP SCREEN
Each `.app-screen` is an independent viewport. It uses `overflow-y: auto`, `-webkit-overflow-scrolling: touch`, and a custom thumb element so the surface feels native while avoiding the browser scrollbar.

### CUSTOM SCROLLBAR
Each screen contains one `.custom-scroll-thumb` element. It is positioned absolutely and driven by a small JS routine that computes the visible track height, padding offsets, and scroll progress.

## 3. System interactivity and data flow

1. The app boots in [app.js](app.js) and checks for a saved username.
2. If no username exists, the onboarding modal becomes visible.
3. When the user saves a name, the main container becomes visible and the home screen becomes active.
4. Tapping a `.tab-item` updates the active tab and toggles the matching `.app-screen` into the visible state.
5. The DOM keeps each screen mounted, so the screen state remains intact when switching tabs.
6. While a screen scrolls, its own thumb becomes visible and updates position using the scroll ratio and padding-aware track height.
7. When scrolling stops, the thumb fades out after 650ms.

## 4. Links and dependencies

- [index.html](index.html) is the shell that defines the app structure.
- [style.css](style.css) styles the visual language and scroll behavior.
- [app.js](app.js) handles boot flow, tab switching, and scroll-thumb logic.
- [manifest.json](manifest.json) provides install metadata for the PWA.
- [sw.js](sw.js) serves the offline shell and caching behavior.
