import { ExtensionSettings } from "../../settings";
import { Logged } from "./Logged";

export class Exam extends Logged {
    constructor(settings: ExtensionSettings) {
        super(settings);
    }

    async initialise(): Promise<void> {
        await super.initialise();

        // normalize html
        document
            .querySelectorAll(
                'form[name="form1"] table tr:nth-child(n+4) td.rCell, form[name="form1"] table tr:nth-child(n+4) td.rbCell',
            )
            .forEach((e) => {
                const radio = e.querySelector('input[type="radio"]');
                if (!radio) {
                    return;
                }
                const dot = e.previousElementSibling?.querySelector(".redBox");
                if (dot) {
                    dot.parentElement?.removeChild(dot);
                    radio.classList.add("radio-red");
                }
                e.classList.add("radio");
                const label = document.createElement("span");
                label.classList.add("radio-label");
                const remove: HTMLElement[] = [];
                e.childNodes.forEach((f) => {
                    if (f.nodeName == "#text") {
                        label.innerHTML += f.textContent;
                        e.replaceChild(label, f);
                    } else if (f instanceof HTMLElement) {
                        label.innerHTML += f.outerHTML;
                        remove.push(f);
                    }
                });
                remove.forEach((g) => g.remove());
            });
    }
}
