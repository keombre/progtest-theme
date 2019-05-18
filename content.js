window.onload = () => {

    // add selector to duplicate parrent elements
    document.querySelectorAll("span.dupC").forEach(e => {e.parentNode.className += " dupCpar"});

    // mark number of columns
    let c = [];
    let i = 0;
    document.querySelector("tr.resHdr:nth-child(1)").childNodes.forEach(e=>{c.push(i+=parseInt(e.getAttribute("colspan")||1))});

}