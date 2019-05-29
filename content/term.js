class term {
    constructor() {
        document.body.innerHTML = ""

        this.f = document.createElement('IFRAME')
        this.f.src = "."
        this.f.id = "i"

        this.i = document.createElement('SPAN')
        this.i.className = "input"
        document.body.addEventListener('click', this.focus)
        document.body.addEventListener('keypress', this.key)

        this.p = document.createElement('DIV')
        this.p.className = "prompt"
        this.p.innerHTML = "$>"
        
        this.iw = document.createElement('DIV')
        this.iw.className = "inputWrapper"

        this.iw.appendChild(this.p)
        this.iw.appendChild(this.i)

        this.o = document.createElement('DIV')
        this.o.classList = "output"
        
        document.body.appendChild(this.f)
        document.body.appendChild(this.o)
        document.body.appendChild(this.iw)

        this.focus()
    }

    focus() {
        if (window.getSelection().type == "None" || window.getSelection().type == "Caret")
            this.i.focus()
    }

    key(event) {
        const key = event.key
        // check key number and print/tab/enter
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