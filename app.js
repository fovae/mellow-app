if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js")
            .then((registration) => {
                console.log("Mellow service worker registered successfully", registration.scope);
            })
            .catch((error) => {
                console.error("Mellow service worker registration failed", error);
            });
    });
}

const initializeMellowApp = () => {
    // MAIN CONTAINER
    // logic: boots the app shell, onboarding flow, tab switching, and screen interactions

    const storageKey = "mellow_username";
    const legacyStorageKey = "mellow_user_name";

    const pageLoader = document.querySelector(".pl");
    const welcomeModal = document.querySelector(".home-screen-welcome-modal");
    const mainContent = document.getElementById("mainContent");
    const nameInput = document.getElementById("userNameInput");
    const submitBtn = document.getElementById("userNameSubmit");
    const tabBar = document.querySelector(".pw-bnb");
    const tabItems = Array.from(document.querySelectorAll(".bnb-item"));
    const bottomBarRevealKey = "mellow_bottom_bar_revealed";
    const screens = Array.from(document.querySelectorAll(".app-screen"));
    const usernameNodes = Array.from(document.querySelectorAll(".username"));
    const flashcard = document.getElementById("flashcardElement");
    const flashcardControls = Array.from(document.querySelectorAll(".flashcard-control"));
    const testOptions = Array.from(document.querySelectorAll(".test-opt-btn"));

    // PAGE LOADER
    // logic: restores saved state and controls the intro transition
    const getStoredUsername = () => {
        const currentName = window.localStorage.getItem(storageKey);
        if (currentName) {
            return currentName;
        }

        const legacyName = window.localStorage.getItem(legacyStorageKey);
        if (legacyName) {
            window.localStorage.setItem(storageKey, legacyName);
            window.localStorage.removeItem(legacyStorageKey);
            return legacyName;
        }

        return "";
    };

    // ONBOARDING
    // logic: renders the chosen name and validates the signup flow
    const setUsername = (nickname) => {
        usernameNodes.forEach((node) => {
            if (node) {
                node.textContent = nickname;
            }
        });
    };

    const shakeInput = () => {
        if (!nameInput) {
            return;
        }

        nameInput.classList.remove("is-shaking");
        void nameInput.offsetWidth;
        nameInput.classList.add("is-shaking");
        window.setTimeout(() => nameInput.classList.remove("is-shaking"), 380);
    };

    const saveAndContinue = () => {
        if (!nameInput) {
            return;
        }

        const trimmedValue = nameInput.value.trim();
        if (!trimmedValue) {
            shakeInput();
            return;
        }

        window.localStorage.setItem(storageKey, trimmedValue);
        showMainApplication(trimmedValue);
    };

    // NAVIGATION
    // logic: toggles the active screen and aligns the tab indicator
    const updateIndicatorPosition = (activeTab) => {
        if (!activeTab) {
            return;
        }

        tabItems.forEach((item) => item.classList.toggle("is-active", item === activeTab));
    };

    const switchScreen = (screenName) => {
        const targetId = `${screenName}Screen`;

        screens.forEach((screen) => {
            if (!screen) {
                return;
            }

            screen.classList.toggle("is-active", screen.id === targetId);
        });
    };

    const revealBottomBar = () => {
        if (!tabBar) {
            return;
        }

        const shouldAnimateEntrance = window.sessionStorage.getItem(bottomBarRevealKey) !== "true";

        tabBar.classList.remove("is-hidden-initially");
        tabBar.classList.add("reveal-bar");
        tabBar.classList.add("is-visible");

        if (shouldAnimateEntrance) {
            window.sessionStorage.setItem(bottomBarRevealKey, "true");
        }
    };

    const showMainApplication = (nickname) => {
        setUsername(nickname);

        welcomeModal?.classList.remove("is-visible");
        mainContent?.classList.add("is-visible");

        switchScreen("home");
        revealBottomBar();

        window.requestAnimationFrame(() => {
            const activeTab = tabBar?.querySelector(".tab-item.active") || tabItems[0];
            updateIndicatorPosition(activeTab);
        });
    };

    const startApplicationFlow = () => {
        const storedName = getStoredUsername();

        if (!storedName) {
            welcomeModal?.classList.add("is-visible");
            if (nameInput) {
                window.setTimeout(() => nameInput.focus(), 180);
            }
            return;
        }

        showMainApplication(storedName);
    };

    // HOME SCREEN
    // logic: wires card flipping, test feedback, and profile actions safely
    if (submitBtn) {
        submitBtn.addEventListener("click", saveAndContinue);
    }

    if (nameInput) {
        nameInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                saveAndContinue();
            }
        });
    }

    tabItems.forEach((tab) => {
        tab.addEventListener("click", () => {
            if (tab.classList.contains("active")) {
                return;
            }

            tabItems.forEach((item) => item.classList.remove("is-active"));
            tab.classList.add("is-active");

            updateIndicatorPosition(tab);
            switchScreen(tab.getAttribute("data-screen") || "home");
        });
    });

    window.addEventListener("resize", () => {
        window.requestAnimationFrame(() => {
            const activeTab = tabBar?.querySelector(".tab-item.active") || tabItems[0];
            updateIndicatorPosition(activeTab);
        });
    });

    if (flashcard) {
        flashcard.addEventListener("click", () => {
            flashcard.classList.toggle("flipped");
        });
    }

    flashcardControls.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.stopPropagation();
            flashcard?.classList.remove("flipped");
        });
    });

    testOptions.forEach((button) => {
        button.addEventListener("click", () => {
            const optionGroup = button.closest(".test-options");
            if (!optionGroup) {
                return;
            }

            optionGroup.querySelectorAll(".test-opt-btn").forEach((item) => {
                item.classList.remove("is-selected", "is-correct", "is-incorrect");
                item.setAttribute("aria-pressed", "false");
            });

            button.classList.add("is-selected");
            button.setAttribute("aria-pressed", "true");

            if (button.dataset.correct === "true") {
                button.classList.add("is-correct");
            } else {
                button.classList.add("is-incorrect");
            }
        });
    });

    const profileStatsBtn = document.getElementById("profBtnStats");
    const profileSettingsBtn = document.getElementById("profBtnSettings");
    const profileResetBtn = document.getElementById("profBtnReset");

    profileStatsBtn?.addEventListener("click", () => window.alert("Open Statistics"));
    profileSettingsBtn?.addEventListener("click", () => window.alert("Open Settings"));
    profileResetBtn?.addEventListener("click", () => {
        if (window.confirm("Reset all data?")) {
            window.localStorage.clear();
            window.location.reload();
        }
    });

    // APP SCREEN
    // logic: keeps each viewport's custom scrollbar pinned to its own content bounds
    const initializeCustomScrollThumbs = () => {
        document.querySelectorAll(".app-screen").forEach((screen) => {
            const thumb = screen.querySelector(".custom-scroll-thumb");
            const scrollContent = screen.querySelector(".scroll-content");

            if (!thumb || !scrollContent) {
                return;
            }

            let scrollTimeout;

            const updateThumbPosition = () => {
                const contentStyle = window.getComputedStyle(scrollContent);
                const paddingTop = parseFloat(contentStyle.paddingTop) || 0;
                const paddingBottom = parseFloat(contentStyle.paddingBottom) || 0;
                const visibleTrackHeight = Math.max(screen.clientHeight - paddingTop - paddingBottom, 1);
                const maxThumbTravel = Math.max(visibleTrackHeight - thumb.offsetHeight, 0);
                const scrollableDistance = Math.max(screen.scrollHeight - screen.clientHeight, 1);
                const scrollPercent = Math.max(0, Math.min(1, screen.scrollTop / scrollableDistance));
                const finalY = paddingTop + scrollPercent * maxThumbTravel;

                thumb.style.transform = `translate3d(0, ${finalY}px, 0)`;
            };

            const showThumb = () => {
                thumb.classList.add("is-scrolling");
                window.clearTimeout(scrollTimeout);
                scrollTimeout = window.setTimeout(() => {
                    thumb.classList.remove("is-scrolling");
                }, 650);
            };

            screen.addEventListener(
                "scroll",
                () => {
                    showThumb();
                    window.requestAnimationFrame(updateThumbPosition);
                },
                { passive: true }
            );

            window.addEventListener(
                "resize",
                () => {
                    window.requestAnimationFrame(updateThumbPosition);
                },
                { passive: true }
            );

            window.requestAnimationFrame(updateThumbPosition);
        });
    };

    initializeCustomScrollThumbs();

    if (pageLoader) {
        window.setTimeout(() => {
            pageLoader.classList.add("hidden");
            window.setTimeout(startApplicationFlow, 420);
        }, 2300);
    } else {
        startApplicationFlow();
    }
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeMellowApp);
} else {
    initializeMellowApp();
}