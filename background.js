
var theme = 'light';
var dropdown = true;

const updateConfig = () => {
    browser.storage.sync.get({
        selectedTheme: 'light',
        autoHide: true
    }, (items) => {
        theme = items.selectedTheme;
        dropdown = items.autoHide;
    })
}

browser.runtime.onInstalled.addListener(updateConfig)
browser.storage.onChanged.addListener(updateConfig)
browser.runtime.onStartup.addListener(updateConfig)

browser.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.type == "config")
            sendResponse({ theme: theme, dropdown: dropdown })
    })


browser.webRequest.onBeforeRequest.addListener(
    () => {
        if (theme == 'orig')
            return { cancel: false };
        return { redirectUrl: browser.runtime.getURL('themes/' + theme + '.css') };
    },
    { urls: ["*://progtest.fit.cvut.cz/css.css", "*://ptmock.localhost/css.css"] },
    ["blocking"]
)
