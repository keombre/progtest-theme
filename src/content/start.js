var theme
var dropdown
var displayNotifications
var highlighting
var sounds
var settingsLoaded = false
var pttLoaded = new Event('ptt-loaded');

const loader = `
<div id="loadWrapper">
    <div class="anim-load anim-1"></div>
    <div class="anim-load anim-2"></div>
    <div class="anim-load anim-3"></div>
    <svg class="anim-logo" width="18.85mm" version="1.1" viewBox="0 0 23.272 34.408" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(-91.281 -156.77)">
        <path transform="scale(.26458)" d="m345 592.52v130.04h22.191v-46.16h23.389c26.86-0.2507 42.835-24.438 42.367-45.045-0.42142-18.58-13.702-38.75-40-38.84zm22.191 17.232h19.506c15.165 0 22.945 12.225 23.125 23.125 0.18935 11.453-10.085 25.09-23.482 25.09h-19.148z" fill="#565f7c"/>
        </g>
    </svg>
</div>`


chrome.runtime.sendMessage({ type: "config" }, function (response) {

    // load user config and dispatch event when ready
    theme = response.theme
    dropdown = response.dropdown
    displayNotifications = response.displayNotifications
    highlighting = response.highlighting
    sounds = response.sounds

    if (response.theme == 'orig' || response.theme == 'orig-dark')
        return
    
    errorReporter()
    
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

    addLoader()
})

const errorReporter = () => {
    window.onerror = (event, source, lineno) => {
        if (document.body == null)
            return true
        if (!source.includes('chrome-extension:'))
            return true
        let err = document.createElement('div')
        err.innerHTML = event + " at " + source.substr(source.lastIndexOf('/') + 1) + ":" + lineno
        err.classList.add('errorReporter')
        document.body.appendChild(err)
        return false
    }
}

const addLoader = () => {
    let ld = document.createElement('pttloader')
    ld.innerHTML = loader
    document.children[0].appendChild(ld)
    window.addEventListener('load', () => {
        document.getElementById('loadWrapper').classList.add('loadWrapperHide')
        setTimeout(() => document.getElementById('loadWrapper').style.visibility = 'hidden', 200)
    })

    window.addEventListener('beforeunload', () => {
        document.getElementById('loadWrapper').style.visibility = 'visible'
        document.getElementById('loadWrapper').classList.remove('loadWrapperHide')
    })
    
}

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

const loginFocusOut = (event) => {
    if (event.target.value == "")
        event.target.parentNode.parentNode.children[0].children[0].removeAttribute('moved')
}

const loginFocus = (event) => {
    event.target.parentNode.parentNode.children[0].children[0].click()
}
