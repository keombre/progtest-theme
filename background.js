
var theme = 'light';

chrome.runtime.onInstalled.addListener(function () {

    chrome.storage.sync.get({
        selectedTheme: 'light'
    }, (items) => {
        theme = items.selectedTheme;
    })
})

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.type == "theme")
            sendResponse({ theme: theme })
    })

chrome.storage.onChanged.addListener(
    () => {
        chrome.storage.sync.get({
            selectedTheme: 'light'
        }, (items) => {
            theme = items.selectedTheme;
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
