import { ExtensionSettings } from "../../settings";
import { Logged } from "./Logged";

export class Results extends Logged {
    constructor(settings: ExtensionSettings) {
        super(settings);
    }

    async initialise() {
        await super.initialise();

        let styles = "";

        // add selector to duplicate parent elements
        document.querySelectorAll("span.dupC").forEach((e) => {
            const parent = e.parentNode;
            if (parent instanceof HTMLElement) {
                parent.className += " dupCpar";
            }
        });

        // mark number of columns
        const c = [];
        let i = 0;
        const qsel = document.querySelector("tr.resHdr:nth-child(1)");
        if (qsel != null) {
            qsel.childNodes.forEach((e) => {
                if (!(e instanceof HTMLElement)) return;
                const colspan = e.getAttribute("colspan");
                i += colspan ? parseInt(colspan) : 1;
                c.push(i);
            });
            c.pop();
            c.shift();
            c.forEach((e) => {
                styles +=
                    "tr.resRow > td:nth-child(" +
                    (e + 1) +
                    ") {border-left: thin solid rgba(0, 0, 0, 0.125);font-weight: 500;}";
            });

            styles += "tr.resRow > td:last-child {font-weight: 500;}";
        }

        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }
}
