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
<div style="z-index: 2" class="Header p-2 position-fixed width-full">
    <div class="Header-item Header-item--full">
        <a href="?X=Main" class="Header-link f4">
            <span>ProgTest</span>
        </a>
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
<div class="position-fixed px-3 py-2 top-6 height-full col-2 border-right border-gray overflow-y-auto" style="z-index: 1">
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
<div class="float-right clearfix top-6 height-full col-10 bg-gray"></div>
`,
            Sidebar: {
                Subject: `
<details class="my-3 user-select-none" <%open%>>
    <summary style="outline: none">
        <h4 class="d-inline f4 text-gray"><%name%></h4>
        <a href="<%link%>" class="btn btn-sm btn-outline py-0 float-right">Přejít</a>
    </summary>
    <div class="f6 text-gray mb-1" style="margin-left: 19px;"><%fullname%></div>
    <%tasks%>
</details>
`,
                Task: `<div class="px-3 py-1"><a href="<%link%>"><%name%></a></div>
`
            }
        }
    }

    Primer.Common = {
        Clear: (target = document.body) => {
            target.innerHTML = ""
        },
        Render: (template, args = {}, target = document.body) => {
            const replArr = (str, find, replace) => {
                let regex = [], map = {}
                find.forEach((e, f) => {
                    regex.push(e.replace(/([-[\]{}()*+?.\\^$|#,])/g,'\\$1'))
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
                else if (Array.isArray(args[p]))
                args[p].forEach(e => resp.push(e.outerHTML))
                else
                    resp.push(args[p].outerHTML)
            }
            if (target === true)
                return replArr(template, sour, resp)
            else
                target.innerHTML += replArr(template, sour, resp)
        },
        Attach: (elements, scope, event="click") => {
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

            Primer.Common.Clear()
            Primer.Common.Render(Primer.Templates.Login, {unis: this.buildUniOptions()})
            Primer.Common.Attach({
                'sso_link': this.login_shib,
                'login_link': this.login_validate,
                'reset_link': this.reset_validate
            }, this)
            Primer.Common.Attach({
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
                this.validate("login")
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
            
            Primer.Common.Clear()
            Primer.Common.Render(Primer.Templates.Logged.Header, {
                username: this.username.charAt(0).toUpperCase() + this.username.slice(1),
            })

            this.buildNavTree().then(e => {
                let subjects = ""
                e.forEach(f => {
                    let tasks = ""
                    f.children.forEach(g => {
                        tasks += Primer.Common.Render(Primer.Templates.Logged.Sidebar.Task, {
                            name: g.name,
                            link: g.link
                        }, true)
                    })
                    const year = new Date().getFullYear().toString().substr(-2)
                    subjects += Primer.Common.Render(Primer.Templates.Logged.Sidebar.Subject, {
                        name: f.code,
                        link: f.link,
                        tasks: tasks,
                        fullname: f.name,
                        open: (f.year.includes(year) ? "open" : "") // todo: make this better
                    }, true)
                })
                document.getElementById("sidebar-subjects").innerHTML = subjects
            })
        }

        async buildNavTree() {
            const localSubjects = localStorage.getItem("subjects")
            if (localSubjects !== null)
                return JSON.parse(localSubjects)

            const body = await Primer.Common.Fetch("/index.php?X=Main")
            let links = []
            await Primer.Common.asyncForEach(body.querySelectorAll(".butLink"), async e => {
                if (
                    e.href.includes("X=Preset") ||
                    e.href.includes("X=CompilersDryRuns") ||
                    e.href.includes("X=FAQ")
                ) return

                const subject = await Primer.Common.Fetch(e.href)
                let sublinks = []
                subject.querySelectorAll(".lBox").forEach(f => {
                    if (f.parentElement.childElementCount == 2)
                        sublinks.push({
                            type: "results",
                            link: f.parentElement.children[1].querySelector("a").href,
                            name: f.innerText
                        })
                    else
                        sublinks.push({
                            type: "task",
                            link: (f.parentElement.children[3].querySelector("a")??{href:null}).href,
                            name: f.innerText,
                            score: parseFloat(f.parentElement.children[1].innerText),
                            deadline: f.parentElement.children[2].innerText
                        })
                })
                const fullname = e.parentElement.parentElement.parentElement.parentElement.firstElementChild.innerText
                links.push({
                    link: e.href,
                    code: e.innerText,
                    name: fullname.substr(0, fullname.lastIndexOf(" (")),
                    year: fullname.slice(fullname.lastIndexOf("(")+1, -1),
                    children: sublinks
                })
            })
            localStorage.setItem("subjects", JSON.stringify(links))
            return links
        }
    }

    Primer.Exam = class extends Primer.Logged {

    }

    Primer.Main = class extends Primer.Logged {

    }

    Primer.Task = class extends Primer.Logged {

    }

    Primer.Results = class extends Primer.Logged {

    }

    Primer.Course = class extends Primer.Logged {

    }
}