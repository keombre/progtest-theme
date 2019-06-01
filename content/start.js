var theme
var dropdown
var settingsLoaded = false
var pttLoaded = new Event('ptt-loaded');

chrome.runtime.sendMessage({ type: "config" }, function (response) {

    // load user config and dispatch event when ready
    theme = response.theme
    dropdown = response.dropdown

    if (response.theme == 'orig')
        return

    settingsLoaded = true
    window.dispatchEvent(pttLoaded)
    
    // add favicon
    var favicon = document.querySelector("link[rel*='icon']") || document.createElement('link');
    favicon.type = 'image/x-icon';
    favicon.rel = 'shortcut icon';
    favicon.href = chrome.extension.getURL('./themes/assets/favicon.ico');
    document.getElementsByTagName('head')[0].appendChild(favicon);

    // change page title
    document.title = document.title.replace("@progtest.fit.cvut.cz -", " |").replace("progtest.fit.cvut.cz - ", "")
})

const toggleDropDown = (e) => {
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

const uniChange = (event) => {
    let c = 0, i
    document.getElementById('uniSel').childNodes.forEach(e => {
        e.removeAttribute('active')
        if (e == event.target)
            i = c
        c++
    })

    event.target.setAttribute('active', 'true')

    let select = document.querySelector('select[name="UID_UNIVERSITY"]')
    select.selectedIndex = i
    let trigger = new Event('change');
    select.dispatchEvent(trigger);
}

const moveInputLabel = (event) => {
    event.target.setAttribute('moved', true)
    event.target.parentNode.parentNode.children[1].children[0].focus()
}

const moveLabelInput = (event) => {
    event.target.parentNode.parentNode.children[0].children[0].click()
}