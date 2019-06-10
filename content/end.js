class Err404 {
    site_body = `
<div class="e404">
    <h1>HTTP/1.1 404 Not Found</h1>
    <h2>Stránka nenalezena</h2>
    <span>Zkuste se vrátit <a href="#" onclick="window.history.back()">zpátky</a></span>
</div>`

    constructor() {
        document.title = "404 | ProgTest";
        
        let link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');

        link.setAttribute('href', chrome.extension.getURL('./themes/404/' + theme + '.css'))
        document.getElementsByTagName('head')[0].appendChild(link)

        document.body.innerHTML = this.site_body
    }
}

class Login {
    langGlobe = `
<svg id="langGlobe" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
</svg>`

    constructor() {
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

            document.getElementsByName('lang')[0].outerHTML += this.langGlobe

        }
    }
}

class Logged {
    topButton = `
<svg id="upTop" xmlns="http://www.w3.org/2000/svg" viewBox="-1 -0.5 26 26">
    <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"></path>
</svg>
`
    constructor() {
        document.querySelector("body > table").className += " navbar"
        // add scroll to top button
        document.body.innerHTML += this.topButton
        this.tButton = document.getElementById('upTop')
        if (this.tButton) {
            this.tButton.addEventListener('click', (e) => {
                this.tButton.removeAttribute('style')
                document.body.scrollIntoView({ block: "start", behavior: "smooth" })
            })
        }

        this.header = document.querySelector("body > table")
        
        if (typeof this.header != "undefined" && this.header != null) {
            window.onscroll = this.scrollCheck.bind(this)
            this.scrollCheck()
        }
    }

    scrollCheck() {
        if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
            if (this.header && !this.header.getAttribute('style'))
                this.header.style.padding = "0px 16px";
            if (this.tButton && !this.tButton.getAttribute('style') && (this.oldScroll <= window.scrollY || !this.oldScroll))
                this.tButton.style.transform = "scale(1)"
        } else {
            if (this.header && this.header.getAttribute('style'))
                this.header.removeAttribute("style")
            if (this.tButton && this.tButton.getAttribute('style'))
                this.tButton.removeAttribute('style')
        }
        this.oldScroll = window.scrollY;
    }
}

class Main extends Logged {
    constructor() {
        super()
        
        // collect all elements
        let elems = []
        document.querySelectorAll("body > center > table > tbody > tr").forEach(e =>
            elems.push([e.children[0].innerText, e.children[1].children[0].children[0].children[0].href])
        )

        document.querySelector('center').outerHTML = '<div class="subjectSelect"></div><div class="subjectSelect mainInfo"></div>'
        let sels = document.querySelectorAll('div.subjectSelect')
        let push

        elems.forEach(e => {
            let title = e[0], order, text = "", icon, footer, orderC = 100
            if (title.includes('Nastavení')) {
                order = 10001
                icon = 'icon-setting'
                push = sels[1]
            } else if (title.includes('Kompilátory')) {
                text = title
                title = "Cloud compute"
                order = 10000
                icon = 'icon-compile'
                push = sels[1]
            } else if (title.includes('FAQ')) {
                order = 10002
                icon = 'icon-faq'
                text = 'Často kladené dotazy'
                push = sels[1]
            } else {
                // determine order
                let bracketPos = title.lastIndexOf('(')
                
                if (bracketPos == -1) {
                    order = orderC++
                    icon = 'icon-unknown'
                } else {
                    order = 100 - (title.substr(bracketPos+1, 2) * 2) - title.includes('LS)')
                    text = title.substr(0, bracketPos-1)
                    footer = title.slice(bracketPos+1, -1)
                    switch (text) {
                        case "Programování a algoritmizace I":
                            title = "BI-PA1"
                            icon = "icon-pa1"
                            break
                        case "Programování a algoritmizace II":
                            title = "BI-PA2"
                            icon = "icon-pa2"
                            break
                        case "Programování v shellu 1":
                            title = "BI-PS1"
                            icon = "icon-ps1"
                            break
                        case "Operační systémy":
                            title = "BI-OSY"
                            icon = "icon-osy"
                            break
                        default:
                            icon = "icon-unknown"
                            title = text
                            text = ""
                    }
                }
                push = sels[0]
            }
            push.innerHTML += `
<a href="${e[1]}" class="subject" style="order: ${order}">
    <div class="subject-title">${title}</div>
    <div class="icon ${icon}"></div>
    <div class="subject-body">${text}</div>
    ${footer ? `<div class="subject-footer">${footer}</div>` : ''}
</a>`
        })
    }
}

class Task extends Logged {
    constructor() {
        super()

        // autohide result tables
        if (dropdown)
            this.autoHideResults()

        // mark help checkboxes for grid
        document.querySelectorAll('input[type="checkbox"][name]').forEach(e => {
            e.parentNode.className += " gridHelp"
        })

        this.markResultsTable()

        // nicer progress bar
        let progress = document.getElementById('refVal')
        if (progress) {
            progress.scrollIntoView({ block: "center" })
        }
    }

    markResultsTable() {
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
    }

    autoHideResults() {
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
        [
            "rtbSepCell",
            "rtbOkSepCell",
            "rtbHalfSepCell",
            "rtbXSepCell",
            "rtbFailSepCell",
            "rtbEditSepCell"
        ].forEach(n => {
            document.querySelectorAll("td." + n + " > div.but1.w120").forEach(e => {
                let resHead = e.parentNode.parentNode
                resHead.className += " dropDownHeader"
                resHead.addEventListener('click', toggleDropDown)
                resHead.click()
            })
        })
    }
}

class Results extends Logged {
    constructor() {
        super()

        let styles = ''

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
    }
}

const args = window.location.search.substr(1).split("&").reduce((f, e) => {
    let k = e.split("=")
    f[k[0]] = k[1]
    return f
}, {})

let parser

const preload = () => {

    document.body.removeAttribute('bgcolor')
    document.body.removeAttribute('text')

    // 404
    if (document.body.innerHTML == "")
        parser = new Err404()
    // login
    else if (document.querySelector('select[name=UID_UNIVERSITY]') != null)
        parser = new Login()
    else if ('X' in args)
        switch (args['X']) {
            case "FAQ":
            case "Preset":
            case "CompilersDryRuns":
            case "Extra":
            case "KNT":
            case "Course":
            case "TaskGrp":
                parser = new Logged()
                break
            case "Results":
                parser = new Results()
            case "Task":
                parser = new Task()
                break
            case "Main":
            default:
                parser = new Main()
        }
    else
        parser = new Main()
}

if (!settingsLoaded)
    window.addEventListener('ppt-loaded', preload)
else
    preload()
