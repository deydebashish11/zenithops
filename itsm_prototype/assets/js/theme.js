/* ============================================================
   THEME ENGINE – Light/Dark Mode for ZenithOps
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    applySavedTheme();

    const toggleBtn = document.getElementById("themeToggle");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", toggleTheme);
    }
});

/* -------------------------
   APPLY SAVED THEME
-------------------------- */
function applySavedTheme() {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        updateToggleIcon("dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        updateToggleIcon("light");
    }
}

/* -------------------------
   TOGGLE THEME
-------------------------- */
function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");

    if (current === "dark") {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
        updateToggleIcon("light");
    } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        updateToggleIcon("dark");
    }
}

/* -------------------------
   UPDATE TOGGLE BUTTON ICON
-------------------------- */
function updateToggleIcon(theme) {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;

    btn.textContent = (theme === "dark") ? "☀️" : "🌙";
}

