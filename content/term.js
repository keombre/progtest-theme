class term {

    constructor() {

        this.caretPos = 0
        this.cmd = ""
        this.commands = []
        this.path = ""

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

        this.iw.appendChild(this.p)
        this.iw.appendChild(this.c)
        this.iw.appendChild(this.i)

        this.o = document.createElement('DIV')
        this.o.classList = "output"
        
        document.body.appendChild(this.f)
        document.body.appendChild(this.o)
        document.body.appendChild(this.iw)

        this.drawCaret()
    }

    key(event) {
        const key = event.key
        switch (key) {
            case "AltGraph":
            case "Control":
            case "Alt":
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
                break
            case "ArrowDown":
                break
            default:
                if (key.length > 1)
                    break
                this.addInput(key)
        }
    }

    moveCaret(direction) {
        if (this.caretPos + direction <= this.cmd.length && this.caretPos + direction >= 0) {
            this.caretPos += direction
            this.drawCaret()
        }
    }

    clearInput() {
        this.cmd = ""
        this.i.innerHTML = this.cmd
        this.caretPos = 0
        this.drawCaret()
    }

    getPrompt() {
        return "$" + this.path + ">"
    }

    drawCaret() {
        this.c.style.left = this.caretPos + 1 + "ch"
    }

    addInput(char) {
        this.cmd = this.cmd.slice(0, this.caretPos) + char + this.cmd.slice(this.caretPos)
        this.i.innerHTML = this.cmd
        this.moveCaret(1)
    }

    removeInput() {
        this.cmd = this.cmd.slice(0, this.caretPos-1) + this.cmd.slice(this.caretPos)
        this.i.innerHTML = this.cmd
        this.moveCaret(-1)
    }

    delInput() {
        this.cmd = this.cmd.slice(0, this.caretPos) + this.cmd.slice(this.caretPos+1)
        this.i.innerHTML = this.cmd
    }

    hideInput() {
        this.i.style.visibility = "hidden"
    }

    showInput() {
        this.i.style.visibility = "initial"
        this.i.scrollIntoView()
    }

    print(text) {
        text = this.getPrompt() + " " + this.cmd + "<br />" + text.replace(/ /g, '&nbsp;').replace(/\n/g, '<br />') + "<br />"
        this.o.innerHTML += text
    }

    getHelp() {
        return `help   - this text
ls     - list current directory
cd     - change directory
upload - upload solution
download [id] - download solution, empty id for sample data`
    }

    run() {
        this.cmd = this.cmd.trim()
        
        this.commands.push(this.cmd)
        // parse command
        let spacePos = this.cmd.indexOf(' ')
        let cmd = (spacePos == -1 ? this.cmd : this.cmd.slice(0, spacePos)).toLowerCase()
        console.log("exec", cmd)

        this.hideInput()

        switch (cmd) {
            case "help":
                this.print(this.getHelp())
                break
            default:
                this.print(cmd + ": Unknown command. See help")
        }

        this.clearInput()
        this.showInput()
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