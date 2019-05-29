const cont_404 = `
<div class="e404">
    <h1>HTTP/1.1 404 Not Found</h1>
    <h2>Stránka nenalezena</h2>
    <span>Zkuste se vrátit <a href="#" onclick="window.history.back()">zpátky</a></span>
</div>`

const cont_tButton = `
<svg id="upTop" xmlns="http://www.w3.org/2000/svg" viewBox="-1 -0.5 26 26">
    <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"></path>
</svg>
`

let tButton

const parsePage = () => {

    let styles = ''

    // display 404
    if (document.body.innerHTML == "") {
        document.title = "404 | ProgTest";
        
        let link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');

        if (theme == 'light')
            link.setAttribute('href', chrome.extension.getURL('./themes/404.light.css'))
        else
            link.setAttribute('href', chrome.extension.getURL('./themes/404.dark.css'))
        
            document.getElementsByTagName('head')[0].appendChild(link)

        document.body.innerHTML = cont_404
    } else {
        // add scroll to top button
        document.body.innerHTML += cont_tButton
        tButton = document.getElementById('upTop')
        if (tButton)
            tButton.addEventListener('click', (e) => {
                e.target.removeAttribute('style')
                document.body.scrollIntoView({ block: "start", behavior: "smooth" })
            })
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
            if (header && !header.getAttribute('style'))
                header.style.padding = "0px 16px";
            if (tButton && !tButton.getAttribute('style') && (this.oldScroll <= this.scrollY || !this.oldScroll))
                tButton.style.transform = "scale(1)"
        } else {
            if (header && header.getAttribute('style'))
                header.removeAttribute("style")
            if (tButton && tButton.getAttribute('style'))
                tButton.removeAttribute('style')
        }
        this.oldScroll = this.scrollY;
    }

    if (typeof header != "undefined" && header != null) {
        window.onscroll = scrollCheck
        scrollCheck()
    }

    // autohide result tables
    if (dropdown) {

        // make ref solution clickable
        let checkbox = document.querySelector('input[name="SHOW_REF"]')
        if (checkbox) {
            let refHead = checkbox.parentNode.parentNode
            let refSib = refHead.nextElementSibling

            while (refSib) {
                refSib.removeAttribute('style')
                refSib = refSib.nextElementSibling
            }

            refHead.className += " dropDownHeader"
            refHead.addEventListener('click', toggleDropDown)
            refHead.click()
            checkbox.parentNode.removeChild(checkbox)
        }

        // hide the rest
        ["rtbSepCell", "rtbOkSepCell", "rtbHalfSepCell", "rtbXSepCell", "rtbFailSepCell", "rtbEditSepCell"]
            .forEach(n => {
                document.querySelectorAll("td." + n + " > div.but1.w120").forEach(e => {
                    let resHead = e.parentNode.parentNode
                    resHead.className += " dropDownHeader"
                    resHead.addEventListener('click', toggleDropDown)
                    resHead.click()
                })
            })
    }

    // mark help checkboxes for grid
    document.querySelectorAll('input[type="checkbox"][name]').forEach(e => {
        e.parentNode.className += " gridHelp"
    })

    // nicer progress bar
    let progress = document.getElementById('refVal')
    if (progress) {
        document.querySelector("td.header").innerHTML += "<small>Probíhá hodnocení</small>"
        progress.scrollIntoView({ block: "center" })
    }
    
}

if (!settingsLoaded)
    window.addEventListener('ppt-loaded', parsePage)
else
    parsePage()
