var theme
var dropdown

chrome.runtime.sendMessage({ type: "config" }, function (response) {
    theme = response.theme
    dropdown = response.dropdown

    if (response.theme == 'orig')
        return

    var favicon = document.querySelector("link[rel*='icon']") || document.createElement('link');
    favicon.type = 'image/x-icon';
    favicon.rel = 'shortcut icon';
    favicon.href = chrome.extension.getURL('./themes/assets/favicon.ico');
    document.getElementsByTagName('head')[0].appendChild(favicon);
    document.title = document.title.replace("@progtest.fit.cvut.cz -", " |").replace("progtest.fit.cvut.cz - ", "")
})

function toggleDropDown(e) {
    if (e.button == 2)
        return
    if (e.target.nodeName == "A" || e.target.nodeName == "BUTTON")
        return
    let id = 0
    for (let node of e.currentTarget.parentNode.children) {
        if (id++ == 0)
            continue
        if (node.className.indexOf("dropDownHide") == -1)
            node.className += " dropDownHide"
        else
            node.className = node.className.replace(" dropDownHide", "")
    }
}
