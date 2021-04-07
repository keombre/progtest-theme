
var theme = 'automatic';
var dropdown = true
var displayNotifications = true
var highlighting = true
var sounds = true

const updateConfig = () => {
    chrome.storage.sync.get({
        selectedTheme: 'automatic',
        autoHide: true,
        notifications: true,
        highlighting: true,
        sounds: true
    }, (items) => {
        theme = items.selectedTheme;
        dropdown = items.autoHide;
        displayNotifications = items.notifications;
        highlighting = items.highlighting;
        sounds = items.sounds;
    })
}

chrome.runtime.onInstalled.addListener(updateConfig)
chrome.storage.onChanged.addListener(updateConfig)
chrome.runtime.onStartup.addListener(updateConfig)

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.type == "config")
            {sendResponse({
                theme: theme,
                dropdown: dropdown,
                displayNotifications: displayNotifications,
                highlighting: highlighting,
                sounds: sounds
            })}
    })


chrome.webRequest.onBeforeRequest.addListener(
    () => {
        if (theme == 'orig')
            {return { cancel: false };}
        let themeName;
        if (theme === 'automatic') {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                themeName = 'dark'
            } else {
                // light theme is the fallback if prefers-color-scheme doesn't work
                themeName = 'light'
            }
        } else {
            themeName = theme
        }
        return { redirectUrl: chrome.runtime.getURL('themes/' + themeName + '.css') };
    },
    { urls: ["*://progtest.fit.cvut.cz/css.css", "*://ptmock.localhost/css.css"] },
    ["blocking"]
)
