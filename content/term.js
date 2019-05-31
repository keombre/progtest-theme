class term {

    constructor() {

        this.cmd = ""
        this.commands = []
        this.path = "/"
        this.tSize = {x: 0, y: 0}
        this.historyPos = -1

        this.username = document.title.slice(0, document.title.indexOf(' '))

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

        this.setTermSize()
        window.addEventListener('resize', this.setTermSize.bind(this))

        this.caretPos = {x: this.getPrompt().length, y: 0, a: 0}

        this.drawCaret()
        this.blinker = setInterval(this.caretBlink.bind(this), 500)
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
                    event.preventDefault()
                    if (key == 'c')
                        this.clearInput()
                    else if (key == 'l')
                        this.wipe()
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
        return this.username + "@progtest:" + this.path + " > "
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

    print(text, addNewLine = true, addCommand = true) {
        text = this.getPrompt().replace(/ /g, '&nbsp;') + 
               (addCommand ? this.commands[this.commands.length-1] : "") +
               "<br />" +
               text.replace(/ /g, '&nbsp;').replace(/\n/g, '<br />') + 
               (addNewLine ? "<br />" : "")
        
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
        const tCmd = this.cmd.replace(/\s+/g, ' ').trim()

        if (tCmd != "")
            this.commands.push(this.cmd)

        // parse command
        const spacePos = tCmd.indexOf(' ')
        const cmd = (spacePos == -1 ? tCmd : tCmd.slice(0, spacePos)).toLowerCase()
        const args = spacePos == -1 ? [] : tCmd.slice(spacePos+1).split(' ')
        console.log("exec", cmd)
        console.log("args", args)

        this.clearInput()

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
            case "":
                this.print("", false, false)
                break
            default:
                this.print(cmd + ": Unknown command. See help")
        }

        this.historyPos = -1
        this.c.scrollIntoView()
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