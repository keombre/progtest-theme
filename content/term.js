class term {

    constructor() {

        this.cmd = ""
        this.commands = []
        this.path = "/"
        this.pathTree = []
        this.tSize = {x: 0, y: 0}
        this.historyPos = -1
        this.logged = this.isLogged()

        this.username = document.title.slice(0, document.title.indexOf(' '))

        this.createDOM()

        this.setTermSize()
        window.addEventListener('resize', this.setTermSize.bind(this))

        if (!this.logged)
            this.print("Welcome to ProgTest\nPlease select login method (use help)", {prompt: false, command: false})

        this.caretPos = {x: this.getPrompt().length, y: 0, a: 0}

        this.drawCaret()
        this.blinker = setInterval(this.caretBlink.bind(this), 500)
    }

    createDOM() {
        document.body.innerHTML = ""

        this.f = document.createElement('IFRAME')
        this.f.src = "."
        this.f.id = "i"

        this.i = document.createElement('SPAN')
        this.i.className = "input"
        document.body.addEventListener('keydown', this.key.bind(this))

        this.p = document.createElement('DIV')
        this.p.className = "prompt"
        this.p.innerHTML = this.getPrompt()

        this.c = document.createElement('DIV')
        this.c.className = "caret"
        
        this.iw = document.createElement('DIV')
        this.iw.className = "inputWrapper"

        this.iw.appendChild(this.c)
        this.iw.appendChild(this.p)
        this.iw.appendChild(this.i)

        this.o = document.createElement('DIV')
        this.o.classList = "output"
        
        document.body.appendChild(this.f)
        document.body.appendChild(this.o)
        document.body.appendChild(this.iw)

        document.body.style.visibility = "initial"
    }

    isLogged() {
        return document.title.includes('|')
    }

    setTermSize() {
        const charS = this.c.getBoundingClientRect().width
        this.tSize.x = Math.floor(document.documentElement.clientWidth / charS) - 2
        this.tSize.y = Math.floor(document.documentElement.clientHeight / charS) - 2
    }

    key(event) {
        if (event.altKey)
            return
        
        const key = event.key
        switch (key) {
            case "Control":
            case "Shift":
            case "Dead":
                break
            case "Enter":
                this.run()
                break
            case "Tab":
                event.preventDefault()
                break
            case "Backspace":
                this.removeInput()
                break
            case "Delete":
                this.delInput()
                break
            case "ArrowLeft":
                this.moveCaret(-1)
                break
            case "ArrowRight":
                this.moveCaret(1)
                break
            case "ArrowUp":
                this.prevInput()
                break
            case "ArrowDown":
                this.nextInput()
                break
            default:
                if (key.length > 1)
                    break
                if (event.ctrlKey) {
                    if (key == 'c') {
                        this.clearInput()
                        event.preventDefault()
                    } else if (key == 'l') {
                        this.wipe()
                        event.preventDefault()
                    }
                } else
                    this.addInput(key)
                
        }
    }

    wipe() {
        this.o.innerHTML = ""
        this.path = "/"
        this.clearInput()
    }

    caretBlink() {
        if (this.c.style.visibility == "hidden")
            this.c.style.visibility = "initial"
        else
            this.c.style.visibility = "hidden"
    }

    moveCaret(direction) {
        if (this.caretPos.a + direction <= this.cmd.length && this.caretPos.a + direction >= 0) {
            this.caretPos.a += direction

            if (this.caretPos.x + direction > this.tSize.x) {
                this.caretPos.y += 1
                this.caretPos.x = 1
            } else if (this.caretPos.x + direction <= 0) {
                this.caretPos.y -= 1
                this.caretPos.x = this.tSize.x
            } else {
                this.caretPos.x += direction
            }

            this.drawCaret()
        }
    }

    clearInput() {
        this.cmd = ""
        this.i.innerHTML = this.cmd
        this.caretPos.a = 0
        this.caretPos.x = this.getPrompt().length
        this.caretPos.y = 0
        this.drawCaret()
    }

    getPrompt() {
        if (this.logged) {
            return this.username + "@progtest:" + this.path + " > "
        } else {
            return "> "
        }
    }

    drawCaret() {
        this.c.style.left = this.caretPos.x + "ch"
        this.c.style.top = (this.caretPos.y * 2) + "ch"
        this.c.scrollIntoView()
    }

    addInput(char) {
        this.cmd = this.cmd.slice(0, this.caretPos.a) + char + this.cmd.slice(this.caretPos.a)
        this.i.innerHTML = this.cmd
        this.moveCaret(1)
    }

    removeInput() {
        this.cmd = this.cmd.substr(0, this.caretPos.a-1) + this.cmd.substr(this.caretPos.a)
        this.i.innerHTML = this.cmd
        this.moveCaret(-1)
    }

    delInput() {
        this.cmd = this.cmd.slice(0, this.caretPos.a) + this.cmd.slice(this.caretPos.a+1)
        this.i.innerHTML = this.cmd
    }

    prevInput() {
        const cLen = this.commands.length
        
        if (this.historyPos < cLen - 1)
            this.historyPos++

        this.clearInput()

        this.cmd = this.commands[this.commands.length - 1 - this.historyPos]
        this.i.innerHTML = this.cmd
    }

    nextInput() {
        if (this.historyPos > 0)
            this.historyPos--
        
        this.clearInput()
        
        this.cmd = this.commands[this.commands.length - 1 - this.historyPos]
        this.i.innerHTML = this.cmd
    }

    print(text, config = {newline: true, command: true, prompt: true}) {
        const {newline = true, command = true, prompt = true} = config
        text = (prompt ? this.p.innerHTML.replace(/ /g, '&nbsp;') : "") + 
               (command ? this.commands[this.commands.length-1] : "") +
               (command || prompt ? "<br />" : "") +
               (typeof text == "string" ? text.replace(/ /g, '&nbsp;').replace(/\n/g, '<br />') + 
               (newline ? "<br />" : "") : "")
        
        this.o.innerHTML += text
    }

    getHelp() {
        return `help   - this text
ls     - list current directory
cd     - change directory
upload - upload solution
download [id] - download solution, empty id for sample data`
    }

    getLoginHelp() {
        return `help     - this text
Shib     - login using Shibboleth SSO
Username - login with username and password
clear    - clear terminal
exit     - leave`
    }

    run() {
        const tCmd = this.cmd.replace(/\s+/g, ' ').trim()

        if (tCmd != "")
            this.commands.push(this.cmd)

        // parse command
        const spacePos = tCmd.indexOf(' ')
        const cmd = (spacePos == -1 ? tCmd : tCmd.slice(0, spacePos)).toLowerCase()
        const args = spacePos == -1 ? [] : tCmd.slice(spacePos+1).split(' ')
        console.log("exec", cmd)
        console.log("args", args)

        if (this.logged)
        switch (cmd) {
            case "quit":
            case "exit":
                window.close()
                break
            case "clear":
            case "cls":
                this.wipe()
                break;
            case "help":
                this.print(this.getHelp())
                break
            case "logout":
                this.logout()
                break
            case "":
                this.print("", {command: false, newline: false})
                break
            case "ls":
                this.print(this.ls())
                break
            case "cd":
                this.print(this.cd(args[0]))
                break
            default:
                this.print(cmd + ": Unknown command. See help")
        }
        else
        switch (cmd) {
            case "quit":
            case "exit":
                window.close()
                break
            case "clear":
            case "cls":
                this.wipe()
                break;
            case "help":
                this.print(this.getLoginHelp())
                break
            case "":
                this.print("", {command: false, newline: false})
                break
            case "s":
            case "shib":
                this.loginShib()
                break
            case "u":
            case "username":
                this.loginUname()
                break
            default:
                this.print(cmd + ": Unknown command. See help")
        }
        
        this.clearInput()
        this.p.innerHTML = this.getPrompt()
        this.historyPos = -1
        this.c.scrollIntoView()
    }


    // build-in functions
    logout() {
        this.print("Logging out..")
        window.location.href = "/index.php?X=Logout"
    }

    loginShib() {
        this.print("Redirecting to Shibboleth SSO..")
        window.location.href = "/shibboleth-fit.php"
    }

    loginUname() {
        this.print("Sorry, not implemented yet, use shib")
    }

    getPaths() {
        let ret = {}
        this.f.contentDocument.querySelectorAll('a.butLink').forEach(e => {
            if (e.innerHTML == "Zobrazit") {
                ret[e.parentNode.parentNode.parentNode.parentNode.firstElementChild.firstElementChild.innerText] = e.href
            } else
                ret[e.innerHTML] = e.href
        })
        return ret
    }

    ls() {
        return Object.keys(this.getPaths()).join("\n")
    }

    cd(path) {
        if (path == '.')
            return
        else if (path == '..') {
            if (!this.pathTree.length)
                return
            this.path = this.path.substr(0, this.path.slice(0, -1).lastIndexOf('/') + 1)
            this.f.contentWindow.location.replace(this.pathTree.pop())
            return
        }

        const paths = this.getPaths()
        if (!paths.hasOwnProperty(path))
            return "cd: no such file or directory: " + path
        
        this.pathTree.push(this.f.contentWindow.location.href)
        this.f.contentWindow.location.replace(paths[path])
        this.path += path + "/"
    }
}

// start
let t

const termPreload = () => {
    if (theme == 'term' && !t)
        t = new term()
}

if (!settingsLoaded)
    window.addEventListener('ppt-loaded', termPreload)
else
    termPreload()