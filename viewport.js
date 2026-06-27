(() => {
    const root = document.documentElement;
    const body = document.body;

    const isStandalonePwa = () => {
        const match = window.matchMedia("(display-mode: standalone)").matches;
        const standaloneNavigator = window.navigator.standalone === true;
        return match || standaloneNavigator;
    };

    const updateViewport = () => {
        const viewport = window.visualViewport;
        const viewportHeight = Math.round(viewport?.height || window.innerHeight || root.clientHeight || 0);

        root.style.setProperty("--app-height", `${viewportHeight}px`);
        root.style.setProperty("--viewport-height", `${viewportHeight}px`);
        root.style.setProperty("--safe-bottom", "env(safe-area-inset-bottom, 0px)");
        root.classList.toggle("is-standalone-pwa", isStandalonePwa());

        if (body) {
            body.style.setProperty("--app-height", `${viewportHeight}px`);
            body.style.setProperty("--viewport-height", `${viewportHeight}px`);
            body.style.setProperty("--safe-bottom", "env(safe-area-inset-bottom, 0px)");
        }
    };

    const bindViewportEvents = () => {
        const viewport = window.visualViewport;
        const events = ["resize", "orientationchange", "pageshow", "visibilitychange"];

        events.forEach((eventName) => {
            window.addEventListener(eventName, () => updateViewport(), { passive: true });
        });

        viewport?.addEventListener("resize", () => updateViewport(), { passive: true });
        viewport?.addEventListener("scroll", () => updateViewport(), { passive: true });
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            updateViewport();
            bindViewportEvents();
        }, { once: true });
    } else {
        updateViewport();
        bindViewportEvents();
    }
})();
