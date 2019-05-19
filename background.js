
var theme = 'light';
var dropdown = true

chrome.runtime.onInstalled.addListener(function () {

    chrome.storage.sync.get({
        selectedTheme: 'light',
        autoHide: true
    }, (items) => {
        theme = items.selectedTheme;
        dropdown = items.autoHide;
    })
})

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.type == "config")
            sendResponse({ theme: theme, dropdown: dropdown })
    })

chrome.storage.onChanged.addListener(
    () => {
        chrome.storage.sync.get({
            selectedTheme: 'light',
            autoHide: true
        }, (items) => {
            theme = items.selectedTheme;
            dropdown = items.autoHide;
        })
    }
)

chrome.webRequest.onBeforeRequest.addListener(
    () => {
        if (theme == 'orig')
            return { cancel: false };
        return { redirectUrl: chrome.runtime.getURL('themes/' + theme + '.css') };
    },
    { urls: ["*://progtest.fit.cvut.cz/css.css"] },
    ["blocking"]
)
