const parsePage = () => {

    let styles = ''

    // display 404
    if (document.body.innerHTML == "") {
        document.title = "404 | ProgTest";
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        if (theme == 'light')
            link.setAttribute('href', chrome.extension.getURL('./themes/404.light.css'));
        else
            link.setAttribute('href', chrome.extension.getURL('./themes/404.dark.css'));
        document.getElementsByTagName('head')[0].appendChild(link);

        document.body.innerHTML = '<div class="e404"><h1>HTTP/1.1 404 Not Found</h1><h2>Stránka nenalezena</h2><span>Zkuste se vrátit <a href="#" onclick="window.history.back()">zpátky</a></span></div>';
    } else {
        document.body.innerHTML += '<div id="upTop">➜</div>'

        document.getElementById('upTop').addEventListener('click', tScroll)
    }

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

    const scrollCheck = () => {
        if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
            header.style.padding = "0px 16px";
            showUp()
        } else {
            header.removeAttribute("style")
            hideUp()
        }
    }

    if (typeof header != "undefined" && header != null) {
        window.onscroll = scrollCheck
        scrollCheck()
    }

    if (dropdown) {
        ["rtbSepCell", "rtbOkSepCell", "rtbHalfSepCell", "rtbXSepCell", "rtbFailSepCell", "rtbEditSepCell"]
            .forEach(n => {
                document.querySelectorAll("td." + n + " > div.but1.w120").forEach(e => {
                    e.parentNode.parentNode.className += " dropDownHeader"
                    e.parentNode.parentNode.addEventListener('click', toggleDropDown)
                    e.parentNode.parentNode.click()
                })
            })
    }

    // nicer progress bar
    var progress = document.getElementById('refVal')
    if (progress) {
        document.querySelector("td.header").innerHTML += "<small>Probíhá hodnocení</small>"
        progress.scrollIntoView({ block: "center" })
    }
}

if (!settingsLoaded)
    window.addEventListener('ppt-loaded', parsePage)
else
    parsePage()
