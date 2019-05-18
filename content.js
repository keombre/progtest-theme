window.onload = () => {
    chrome.runtime.sendMessage({type: "theme"}, function(response) {
        if (response.theme == 'orig')
            return
        let styles = ''

        // add selector to duplicate parrent elements
        document.querySelectorAll("span.dupC").forEach(e => {e.parentNode.className += " dupCpar"})

        // mark number of columns
        let c = [], i = 0
        let qsel = document.querySelector("tr.resHdr:nth-child(1)")
        if (typeof qsel != undefined && qsel != null) {
            qsel.childNodes.forEach(e=>{c.push(i+=parseInt(e.getAttribute("colspan")||1))})
            c.pop()
            c.shift()
            c.forEach(e => {
                styles += 'body > center > table tr.resRow > td:nth-child('+ (e + 1) +') {border-left: thin solid rgba(0, 0, 0, 0.25);font-weight: 500;}'
            })

            styles += 'body > center > table tr.resRow > td:last-child {font-weight: 500;}'
        }

        let styleSheet = document.createElement("style")
        styleSheet.type = "text/css"
        styleSheet.innerText = styles
        document.head.appendChild(styleSheet)
    })
}
