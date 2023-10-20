import { DEFAULT_SETTINGS } from "../settings";
import packageJson from "../../package.json";

const themeSelect = document.getElementById("theme") as HTMLSelectElement;
const autohideCheckbox = document.getElementById(
    "dropdown",
) as HTMLInputElement;
const notifyCheckbox = document.getElementById(
    "notifications",
) as HTMLInputElement;
const highlightCheckbox = document.getElementById(
    "highlighting",
) as HTMLInputElement;
const soundCheckbox = document.getElementById("sounds") as HTMLInputElement;

chrome.tabs.query(
    { active: true, currentWindow: true },
    function callback(tabs) {
        if (
            tabs[0]?.url?.indexOf("://progtest.fit.cvut.cz") == -1 &&
            tabs[0].url.indexOf("://ptmock.localhost") == -1
        ) {
            if (tabs[0].url.indexOf("://newtab") != -1) {
                chrome.tabs.update(tabs[0].id, {
                    url: "https://progtest.fit.cvut.cz/",
                });
                window.close();
            } else {
                chrome.tabs.create({ url: "https://progtest.fit.cvut.cz/" });
            }
        }
    },
);

function saveOptions() {
    const theme = themeSelect?.value;
    const autohideResults = autohideCheckbox.checked;
    const showNotifications = notifyCheckbox.checked;
    const syntaxHighlighting = highlightCheckbox.checked;
    const playSounds = soundCheckbox.checked;
    chrome.storage.sync.set(
        {
            theme,
            autohideResults,
            showNotifications,
            syntaxHighlighting,
            playSounds,
        },
        function () {
            const status = document.getElementById("status");
            status.textContent = "Option saved";
            chrome.tabs.reload({ bypassCache: true });
            setTimeout(function () {
                status.textContent = "";
            }, 1500);
        },
    );
}

function loadContent() {
    chrome.storage.sync.get(DEFAULT_SETTINGS, function (items) {
        if (items === undefined) return;

        themeSelect.value = items.theme;
        autohideCheckbox.checked = items.autohideResults;
        notifyCheckbox.checked = items.showNotifications;
        highlightCheckbox.checked = items.syntaxHighlighting;
        soundCheckbox.checked = items.playSounds;
        hideDropdown();
        document.getElementById("version").textContent = packageJson.version;
    });
}

function hideDropdown() {
    const dropdown = document.getElementById("config");
    if (themeSelect.value.includes("orig")) {
        dropdown.style.display = "none";
    } else {
        dropdown.style.display = "block";
    }
}

themeSelect.addEventListener("change", hideDropdown);
document.addEventListener("DOMContentLoaded", loadContent);
document.getElementById("save").addEventListener("click", saveOptions);
