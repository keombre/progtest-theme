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
            window.addEventListener('load', this.scrollCheck.bind(this))
        }

        window.addEventListener('beforeunload', this.scrollHigh.bind(this))
    }

    scrollCheck() {
        if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40)
            this.scrollLow()
        else
            this.scrollHigh()

        this.oldScroll = window.scrollY;
    }

    scrollHigh() {
        if (this.header && this.header.getAttribute('style'))
            this.header.removeAttribute("style")
        if (this.tButton && this.tButton.getAttribute('style'))
            this.tButton.removeAttribute('style')
    }

    scrollLow() {
        if (this.header && !this.header.getAttribute('style'))
            this.header.style.padding = "0px 16px";
        if (this.tButton && !this.tButton.getAttribute('style') && (this.oldScroll <= window.scrollY || !this.oldScroll))
            this.tButton.style.transform = "scale(1)"
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
                100 - (text.substr(bracketPos + 1, 2) * 2) - text.includes('LS)'),
                this.getSubjectIcon(title),
                text.substr(0, bracketPos - 1),
                "20" + text.slice(bracketPos + 1, -1)
            ]
    }

    getSubjectIcon(title) {
        return ({
            "BI-PA1": "icon-pa1",
            "BI-PA2": "icon-pa2",
            "BI-PS1": "icon-ps1",
            "BI-OSY": "icon-osy",
            "BI-PJV": "icon-pjv",
            "BI-AG1": "icon-ag1",
            "BI-AAG": "icon-aag"
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

        this.replaceCountdown()
        
        this.easterEgg()
    }

    replaceCountdown() {
        if (!document.getElementById('countdown')) return
        // block setTimeout calls
        let elt = document.createElement("script")
        elt.innerHTML = "window.setCountdown();window.setCountdown = function () {};"
        document.head.appendChild(elt)
        
        // rename element
        document.getElementById('countdown').setAttribute('id', 'ptt-countdown')

        // create hidden mocked element
        let hide = document.createElement("div")
        hide.setAttribute("id", "countdown")
        hide.style.display = "none"
        document.head.appendChild(hide)

        let elm = document.getElementById('ptt-countdown')
        if (elm.innerHTML == '&nbsp;') return;
        elm.style.minWidth = "200px"
        let deadline = parseInt(elm.innerHTML.slice(0, -4)) * 1000 + new Date().getTime()

        let loop = () => {
            let remaining = (deadline - new Date().getTime()) / 1000
            let t = "Zbýv"
            if (remaining > 86400) {
                let days = parseInt(remaining / 86400)
                t += ([
                    "",
                    "á <b>{} den",
                    "ají <b>{} dny",
                    "ají <b>{} dny",
                    "ají <b>{} dny"
                ][remaining / 86400] || "á <b>{} dní").replace('{}', days)
                t += ", "
            } else
                t += "á <b>"
            let hours = remaining % 86400
            let minutes = hours % 3600
            t += parseInt(hours / 3600) + "h, " + parseInt(minutes / 60) + "m a " + parseInt(minutes % 60) + "s</b>"
            elm.innerHTML = t
        }
        
        loop()
        this.timerLoop = setInterval(loop, 900)
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
            } else if (
                text.includes('Neúspěch') ||
                text.includes('Program provedl neplatnou operaci a byl ukončen') ||
                text.includes('Program překročil přidělenou maximální')
            ) {
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

    easterEgg() {
        // play Portal 2 turrent sound on successful task submission (you are welcome ;) )
        let storage = window.localStorage
        if (!storage) return

        let params = window.location.search.split('&')
        let task = btoa((params[1] || '') + (params[2] || '') + (params[3] || ''))

        if (document.getElementById('refProgress')) {
            storage.setItem('upload', true)
            storage.setItem('task', task)
            return
        } else if (storage.getItem('upload') == "true" && storage.getItem('task') == task) {
            // upload ended and ptt has never seen this page before (yay!)
            if (document.querySelector("form > center > div.topLayout:nth-child(5) > div.outBox > table > tbody > tr.dropDownHeader > td.ltbOkSepCell")) {
                try {
                    new Audio(chrome.runtime.getURL("./themes/assets/turret.ogg")).play()
                } catch {}
            }
        }
        storage.setItem('upload', false)
        storage.setItem('task', task)
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
            eval(`this.${e.type}`).appendChild(this.createLink(e))
        )

        let container = document.createElement('div')
        container.classList.add('course_container')
        
        this.writeContainers(container)
        document.body.replaceChild(container, document.querySelector('center'))

        document.addEventListener('keydown', e => {
            if (e.key == "Escape")
                this.hideModal()
        })

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
            eval(`this.${e}`).appendChild(this.createTitle(e))
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
        let elem = document.createElement('span')
        if (text) {
            elem.classList.add('course_title')
            elem.innerText = text
        }
        return elem
    }

    writeContainers(elem) {
        this.getContainerNames().forEach(e => {
            const text = eval(`this.${e}`)
            if (text.childElementCount > 1)
                elem.appendChild(text)
        })
    }

    createLink(entry) {
        let ret
        if (entry.link) {
            ret = document.createElement('a')
            ret.href = entry.link
            ret.addEventListener('click', this.taskLink.bind(this))
        } else {
            ret = document.createElement('span')
        }
        let d = new Date()
        let datestr = ("0" + d.getDate()).slice(-2) + "." + ("0"+(d.getMonth()+1)).slice(-2) + "." + d.getFullYear()
        ret.classList.add(
            'course_link',
            entry.active ? 'course_link' : 'course_disabled',
            entry.deadline == datestr && (entry.score == '0.00' || entry.score == '--') ? 'course_deadline_today' : 'course_link'
        )
        ret.innerHTML += `<span class="course_link_name">${entry.name}</span>`
        ret.innerHTML += entry.score ? `<span class="course_link_score">${entry.score}</span>` : ''
        ret.innerHTML += entry.deadline ? `<span class="course_link_deadline">${entry.deadline}</span>` : ''
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
                "Výsledky": "results",
                "Úlohy": "extras",
                "Programovací": "tasks"
            })[name.replace(/ .*/, '')] || "unknown"

            if (name.includes('Teorie') || name.includes('Test'))
                type = "exams"

            // PS1 naming scheme
            else if (name.includes('. test'))
                type = "tests"
            else if (name.includes('domácí cvičení'))
                type = "tasks"
            else if (name.includes('Checkpoint'))
                type = "sem"
            else if (name.includes('Úloha'))
                type = "tasks"

            const active = !e.children[0].children[0].classList.contains('menuListDis')
            if (e.childElementCount == 4) {
                let link = e.children[3].querySelector('a.butLink')
                let deadline = this.trimDeadline(e.children[2].innerText)

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

    trimDeadline(text) {
        if (text.includes(' 23:59:59'))
            return text.substr(0, text.lastIndexOf(' '))
        return text
    }

    hideModal() {
        let modal = document.querySelector('.modal')
        if (modal) {
            modal.classList.remove('modal-show')
            modal.classList.add('modal-hide')
        }
    }

    taskLink(event) {
        // skip middle button & control+click
        if (event.which != 1 || event.ctrlKey)
            return true
        
        if (!event.target.innerText.includes("Výsledky"))
            this.displaySpinner()
        
        let target = event.target
        while (target.getAttribute('href') == null) {
            target = target.parentElement
        }
        this.getTaskGroups(target.getAttribute('href'))
        event.preventDefault()
        event.stopPropagation()
        return false
    }

    getTaskGroups(link) {
        fetch(link).then(e => {
            if (!e.ok || e.redirected)
                return Promise.reject()
            return e.text()
        })
        .then(this.parseTaskGrp.bind(this))
        //.then(this.checkSingleLink.bind(this))
        .then(this.createModal.bind(this))
        .catch(() => window.location.assign(link))
    }

    displaySpinner() {
        let spinner = document.createElement("div")
        spinner.classList.add("modal-spinner")
        document.body.insertBefore(spinner, document.querySelector('.course_container'))
    }
/*
    // not stable enough
    checkSingleLink(data) {
        if (data.tasks.length == 1)
            window.location.assign(data.tasks[0].link)
        Promise.resolve(data)
    }
*/
    createModal(data) {
        // create/get modal
        let modal = document.querySelector('.modal')
        if (modal == null) {
            modal = document.createElement('div')
            modal.classList.add('modal')
            document.body.insertBefore(modal, document.querySelector('.course_container'))
        }
        modal.innerHTML = ""
        modal.classList.remove('modal-hide')
        modal.classList.add('modal-show')
        let modalClose = document.createElement('div')
        modalClose.classList.add('modal-close')
        modalClose.innerText = '✖️'
        modalClose.addEventListener('click', this.hideModal.bind(this))
        modal.appendChild(modalClose)

        let modalHeader = document.createElement('div')
        modalHeader.classList.add('modal-header')
        modalHeader.innerHTML = `
<div class="modal-title">${data.info.title}</div>
<div class="modal-score">
    <span class="modal-score-my">${data.info.score}</span><span class="modal-score-max">${data.info.scoreMax}</span>
</div>
<div class="modal-deadline">
    <span class="modal-deadline-norm">${data.info.deadline}</span><span class="modal-deadline-late">${data.info.lateDeadline}</span>
</div>
`
        modal.appendChild(modalHeader)
        let modalBody = document.createElement('div')
        modalBody.classList.add("modal-body")
        data.tasks.forEach(task => {
            let modalLine = document.createElement('a')
            modalLine.classList.add('modal-line')
            modalLine.href = task.link
            modalLine.innerHTML = `
<div class="mtask-title">${task.title}</div>
<div class="mtask-sub">
    <span class="mtask-sub-my">${task.sub}</span><span class="mtask-sub-max">/${task.subMax} </span><span class="mtask-sub-pen">(+${task.subPen})</span>
</div>
<div class="mtask-score">
    <span class="mtask-score-my">${task.score}</span><span class="mtask-score-max">${task.scoreMax}</span>
</div>
<div class="mtask-text">${task.text}</div>
`
            modalBody.appendChild(modalLine)
        })
        let spinner = document.getElementsByClassName("modal-spinner")[0]
        if (spinner)
            spinner.parentNode.removeChild(spinner)
        modal.appendChild(modalBody)
    }

    parseTaskGrp(text) {
        // sanitize page
        text = text.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '')
        let doc = new DOMParser().parseFromString(text, 'text/html')

        /* data schema
        {
            'info': {
                'title': '',
                'deadline': '',
                'lateDeadline': '',
                'lateDeadlineInfo': '',
                'score': '',
                'scoreMax': '',
                'scoreInfo': ''
            },
            'tasks': [
                {
                    'title': '',
                    'link': '',
                    'text': '',
                    'sub': '',
                    'subMax': '',
                    'subPen': '',
                    'score': '',
                    'scoreMax': ''
                }
            ]
        }
        */

        let data = { 'info': {}, 'tasks': [] }

        // gather global task info
        data.info['title'] = doc.querySelector("body > center").innerText.trim()
        data.info['deadline'] = this.trimDeadline(doc.querySelector("#maintable > tbody > tr:nth-child(1) > td.tCell").innerText)
        let deadline = doc.querySelector("#maintable > tbody > tr:nth-child(2) > td.rCell > b"), score
        if (deadline) {
            data.info['lateDeadline'] = '(' + this.trimDeadline(deadline.innerText) + ')'
            data.info['lateDeadlineInfo'] = doc.querySelector("#maintable > tbody > tr:nth-child(2) > td.rCell").innerText.slice(data.info['lateDeadline'].length + 2, -1)
            score = doc.querySelector("#maintable > tbody > tr:nth-child(3) > td.rbCell > b").innerText
        } else {
            data.info['lateDeadline'] = ""
            data.info['lateDeadlineInfo'] = ""
            score = doc.querySelector("#maintable > tbody > tr:nth-child(2) > td.rbCell > b").innerText
        }
        let scoreDivPos = score.indexOf('/')
        data.info['score'] = score.substr(0, scoreDivPos - 3)
        data.info['scoreMax'] = score.slice(scoreDivPos + 2, -2)
        data.info['scoreInfo'] = doc.querySelector("#maintable > tbody > tr:nth-child(3) > td.rbCell").innerText.slice(score.length + 2, -1)

        // gather info about individual assignments
        doc.querySelectorAll('#maintable').forEach((e, i) => {  // Why are there multiple elements with same id?! :-(
            if (!i) return
            let task = {}
            task['title'] = e.querySelector("tbody > tr:nth-child(1) > td.tbSepCell").innerText
            task['link'] = e.querySelector("tbody > tr:nth-child(5) > td > div > div > a").href
            task['text'] = e.querySelector("tbody > tr:nth-child(4) > td").innerText
            let subms = e.querySelector("tbody > tr:nth-child(2) > td.rtCell").innerText
            let submsSl = subms.indexOf('/'), submsPl = subms.indexOf('+')
            task['sub'] = subms.substr(0, submsSl - 1)
            task['subMax'] = subms.substr(submsSl + 2, submsPl - submsSl - 3)
            task['subPen'] = subms.substr(submsPl + 2)
            let taskScore = e.querySelector("tbody > tr:nth-child(3) > td.rbCell").innerText
            let taskScoreDiv = taskScore.indexOf('/')
            task['score'] = taskScore.substr(0, taskScoreDiv - 3)
            task['scoreMax'] = taskScore.slice(taskScoreDiv + 2, -2)

            data.tasks.push(task)
        })

        return Promise.resolve(data)
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
                let navlink = document.querySelector("span.navlink") // first time login
                if (
                    document.querySelector('span.navLink > a.navLink[href="?X=Main"]') || (
                    navlink && navlink.innerText.includes("Než")
                ))
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
