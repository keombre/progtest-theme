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

const cont_langGlobe = `
<svg id="langGlobe" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
</svg>`

let tButton

const parsePage = () => {

    let styles = ''

    document.body.removeAttribute('bgcolor')
    document.body.removeAttribute('text')

    // display 404
    if (document.body.innerHTML == "") {
        document.title = "404 | ProgTest";
        
        let link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');

        link.setAttribute('href', chrome.extension.getURL('./themes/404/' + theme + '.css'))
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
            l_form.className += " loginForm"

            let uniselect = document.createElement('DIV')
            uniselect.id = "uniSel"

            document.querySelector("#main > tbody > tr:nth-child(2) > td.rtbCell > select").childNodes.forEach(e => {
                let uni = document.createElement('DIV')
                uni.innerText = e.innerText
                uni.setAttribute('uni', e.value)
                uni.className = "uniVal"
                uni.addEventListener('click', uniChange)
                uniselect.appendChild(uni)
            })

            uniselect.children[0].setAttribute('active', 'true')
            
            l_form.appendChild(uniselect)

            // add title mover
            document.querySelector("#ldap1 > td.ltCell.al > b").addEventListener('click', moveInputLabel)
            document.querySelector("#ldap2 > td.al.lbCell > b").addEventListener('click', moveInputLabel)

            const inputs = document.getElementsByTagName('input')
            inputs[0].addEventListener('focus', loginFocus)
            inputs[1].addEventListener('focus', loginFocus)

            inputs[0].addEventListener('focusout', loginFocusOut)
            inputs[1].addEventListener('focusout', loginFocusOut)

            document.getElementsByName('lang')[0].outerHTML += cont_langGlobe

        }
    } else {
        document.querySelector("body > table").className += " navbar"
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

    // add emoji before test results
    document.querySelectorAll('form > center > div:not(:nth-child(1)) .lrtbCell li > ul:only-child').forEach(e => {
        let node = e.previousSibling
        let text = node.textContent
        if (text.includes('Úspěch')) {
            if (e.firstElementChild.innerHTML.includes('Dosaženo: 100.00 %'))
                node.parentElement.className += " testRes testOK"
            else
                node.parentElement.className += " testRes testAOK"
        } else if (text.includes('Neúspěch') || text.includes('Program provedl neplatnou operaci a byl ukončen')) {
            node.parentElement.className += " testRes testFailed"
        } else {
            node.parentElement.className += " testRes testUnknown"
        }
    })

    document.querySelectorAll('li.testRes a').forEach(e => {
        e.innerHTML = e.innerHTML.slice(1, -1)
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
