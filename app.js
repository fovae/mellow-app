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

document.addEventListener("DOMContentLoaded", () => {
    const storageKey = "mellow_username";
    const legacyStorageKey = "mellow_user_name";

    const pageLoader = document.querySelector(".pl");
    const welcomeModal = document.querySelector(".home-screen-welcome-modal");
    const mainContent = document.getElementById("mainContent");
    const nameInput = document.getElementById("userNameInput");
    const submitBtn = document.getElementById("userNameSubmit");
    const tabBar = document.getElementById("tabBar");
    const tabIndicator = document.getElementById("tabIndicator");
    const tabItems = Array.from(document.querySelectorAll(".tab-item"));
    const screens = Array.from(document.querySelectorAll(".app-screen"));
    const usernameNodes = Array.from(document.querySelectorAll(".username"));
    const flashcard = document.getElementById("flashcardElement");
    const flashcardControls = Array.from(document.querySelectorAll(".flashcard-control"));
    const testOptions = Array.from(document.querySelectorAll(".test-opt-btn"));

    function getStoredUsername() {
        const currentName = localStorage.getItem(storageKey);
        if (currentName) {
            return currentName;
        }

        const legacyName = localStorage.getItem(legacyStorageKey);
        if (legacyName) {
            localStorage.setItem(storageKey, legacyName);
            localStorage.removeItem(legacyStorageKey);
            return legacyName;
        }

        return "";
    }

    function setUsername(nickname) {
        usernameNodes.forEach((node) => {
            if (node) {
                node.textContent = nickname;
            }
        });
    }

    function updateIndicatorPosition(activeTab) {
        if (!activeTab || !tabBar || !tabIndicator) {
            return;
        }

        const barRect = tabBar.getBoundingClientRect();
        const tabRect = activeTab.getBoundingClientRect();
        const offsetLeft = tabRect.left - barRect.left;
        const width = Math.max(tabRect.width - 10, 56);

        tabIndicator.style.width = `${width}px`;
        tabIndicator.style.transform = `translateX(${offsetLeft + 5}px)`;
    }

    function switchScreen(screenName) {
        screens.forEach((screen) => {
            const targetId = `${screenName}Screen`;
            screen.classList.toggle("is-active", screen.id === targetId);
        });

        window.scrollTo({ top: 0, behavior: "instant" });
    }

    function showMainApplication(nickname) {
        setUsername(nickname);

        if (welcomeModal) {
            welcomeModal.classList.remove("is-visible");
        }

        if (mainContent) {
            mainContent.classList.add("is-visible");
        }

        if (tabBar) {
            tabBar.classList.add("is-visible");
        }

        switchScreen("home");

        window.requestAnimationFrame(() => {
            const activeTab = tabBar?.querySelector(".tab-item.active") || tabItems[0];
            updateIndicatorPosition(activeTab);
        });

        document.body.style.overflow = "auto";
    }

    function shakeInput() {
        if (!nameInput) {
            return;
        }

        nameInput.classList.remove("is-shaking");
        void nameInput.offsetWidth;
        nameInput.classList.add("is-shaking");
        window.setTimeout(() => nameInput.classList.remove("is-shaking"), 380);
    }

    function saveAndContinue() {
        if (!nameInput) {
            return;
        }

        const trimmedValue = nameInput.value.trim();
        if (!trimmedValue) {
            shakeInput();
            return;
        }

        localStorage.setItem(storageKey, trimmedValue);
        showMainApplication(trimmedValue);
    }

    function startApplicationFlow() {
        const storedName = getStoredUsername();

        if (!storedName) {
            if (welcomeModal) {
                welcomeModal.classList.add("is-visible");
            }
            if (nameInput) {
                window.setTimeout(() => nameInput.focus(), 180);
            }
            return;
        }

        showMainApplication(storedName);
    }

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

            tabItems.forEach((item) => item.classList.remove("active"));
            tab.classList.add("active");

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
            if (flashcard) {
                flashcard.classList.remove("flipped");
            }
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

    if (profileStatsBtn) {
        profileStatsBtn.addEventListener("click", () => window.alert("Open Statistics"));
    }

    if (profileSettingsBtn) {
        profileSettingsBtn.addEventListener("click", () => window.alert("Open Settings"));
    }

    if (profileResetBtn) {
        profileResetBtn.addEventListener("click", () => {
            if (window.confirm("Reset all data?")) {
                localStorage.clear();
                window.location.reload();
            }
        });
    }

    if (pageLoader) {
        window.setTimeout(() => {
            pageLoader.classList.add("hidden");
            window.setTimeout(startApplicationFlow, 420);
        }, 2300);
    } else {
        startApplicationFlow();
    }
});