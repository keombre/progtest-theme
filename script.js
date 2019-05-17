chrome.webRequest.onBeforeRequest.addListener(
    function(details) {return {cancel: true};},
    {urls: ["*://progtest.fit.cvut.cz/css.css"]},
    ["blocking"]
);
