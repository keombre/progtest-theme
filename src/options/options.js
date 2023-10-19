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
    let theme = document?.getElementById("theme")?.value;
    let hide = document.getElementById("dropdown").checked;
    let notify = document.getElementById("notifications").checked;
    let highlight = document.getElementById("highlighting").checked;
    let sound = document.getElementById("sounds").checked;
    chrome.storage.sync.set(
        {
            selectedTheme: theme,
            autoHide: hide,
            notifications: notify,
            highlighting: highlight,
            sounds: sound,
        },
        function () {
            let status = document.getElementById("status");
            status.textContent = "Option saved";
            chrome.tabs.reload({ bypassCache: true });
            setTimeout(function () {
                status.textContent = "";
            }, 1500);
        },
    );
}

function restoreOptions() {
    chrome.storage.sync.get(
        {
            selectedTheme: "automatic",
            autoHide: true,
            notifications: true,
            highlighting: true,
            sounds: true,
        },
        function (items) {
            document.getElementById("theme").value = items.selectedTheme;
            document.getElementById("dropdown").checked = items.autoHide;
            document.getElementById("notifications").checked =
                items.notifications;
            document.getElementById("highlighting").checked =
                items.highlighting;
            document.getElementById("sounds").checked = items.sounds;
            hideDropdown();
        },
    );
}

function hideDropdown() {
    let dd = document.getElementById("config");
    if (document.getElementById("theme").value.includes("orig")) {
        dd.style.display = "none";
    } else {
        dd.style.display = "block";
    }
}

document.getElementById("theme").addEventListener("change", hideDropdown);
document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
