let Primer = {}
{
    Primer.Templates = {
        Login: `
<div class="container clearfix height-full">
    <div class="col-xl-8 col-lg-7 col-3 float-left height-full" id="wide-bg"></div>
    <div class="col-xl-4 col-lg-5 col-9 float-right bg-blue-light p-5 border-left border-blue-light height-full">
        <h1 class="f00-light text-blue">Prog<b>test</b></h1>
        <p class="lead text-italic">"Testing makes perfect"</p>
        <div class="mt-8">
            <button id="sso_link" class="btn btn-block btn-primary">Přihlášení FIT-SSO</button>
        </div>
        <div class="Box mt-4">
            <div class="Box-body">
                <form id="login_form">
                    <dl class="form-group clearfix">
                        <label for="uni">Fakulta</label>
                        <select id="uni" class="form-select float-right">
                            <%unis%>
                        </select>
                    </dl>
                    <dl class="form-group">
                        <label for="uname">Uživatelské jméno</label>
                        <input id="uname" class="form-control input-block" type="text" placeholder="Uživatelské jméno" autofocus required>
                    </dl>
                    <dl class="form-group">
                        <label for="passw">Heslo</label>
                        <input id="passw" class="form-control input-block" type="password" placeholder="Heslo" required>
                    </dl>
                </form>
                <button class="btn" id="login_link">Přihlásit se</button>
                <button class="mt-1 btn float-right btn-sm" id="reset_link">Poslat heslo</button>
            </div>
        </div>
    </div>
</div>
`,
        Logged: {
            Header: `
<div style="z-index: 2; height: 40px" class="Header p-2 position-fixed width-full">
    <div class="Header-item Header-item--full">
        <a href="?X=Main" class="mt-n2 mb-n2 Header-link f3-light">Prog<b>test</b></a>
    </div>
    <div class="Header-item mr-0">
        <details class="dropdown details-reset details-overlay d-inline-block">
            <summary class="p-1 mt-n1 mb-n1 d-inline">
                <span class="mr-1"><%username%></span>
                <div class="dropdown-caret"></div>
            </summary>
            <ul class="dropdown-menu dropdown-menu-sw">
                <li><a class="dropdown-item" href="?X=FAQ">FAQ</a></li>
                <li><a class="dropdown-item" href="?X=Preset">Nastavení</a></li><li class="dropdown-divider" role="separator"></li>
                <li><a class="dropdown-item" href="?X=Logout">Odhlásit se</a></li>
            </ul>
        </details>
    </div>
</div>
<div class="position-fixed px-3 py-2 top-6 col-lg-3 col-4 d-sm-block d-none border-right border-gray overflow-y-auto" style="z-index: 1; height: calc(100% - 40px)">
    <div class="border-bottom my-2">
        <h4>Předměty</h4>
        <div id="sidebar-subjects">
            <span class="Label bg-blue m-2"><span>Načítání</span><span class="AnimatedEllipsis"></span></span>
        </div>
    </div>
    <div class="my-2">
        <h4>Kompilátory</h4>
    </div>
</div>
<div id="container" class="float-right clearfix top-6 col-lg-9 col-sm-8 col-12 bg-gray position-relative" style="min-height: calc(100% - 40px)"></div>
`,
            Sidebar: {
                Subject: `
<details class="my-3 user-select-none" <%open%>>
    <summary style="outline: none">
        <h4 class="d-inline lead f4 text-gray"><b><%name%></b> <%year%></h4>
        <a href="<%link%>" class="btn btn-sm btn-outline py-0 float-right">Přejít</a>
    </summary>
    <div class="f6 text-gray mb-1" style="margin-left: 19px;"><%fullname%></div>
    <%tasks%>
</details>
`,
                TaskGroup: `
<details class="ml-3 py-1 details-reset">
    <summary style="outline: none"><%icon%> <%name%> <span class="dropdown-caret"></span></summary>
    <%content%>
</details>
`,
                Results: `<div class="px-3 py-1"><a href="<%link%>"><%icon%><%name%></a></div>
`,
                Task: `<div class="pl-3 py-1 border-left border-<%color%>" style="margin-left: 5px"><a href="<%link%>"><%name%></a> <span class="Counter Counter--gray"><%score%></span></div>
`,
                Icons: {
                    results: `<svg width="16" height="16" class="octicon octicon-graph pr-1" viewBox="0 0 16 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M16 14v1H0V0h1v14h15zM5 13H3V8h2v5zm4 0H7V3h2v10zm4 0h-2V6h2v7z"></path></svg>`,
                    tasks: `<svg width="16" height="16" class="octicon octicon-device-desktop pr-1 text-green" viewBox="0 0 16 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M15 2H1c-.55 0-1 .45-1 1v9c0 .55.45 1 1 1h5.34c-.25.61-.86 1.39-2.34 2h8c-1.48-.61-2.09-1.39-2.34-2H15c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm0 9H1V3h14v8z"></path></svg>`,
                    tasks_extra: `<svg width="16" height="16" class="octicon octicon-dashboard pr-1 text-yellow" viewBox="0 0 16 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M9 5H8V4h1v1zm4 3h-1v1h1V8zM6 5H5v1h1V5zM5 8H4v1h1V8zm11-5.5l-.5-.5L9 7c-.06-.02-1 0-1 0-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-.92l6-5.58zm-1.59 4.09c.19.61.3 1.25.3 1.91 0 3.42-2.78 6.2-6.2 6.2-3.42 0-6.21-2.78-6.21-6.2 0-3.42 2.78-6.2 6.2-6.2 1.2 0 2.31.34 3.27.94l.94-.94A7.459 7.459 0 008.51 1C4.36 1 1 4.36 1 8.5 1 12.64 4.36 16 8.5 16c4.14 0 7.5-3.36 7.5-7.5 0-1.03-.2-2.02-.59-2.91l-1 1z"></path></svg>`,
                    exams: `<svg width="16" height="16" class="octicon octicon-mortar-board pr-1 text-red" viewBox="0 0 16 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M8.11 2.8a.34.34 0 00-.2 0L.27 5.18a.35.35 0 000 .67L2 6.4v1.77c-.3.17-.5.5-.5.86 0 .19.05.36.14.5-.08.14-.14.31-.14.5v2.58c0 .55 2 .55 2 0v-2.58c0-.19-.05-.36-.14-.5.08-.14.14-.31.14-.5 0-.38-.2-.69-.5-.86V6.72l4.89 1.53c.06.02.14.02.2 0l7.64-2.38a.35.35 0 000-.67L8.1 2.81l.01-.01zM4 8l3.83 1.19h-.02c.13.03.25.03.36 0L12 8v2.5c0 1-1.8 1.5-4 1.5s-4-.5-4-1.5V8zm3.02-2.5c0 .28.45.5 1 .5s1-.22 1-.5-.45-.5-1-.5-1 .22-1 .5z"></path></svg>`,
                    sem: `<svg width="16" height="16" class="octicon octicon-heart pr-1 text-purple" viewBox="0 0 12 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M9 2c-.97 0-1.69.42-2.2 1-.51.58-.78.92-.8 1-.02-.08-.28-.42-.8-1-.52-.58-1.17-1-2.2-1-1.632.086-2.954 1.333-3 3 0 .52.09 1.52.67 2.67C1.25 8.82 3.01 10.61 6 13c2.98-2.39 4.77-4.17 5.34-5.33C11.91 6.51 12 5.5 12 5c-.047-1.69-1.342-2.913-3-3z"></path></svg>`,
                    tests: `<svg width="16" height="16" class="octicon octicon-pencil pr-1 text-blue" viewBox="0 0 14 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M0 12v3h3l8-8-3-3-8 8zm3 2H1v-2h1v1h1v1zm10.3-9.3L12 6 9 3l1.3-1.3a.996.996 0 011.41 0l1.59 1.59c.39.39.39 1.02 0 1.41z"></path></svg>`,
                    extras: `<svg width="16" height="16" class="octicon octicon-star pr-1 text-orange" viewBox="0 0 14 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"></path></svg>`,
                    unknown: `<svg width="16" height="16" class="octicon octicon-question pr-1 text-gray" viewBox="0 0 14 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M6 10h2v2H6v-2zm4-3.5C10 8.64 8 9 8 9H6c0-.55.45-1 1-1h.5c.28 0 .5-.22.5-.5v-1c0-.28-.22-.5-.5-.5h-1c-.28 0-.5.22-.5.5V7H4c0-1.5 1.5-3 3-3s3 1 3 2.5zM7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 011.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7z"></path></svg>`
                },
                Colors: {
                    tasks: "green",
                    tasks_extra: "yellow",
                    exams: "red",
                    sem: "purple",
                    tests: "blue",
                    extras: "yellow",
                    unknown: "gray-dark",
                }
            }
        },
        Main: {
            Card: `
<div class="Box col-4 float-left m-3 hover-grow" style="height: 100px">
    <div class="border-right d-inline-block height-full" style="width: 100px">
        <img class="p-3" src="<%icon%>" style="width: 100px; height: 100px" />
    </div>
    <div class="p-2 d-inline-block v-align-top height-full" style="max-width: calc(100% - 105px)">
            <svg width="16" height="16" class="octicon octicon-repo mr-1" viewBox="0 0 12 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"></path></svg>
            <a href="<%link%>" class="f4 text-bold"><%code%></a>
            <p class="text-gray text-small"><%name%></p>
            <p class="text-gray text-small"><%year%></p>
    </div>
</div>
`,
            TimelineRow: `
<div class="TimelineItem clearfix ml-5">
    <div class="TimelineItem-badge bg-<%color%> text-white" style="">
        <svg width="16" height="16" class="octicon octicon-mortar-board" viewBox="0 0 16 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" d="M8.11 2.8a.34.34 0 00-.2 0L.27 5.18a.35.35 0 000 .67L2 6.4v1.77c-.3.17-.5.5-.5.86 0 .19.05.36.14.5-.08.14-.14.31-.14.5v2.58c0 .55 2 .55 2 0v-2.58c0-.19-.05-.36-.14-.5.08-.14.14-.31.14-.5 0-.38-.2-.69-.5-.86V6.72l4.89 1.53c.06.02.14.02.2 0l7.64-2.38a.35.35 0 000-.67L8.1 2.81l.01-.01zM4 8l3.83 1.19h-.02c.13.03.25.03.36 0L12 8v2.5c0 1-1.8 1.5-4 1.5s-4-.5-4-1.5V8zm3.02-2.5c0 .28.45.5 1 .5s1-.22 1-.5-.45-.5-1-.5-1 .22-1 .5z"></path></svg>
    </div>
    <div class="TimelineItem-body">
        <div class="">
            <h4 style="font-weight: 300;"><%sem%> <b><%year%></b></h4>
        </div>
        <%content%>
    </div>
</div>
`,
            TimelineEnd: `
<div class="TimelineItem ml-5 height-full position-absolute bottom-0" style="z-index: 0"></div>
`,
            Icons: {
                "BI-AAG": chrome.extension.getURL("./themes/newStyle/assets/icons/aag.svg"),
                "BI-AG1": chrome.extension.getURL("./themes/newStyle/assets/icons/ag1.svg"),
                "BI-OSY": chrome.extension.getURL("./themes/newStyle/assets/icons/osy.svg"),
                "BI-PA1": chrome.extension.getURL("./themes/newStyle/assets/icons/pa1.svg"),
                "BI-PA2": chrome.extension.getURL("./themes/newStyle/assets/icons/pa2.svg"),
                "BI-PJV": chrome.extension.getURL("./themes/newStyle/assets/icons/pjv.svg"),
                "BI-PS1": chrome.extension.getURL("./themes/newStyle/assets/icons/ps1.svg"),
                "unknown": chrome.extension.getURL("./themes/newStyle/assets/icons/unknown.svg"),
            },
            SemColor: [
                'purple',
                'red-5'
            ]
        }
    }

    Primer.Utils = {
        Clear: (target = document.body) => {
            target.innerHTML = ""
        },
        Render: (template, args = {}, target = document.body) => {
            const replArr = (str, find, replace) => {
                let regex = [], map = {}
                find.forEach((e, f) => {
                    regex.push(e.replace(/([-[\]{}()*+?.\\^$|#,])/g, '\\$1'))
                    map[e] = replace[f]
                })
                regex = regex.join('|')
                str = str.replace(new RegExp(regex, 'g'), matched => map[matched])
                return str
            }
            let sour = []
            let resp = []
            for (let p in args) {
                if (args[p] === null) continue
                sour.push("<%" + p + "%>")
                if (typeof args[p] == "string")
                    resp.push(args[p])
                else if (Array.isArray(args[p])) {
                    let d = ""
                    args[p].forEach(e => d += e.outerHTML)
                    resp.push(d)
                } else
                    resp.push(args[p].outerHTML)
            }
            if (target === true)
                return sour.length ? replArr(template, sour, resp) : template
            else
                target.innerHTML += sour.length ? replArr(template, sour, resp) : template
        },
        Attach: (elements, scope, event = "click") => {
            for (let e in elements)
                document.getElementById(e).addEventListener(event, elements[e].bind(scope))
        },
        Fetch: async (url) => {
            const root = await fetch(url)
            const body = await root.text()
            let parser = new DOMParser()
            return parser.parseFromString(body, 'text/html');
        },
        asyncForEach: async (array, callback) => {
            for (let index = 0; index < array.length; index++)
                await callback(array[index], index, array)
        },
        GetClearCurrentDOM() {
            const root = document.body.cloneNode(true)
            document.body.innerHTML = ""
            return root
        }
    }

    Primer.Err404 = class {

    }

    Primer.Login = class {
        constructor() {
            localStorage.removeItem('subjects')

            this.unis = this.getUniIDs()
            this.langs = [
                {
                    name: "Česky",
                    id: 1
                },
                {
                    name: "English",
                    id: 2
                }
            ]

            Primer.Utils.Clear()
            Primer.Utils.Render(Primer.Templates.Login, { unis: this.buildUniOptions() })
            Primer.Utils.Attach({
                'sso_link': this.login_shib,
                'login_link': this.login_validate,
                'reset_link': this.reset_validate
            }, this)
            Primer.Utils.Attach({
                'login_form': this.form_keyboard
            }, this, 'keydown')
        }

        buildUniOptions() {
            let ret = []
            this.unis.forEach(e => {
                let op = document.createElement("option")
                op.setAttribute("value", e.id)
                op.innerText = e.name
                ret.push(op)
            })
            return ret
        }

        getUniIDs() {
            let ids = []
            document.getElementsByName("UID_UNIVERSITY")[0].childNodes.forEach(e => {
                const val = e.getAttribute("value")
                if (val.includes("S")) return

                ids.push({
                    name: e.innerText,
                    id: parseInt(e.getAttribute("value"))
                })
            })
            return ids
        }

        submit(type) {
            let sel = document.getElementById("uni")
            let uni = sel.options[sel.selectedIndex].value
            let username = document.getElementById("uname").value
            let password = document.getElementById("passw").value
            this.login(username, password, 1, uni, type)
        }

        login_validate() {
            let form = document.getElementById("login_form")
            if (form.reportValidity())
                this.submit("login")
        }

        reset_validate() {
            let uname = document.getElementById("uname")
            if (uname.reportValidity())
                this.submit("reset")
        }

        login_shib() {
            window.location.href = "/shibboleth-fit.php"
        }

        form_keyboard(event) {
            if (event.keyCode == 13)
                this.submit("login")
        }

        login(username, password, lang, uni, type) {
            const ci = (name, value) => {
                let e = document.createElement("input")
                e.setAttribute("type", "hidden")
                e.name = name
                e.value = value
                return e
            }
            let form = document.createElement("form")

            if (type == "login") form.appendChild(ci("Login", "Login"))
            else if (type == "reset") form.appendChild(ci("LoginMail", "Poslat heslo"))
            else throw "Invalid type"

            form.appendChild(ci("lang", lang))
            form.appendChild(ci("UID_UNIVERSITY", uni))
            form.appendChild(ci("USERNAME", username))
            form.appendChild(ci("PASSWORD", password))
            form.method = "POST"
            form.action = "?X=Login&amp;Lg=1"

            document.body.appendChild(form)
            form.submit()
        }
    }

    Primer.Logged = class {
        constructor() {
            this.username = document.title.substr(0, document.title.indexOf(" "))

            this.currentDOM = Primer.Utils.GetClearCurrentDOM()
            Primer.Utils.Render(Primer.Templates.Logged.Header, {
                username: this.username.charAt(0).toUpperCase() + this.username.slice(1),
            })
            this.container = document.getElementById("container")

            this.buildNavTree().then(e => {
                const taskGroupNames = {
                    results: ["Výsledky", 0],
                    tasks: ["Domácí úlohy", 1],
                    tests: ["Znalostní testy", 2],
                    extras: ["Extra", 3],
                    tasks_extra: ["Soutěžní úlohy", 4],
                    sem: ["Semestrální práce", 5],
                    exams: ["Zkouška", 6],
                    unknown: ["Neznámé", 7]
                }

                let subjects = ""
                e.forEach(f => {
                    let taskGroups = []
                    for (let g in f.tasks) {
                        let tasks = ""
                        f.tasks[g].forEach(i => {
                            if (g == "results")
                                taskGroups.push({
                                    text: Primer.Utils.Render(Primer.Templates.Logged.Sidebar.Results, {
                                        name: i.name,
                                        link: i.link,
                                        icon: Primer.Templates.Logged.Sidebar.Icons.results
                                    }, true),
                                    id: taskGroupNames[g][1]
                                })
                            else
                                tasks += Primer.Utils.Render(Primer.Templates.Logged.Sidebar.Task, {
                                    name: i.name,
                                    score: isNaN(i.score) ? "0.00" : (i.score ?? 0).toFixed(2),
                                    link: i.link,
                                    color: Primer.Templates.Logged.Sidebar.Colors[g]
                                }, true)
                        })
                        if (g == "results") continue
                        taskGroups.push({
                            text: Primer.Utils.Render(Primer.Templates.Logged.Sidebar.TaskGroup, {
                                name: taskGroupNames[g][0],
                                content: tasks,
                                icon: Primer.Templates.Logged.Sidebar.Icons[g]
                            }, true),
                            id: taskGroupNames[g][1]
                        })
                    }
                    let taskGroupsText = ""
                    taskGroups.sort((a, b) => a.id - b.id)
                    taskGroups.forEach(e => taskGroupsText += e.text)

                    subjects += Primer.Utils.Render(Primer.Templates.Logged.Sidebar.Subject, {
                        name: f.code,
                        link: f.link,
                        tasks: taskGroupsText,
                        fullname: f.name,
                        year: f.year + " " + ["ZS", "LS"][f.sem],
                        open: (f.year == (e[0] ?? { year: f.year }).year ? "open" : "")
                    }, true)
                })
                document.getElementById("sidebar-subjects").innerHTML = subjects
            })
        }

        async buildNavTree() {
            const localSubjects = localStorage.getItem("subjects")
            if (localSubjects !== null)
                return JSON.parse(localSubjects)

            const types = {
                "Zahřívací": "tasks",
                "Domácí": "tasks",
                "Programovací": "tasks",
                "Soutěžní": "tasks_extra",
                "Semestrální": "sem",
                "Znalostní": "tests",
                "Zkouška": "exams",
                "Cvičení": "extras",
                "Práce": "extras",
                "Checkpoint": "extras",
                "Code": "extras",
                "Úlohy": "extras",
                "Výsledky": "results",
            }

            const body = await Primer.Utils.Fetch("/index.php?X=Main")
            let links = []
            await Primer.Utils.asyncForEach(body.querySelectorAll(".butLink"), async e => {
                if (
                    e.href.includes("X=Preset") ||
                    e.href.includes("X=CompilersDryRuns") ||
                    e.href.includes("X=FAQ")
                ) return

                const subject = await Primer.Utils.Fetch(e.href)
                let tasks = {}
                subject.querySelectorAll(".lBox").forEach(f => {
                    if (f.parentElement.childElementCount == 2) {
                        if (!("results" in tasks))
                            tasks["results"] = []
                        tasks["results"].push({
                            link: f.parentElement.children[1].querySelector("a").href,
                            name: f.innerText
                        })
                    } else {
                        const name = f.innerText

                        let type = types[name.replace(/ .*/, '')] || "unknown"
                        if (name.includes('Teorie') || name.includes('Test')) type = "exams"
                        else if (name.includes('. test')) type = "tests"
                        else if (name.includes('domácí cvičení')) type = "tasks"
                        else if (name.includes('Checkpoint')) type = "sem"
                        else if (name.includes('Úloha')) type = "tasks"

                        if (!(type in tasks))
                            tasks[type] = []

                        tasks[type].push({
                            link: (f.parentElement.children[3].querySelector("a") ?? { href: null }).href,
                            name: name,
                            score: parseFloat(f.parentElement.children[1].innerText),
                            deadline: f.parentElement.children[2].innerText
                        })
                    }
                })
                const fullname = e.parentElement.parentElement.parentElement.parentElement.firstElementChild.innerText
                links.push({
                    link: e.href,
                    code: e.innerText,
                    name: fullname.substr(0, fullname.lastIndexOf(" (")),
                    year: 2000 + parseInt(fullname.substr(fullname.lastIndexOf("(") + 1, 2)),
                    sem: fullname.includes("LS)") ? 1 : 0,
                    tasks
                })
            })
            links.sort((a, b) => b.year == a.year ? b.sem - a.sem : b.year - a.year)
            localStorage.setItem("subjects", JSON.stringify(links))
            return links
        }
    }

    Primer.Main = class extends Primer.Logged {
        constructor() {
            super()
            this.getSubjects().then(e => {
                for (let year in e) {
                    e[year].forEach((f, sem) => {
                        let cards = ""
                        f.forEach(val => cards += this.buildCard(val))
                        Primer.Utils.Render(Primer.Templates.Main.TimelineRow, {
                            sem: ["Zimní semestr", "Letní semestr"][sem],
                            year: year + "/" + (parseInt(year.toString().substr(-2)) + 1),
                            content: cards,
                            color: Primer.Templates.Main.SemColor[sem]
                        }, this.container)
                    })
                }
                Primer.Utils.Render(Primer.Templates.Main.TimelineEnd, {}, this.container)
            })
        }

        buildCard(subject) {
            const icon = Primer.Templates.Main.Icons[subject.code] ?? Primer.Templates.Main.Icons["unknown"]
            return Primer.Utils.Render(Primer.Templates.Main.Card, {
                name: subject.name,
                link: subject.link,
                code: subject.code,
                year: subject.year + "/" + (parseInt(subject.year.toString().substr(-2)) + 1) + " " + ["ZS", "LS"][subject.sem],
                icon
            }, true)
        }

        async getSubjects() {
            let links = []
            await Primer.Utils.asyncForEach(this.currentDOM.querySelectorAll(".butLink"), async e => {
                if (
                    e.href.includes("X=Preset") ||
                    e.href.includes("X=CompilersDryRuns") ||
                    e.href.includes("X=FAQ")
                ) return
                const fullname = e.parentElement.parentElement.parentElement.parentElement.firstElementChild.innerText
                const year = 2000 + parseInt(fullname.substr(fullname.lastIndexOf("(") + 1, 2))
                const sem = fullname.includes("LS)") ? 1 : 0
                if (!(year in links))
                    links[year] = []
                if (typeof links[year][sem] == "undefined")
                    links[year][sem] = []
                links[year][sem].push({
                    link: e.href,
                    code: e.innerText,
                    name: fullname.substr(0, fullname.lastIndexOf(" (")),
                    year,
                    sem
                })
            })
            return links
        }
    }

    Primer.Exam = class extends Primer.Logged {

    }

    Primer.Task = class extends Primer.Logged {

    }

    Primer.Results = class extends Primer.Logged {

    }

    Primer.Course = class extends Primer.Logged {

    }
}