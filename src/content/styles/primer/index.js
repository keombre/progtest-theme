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
`
    }

    Primer.Common = {
        Clear: () => {
            document.body.innerHTML = ""
        },
        Render: (template, args = {}, target = document.body) => {
            let sour = []
            let resp = []
            for (let p in args) {
                sour.push("<%" + p + "%>")
                if (typeof args[p] == "string")
                    resp.push(args[p])
                else if (Array.isArray(args[p]))
                args[p].forEach(e => resp.push(e.outerHTML))
                else
                    resp.push(args[p].outerHTML)
            }
            target.innerHTML += template.replace(sour, resp)
        },
        Attach: (elements, scope, event="click") => {
            for (let e in elements)
                document.getElementById(e).addEventListener(event, elements[e].bind(scope))
        }
    }

    Primer.Err404 = class {

    }

    Primer.Login = class {
        constructor() {
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