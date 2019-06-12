'use strict';

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

        const subjects = document.createElement('div')
        subjects.classList.add('subjectSelect')
        
        const settings = document.createElement('div')
        settings.classList.add('subjectSelect')
        settings.classList.add('mainInfo');

        this.orderC = 100

        // collect all elements
        this.getSubjects().forEach(e => {

            const [
                order,
                icon,
                text = e[0],
                footer = "",
                push = settings
            ] = this.parseSettings(e[2]) || this.parseSubject(e[2], e[0]).concat(subjects)
            
            push.innerHTML += `
<a href="${e[1]}" class="subject" style="order: ${order}">
    <div class="subject-title">${e[2]}</div>
    <div class="icon ${icon}"></div>
    <div class="subject-body">${text}</div>
    ${footer ? `<div class="subject-footer">${footer}</div>` : ''}
</a>`
        })

        document.querySelector('center').outerHTML = subjects.outerHTML + settings.outerHTML
    }

    parseSettings(title) {
        return ({
            "Nastavení": [10001, 'icon-setting', ""],
            "Překladače": [10000, 'icon-compile'],
            "FAQ": [10002, 'icon-faq', "Často kladené dotazy"]
        })[title]
    }

    parseSubject(title, text) {

        const bracketPos = text.lastIndexOf('(')
        if (bracketPos == -1)
            return [this.orderC++, 'icon-unknown', text, ""]
        else
            return [
                100 - (text.substr(bracketPos+1, 2) * 2) - text.includes('LS)'),
                this.getSubjectIcon(title),
                text.substr(0, bracketPos-1),
                text.slice(bracketPos+1, -1)
            ]
    }

    getSubjectIcon(title) {
        return ({
            "BI-PA1": "icon-pa1",
            "BI-PA2": "icon-pa2",
            "BI-PS1": "icon-ps1",
            "BI-OSY": "icon-osy"
        })[title] || "icon-unknown"
    }

    getSubjects() {
        return [...document.querySelectorAll("body > center > table > tbody > tr")].map(this.getSubjectNames)
    }

    getSubjectNames(e) {
        const ch = e.children[1].children[0].children[0].children[0]
        return [e.children[0].innerText, ch.href, ch.innerText]
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
        if (progress)
            setTimeout(() => progress.scrollIntoView({ block: "center" }), 10)
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

class Course extends Logged {
    constructor() {
        super()

        this.createContainers()

        this.getTasks().forEach(e =>
            eval(`this.${e.type}`).innerHTML += this.createLink(e)
        )
        
        let container = document.createElement('div')
        container.classList.add('course_container')

        this.writeContainers(container)
        document.body.replaceChild(container, document.querySelector('center'))

        let styleSheet = document.createElement("style")
        styleSheet.type = "text/css"
        styleSheet.innerText = this.createSpanningStylesheet(container)
        document.head.appendChild(styleSheet)
    }

    createSpanningStylesheet(container) {
        let stylesheet = ""
        for (let elm of container.children)
            if (elm.classList.item(0) != "course_results_grp")
                stylesheet += `.${elm.classList.item(0)} {grid-row: span ${elm.childElementCount};}`
        return stylesheet
    }

    getContainerNames() {
        return ["tasks", "tasks_extra", "exams", "sem", "tests", "results", "extras", "unknown"]
    }

    createContainers() {
        this.getContainerNames().forEach(e => {
            eval(`this.${e} = document.createElement('div')`)
            eval(`this.${e}`).classList.add(`course_${e}_grp`)
            eval(`this.${e}`).classList.add(`course_grp`)
            eval(`this.${e}`).innerHTML += this.createTitle(e)
        })
    }

    createTitle(name) {
        const text = ({
            "tasks": "Domácí úlohy",
            "tasks_extra": "Soutěžní úlohy",
            "exams": "Zkouška",
            "sem": "Semestrální práce",
            "tests": "Znalostní testy",
            "extras": "Extra",
            "unknown": "Neznámá kategorie"
        })[name]
        if (text)
            return `<span class="course_title">${text}</span>`
        else
            return "<span></span>"
    }

    writeContainers(elem) {
        this.getContainerNames().forEach(e => {
            const text = eval(`this.${e}`)
            if (text.childElementCount > 1)
                elem.innerHTML += text.outerHTML
        })
    }

    createLink(entry) {
        let ret = ""
        ret += entry.link ? 
            `<a href="${entry.link}" class="course_link${entry.active ? '' : ' course_disabled'}">` :
            `<span class="course_link${entry.active ? '' : ' course_disabled'}">`
        ret += `<span class="course_link_name">${entry.name}</span>`
        ret += entry.score ? `<span class="course_link_score">${entry.score}</span>` : ''
        ret += entry.deadline ? `<span class="course_link_deadline">${entry.deadline}</span>` : ''
        ret += entry.link ? `</a>` : `</span>`
        return ret
    }

    getTasks() {
        return [...document.querySelectorAll("table.topLayout > tbody > tr")].map(e => {
            const name = e.children[0].innerText
            let type = ({
                "Zahřívací": "tasks",
                "Domácí": "tasks",
                "Soutěžní": "tasks_extra",
                "Semestrální": "sem",
                "Znalostní": "tests",
                "Zkouška": "exams",
                "Cvičení": "extras",
                "Práce": "extras",
                "Checkpoint": "extras",
                "Code": "extras",
                "Výsledky": "results"
            })[name.replace(/ .*/,'')] || "unknown"

            if (name.includes('Teorie') || name.includes('Test'))
                type = "exams"
            
            // PS1 naming scheme
            else if (name.includes('. test'))
                type = "tests"
            else if (name.includes('domácí cvičení'))
                type = "tasks"
            else if (name.includes('Checkpoint'))
                type = "sem"

            const active = !e.children[0].children[0].classList.contains('menuListDis')
            if (e.childElementCount == 4) {
                let link = e.children[3].querySelector('a.butLink')
                let deadline = e.children[2].innerText
                if (deadline.includes(' 23:59:59'))
                    deadline = deadline.substr(0, deadline.lastIndexOf(' '))

                return {
                    type,
                    name,
                    active,
                    "score": e.children[1].innerText,
                    deadline,
                    "link": link && link.href
                }
            } else if (e.childElementCount == 2) {
                let link = e.children[1].querySelector('a.butLink')
                return {
                    type,
                    name,
                    active,
                    "score": null,
                    "deadline": null,
                    "link": link && link.href
                }
            }
        })
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
            case "TaskGrp":
                parser = new Logged()
                break
            case "Course":
                parser = new Course()
                break
            case "Results":
                parser = new Results()
            case "Compiler":
            case "DryRun":
            case "Task":
            case "TaskU":
                parser = new Task()
                break
            case "Main":
                parser = new Main()
                break
            default:
                // determine if site is really main
                if (document.querySelector('span.navLink > a.navLink[href="?X=Main"]'))
                    parser = new Logged()
                else
                    parser = new Main()
                
                
        }
    else
        parser = new Main()
}

if (!settingsLoaded)
    window.addEventListener('ppt-loaded', preload)
else
    preload()
