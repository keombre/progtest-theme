
var theme = 'light';

chrome.runtime.onInstalled.addListener(function () {

    chrome.storage.sync.get({
        selectedTheme: 'light'
    }, (items) => {
        theme = items.selectedTheme;
    });

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { hostEquals: 'progtest.fit.cvut.cz' },
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

chrome.storage.onChanged.addListener(
    () => {
        chrome.storage.sync.get({
            selectedTheme: 'light'
        }, (items) => {
            theme = items.selectedTheme;
        });
    }
);

chrome.webRequest.onBeforeRequest.addListener(
    () => {
        if (theme == 'orig')
            return { cancel: false };
        return { redirectUrl: chrome.runtime.getURL('themes/' + theme + '.css') };
    },
    { urls: ["*://progtest.fit.cvut.cz/css.css"] },
    ["blocking"]
);
