chrome.runtime.sendMessage({ type: "config" }, function (response) {
    if (response.theme == 'orig')
        return

    var favicon = document.querySelector("link[rel*='icon']") || document.createElement('link');
    favicon.type = 'image/x-icon';
    favicon.rel = 'shortcut icon';
    favicon.href = chrome.extension.getURL('./themes/assets/favicon.ico');
    document.getElementsByTagName('head')[0].appendChild(favicon);
    document.title = document.title.replace("@progtest.fit.cvut.cz -", " |").replace("progtest.fit.cvut.cz - ", "")

    window.onload = () => {
        let styles = ''
        
        // check for login screen
        if (document.querySelector('select[name=UID_UNIVERSITY]') != null) {
            let l_form = document.getElementsByTagName("form")[0]
            if (typeof l_form != "undefined") {
                let title = document.createElement('DIV')
                title.className = "app_name"
                title.innerHTML = "FIT: <b>ProgTest</b>"
                l_form.parentElement.insertBefore(title, l_form)
            }
        }

        // add selector to duplicate parrent elements
        document.querySelectorAll("span.dupC").forEach(e => { e.parentNode.className += " dupCpar" })

        // mark number of columns
        let c = [], i = 0
        let qsel = document.querySelector("tr.resHdr:nth-child(1)")
        if (typeof qsel != undefined && qsel != null) {
            qsel.childNodes.forEach(e => { c.push(i += parseInt(e.getAttribute("colspan") || 1)) })
            c.pop()
            c.shift()
            c.forEach(e => {
                styles += 'tr.resRow > td:nth-child(' + (e + 1) + ') {border-left: thin solid rgba(0, 0, 0, 0.125);font-weight: 500;}'
            })

            styles += 'tr.resRow > td:last-child {font-weight: 500;}'
        }

        let styleSheet = document.createElement("style")
        styleSheet.type = "text/css"
        styleSheet.innerText = styles
        document.head.appendChild(styleSheet)

        let header = document.querySelector("body > table")

        if (typeof header != "undefined" && header != null) {
            window.onscroll = () => {
                if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40)
                    header.style.padding = "0px 16px";
                else
                    header.removeAttribute("style")
            }
        }
        
        if (response.dropdown) {
            ["rtbSepCell", "rtbOkSepCell", "rtbHalfSepCell", "rtbWaitSepCell", "rtbXSepCell", "rtbFailSepCell", "rtbEditSepCell"]
            .forEach(n => {
                document.querySelectorAll("td."+n+" > div.but1.w120").forEach(e => {
                    e.parentNode.parentNode.className += " dropDownHeader"
                    e.parentNode.parentNode.addEventListener('click', toggleDropDown)
                    e.parentNode.parentNode.click()
                })
            })
        }

        // display 404
        if (document.body.innerHTML == "") {
            document.title = "404 | ProgTest";
            var link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('type', 'text/css');
            if (response.theme == 'light')
                link.setAttribute('href', chrome.extension.getURL('./themes/404.light.css'));
            else
                link.setAttribute('href', chrome.extension.getURL('./themes/404.dark.css'));
            document.getElementsByTagName('head')[0].appendChild(link);

            document.body.innerHTML = '<div class="e404"><h1>HTTP/1.1 404 Not Found</h1><h2>Stránka nenalezena</h2><span>Zkuste se vrátit <a href="#" onclick="window.history.back()">zpátky</a></span></div>';
        }
    }
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