
var theme = 'light';
var dropdown = true

const updateConfig = () => {
    chrome.storage.sync.get({
        selectedTheme: 'light',
        autoHide: true
    }, (items) => {
        theme = items.selectedTheme;
        dropdown = items.autoHide;
    })
}

chrome.runtime.onInstalled.addListener(updateConfig)
chrome.storage.onChanged.addListener(updateConfig)
chrome.runtime.onStartup.addListener(updateConfig)

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.type == "config")
            sendResponse({ theme: theme, dropdown: dropdown })
    })


chrome.webRequest.onBeforeRequest.addListener(
    () => {
        if (theme == 'orig')
            return { cancel: false };
        return { redirectUrl: chrome.runtime.getURL('themes/' + theme + '.css') };
    },
    { urls: ["*://progtest.fit.cvut.cz/css.css", "*://ptmock.localhost/css.css"] },
    ["blocking"]
)
