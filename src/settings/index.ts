import Settings from "./settings.svelte";

// on click, Open Progtest in new tab
if (typeof chrome === "object") {
    chrome.tabs.query(
        { active: true, currentWindow: true },
        function callback(tabs) {
            if (
                tabs[0]?.url?.indexOf("://progtest.fit.cvut.cz") == -1 &&
                tabs[0].url.indexOf("://ptmock.localhost") == -1
            ) {
                if (tabs[0].url.indexOf("://newtab") != -1) {
                    if (tabs[0].id !== undefined) {
                        chrome.tabs.update(tabs[0].id, {
                            url: "https://progtest.fit.cvut.cz/",
                        });
                    }
                    window.close();
                } else {
                    chrome.tabs.create({
                        url: "https://progtest.fit.cvut.cz/",
                    });
                }
            }
        },
    );
}

// settings page
new Settings({ target: document.body });
