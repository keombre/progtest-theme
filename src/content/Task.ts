import { ExtensionSettings } from "../settings";
import { Logged } from "./Logged";

export class Task extends Logged {
    constructor(settings: ExtensionSettings) {
        super(settings);

        Task.fixLinks();

        if (settings.autohideResults) {
            Task.autoHideResults();
        }

        // mark help checkboxes for grid
        document
            .querySelectorAll('input[type="checkbox"][name]')
            .forEach((e) => {
                const parent = e.parentNode;
                if (!(parent instanceof HTMLElement)) return;
                parent.className += " gridHelp";
            });

        Task.markResultsTable();

        // nicer progress bar
        const progress = document.getElementById("refVal");
        if (progress) {
            setTimeout(() => progress.scrollIntoView({ block: "center" }), 10);
        }

        this.replaceCountdown();

        this.easterEgg();
    }

    static fixLinks() {
        document
            .querySelectorAll(
                '[href*="?X=Advice&"], [href*="?X=TaskD&"], [href*="?X=TaskS&"], [href*="?X=DryRunD&"], [href*="?X=DryRunO&"], [href*="?X=DryRunI&"], [href*="?X=CompileD&"]',
            )
            .forEach((e) => {
                e.setAttribute("target", "_blank");
            });
    }

    replaceCountdown() {
        if (!document.getElementById("countdown")) {
            return;
        }
        // block setTimeout calls
        const elt = document.createElement("script");
        elt.innerHTML =
            "window.setCountdown();window.setCountdown = function () {};";
        document.head.appendChild(elt);

        // rename element
        document
            .getElementById("countdown")
            .setAttribute("id", "ptt-countdown");

        // create hidden mocked element
        const hide = document.createElement("div");
        hide.setAttribute("id", "countdown");
        hide.style.display = "none";
        document.head.appendChild(hide);

        const elm = document.getElementById("ptt-countdown");
        if (elm.innerHTML == "&nbsp;") {
            return;
        }
        elm.style.minWidth = "200px";
        const deadline =
            parseInt(elm.innerHTML.slice(0, -4)) * 1000 + new Date().getTime();

        const loop = () => {
            const remaining = (deadline - new Date().getTime()) / 1000;
            let t = "Zbýv";
            if (remaining > 86400) {
                const days = Math.floor(remaining / 86400);
                t += (
                    [
                        "",
                        "á <b>{} den",
                        "ají <b>{} dny",
                        "ají <b>{} dny",
                        "ají <b>{} dny",
                    ][remaining / 86400] || "á <b>{} dní"
                ).replace("{}", days.toString());
                t += ", ";
            } else {
                t += "á <b>";
            }
            const hours = remaining % 86400;
            const minutes = hours % 3600;
            t +=
                Math.floor(hours / 3600) +
                "h, " +
                Math.floor(minutes / 60) +
                "m a " +
                Math.floor(minutes % 60) +
                "s</b>";
            elm.innerHTML = t;
        };

        loop();
        setInterval(loop, 900);
    }

    static markResultsTable() {
        document
            .querySelectorAll(
                "form > center > div:not(:nth-child(1)) .lrtbCell li > ul:only-child",
            )
            .forEach((e) => {
                const node = e.previousSibling;
                const text = node.textContent;
                let state;
                if (text.includes("Úspěch")) {
                    if (
                        e.firstElementChild.innerHTML.includes(
                            "Dosaženo: 100.00 %",
                        )
                    ) {
                        node.parentElement.className += " testRes testOK";
                        state = "ok";
                    } else {
                        node.parentElement.className += " testRes testAOK";
                        state = "warn";
                    }
                } else if (
                    text.includes("Neúspěch") ||
                    text.includes(
                        "Program provedl neplatnou operaci a byl ukončen",
                    ) ||
                    text.includes("Program překročil přidělenou maximální")
                ) {
                    node.parentElement.className += " testRes testFailed";
                    state = "danger";
                } else {
                    node.parentElement.className += " testRes testUnknown";
                    state = "light";
                }

                const testName = text.match(
                    /Test '(.*)': (Úspěch|Neúspěch|Nebylo testováno)/,
                );
                if (testName != null) {
                    node.textContent = testName[1];
                }

                const score = [
                    ...(e.childNodes[0] as HTMLElement).innerText.matchAll(
                        /Dosaženo: (\d{1,3}.\d{0,2}).*?požadováno: (\d{1,3}.\d{0,2})/g,
                    ),
                ];
                let scoreElem;
                if (score.length == 1 && score[0].length == 3) {
                    e.removeChild(e.childNodes[0]);
                    scoreElem = document.createElement("badge");
                    scoreElem.style.marginRight = "10px";
                    scoreElem.style.minWidth = "120px";
                    scoreElem.classList.add(state);
                    scoreElem.innerHTML =
                        '<label title="Dosaženo / požadováno"><b>' +
                        parseFloat(score[0][1]).toFixed(0) +
                        "</b>/" +
                        parseFloat(score[0][2]).toFixed(0) +
                        "</label>";
                    e.parentElement.insertBefore(
                        scoreElem,
                        e.parentElement.firstChild,
                    );
                } else {
                    scoreElem = document.createElement("badge");
                    scoreElem.style.marginRight = "10px";
                    scoreElem.style.minWidth = "120px";
                    scoreElem.classList.add(state);
                    scoreElem.innerHTML =
                        '<label title="Dosaženo / požadováno"><b>0</b></label>';
                    e.parentElement.insertBefore(
                        scoreElem,
                        e.parentElement.firstChild,
                    );
                }

                const badges = document.createElement("div");
                badges.classList.add("badges");
                e.parentElement.insertBefore(badges, e);

                const markForRemove = [];

                e.childNodes.forEach((f) => {
                    if (!(f instanceof HTMLElement)) return;
                    if (f.innerText.includes(", hodnocení")) {
                        if (!scoreElem) {
                            return;
                        }

                        let scoreMult: number;
                        if (f.innerText.includes("Bonus nebude udělen")) {
                            scoreMult = 0;
                        } else {
                            const multText =
                                f.innerText.match(/(\d{1,3}.\d{2}) %/);
                            if (multText == null) {
                                return;
                            }
                            scoreMult = parseFloat(multText[1]) / 100;
                        }
                        let testType = "";
                        if (f.innerText.includes("nepovinném testu")) {
                            testType = "💝 Nepovinný test";
                        } else if (f.innerText.includes("bonusovém testu")) {
                            testType = "🎁 Bonusový test";
                        } else if (f.innerText.includes("závazném testu")) {
                            testType = "📜 Závazný test";
                        }

                        if (testType != "") {
                            const testTypeElem = document.createElement("span");
                            testTypeElem.classList.add("testType");
                            testTypeElem.innerText = testType + ": ";
                            node.parentElement.insertBefore(testTypeElem, node);
                            markForRemove.push(f);
                        }

                        const multElem = document.createElement("span");
                        multElem.setAttribute("title", "Skóre");
                        multElem.innerText = scoreMult.toFixed(2);
                        scoreElem.appendChild(multElem);
                    } else if (
                        f.innerText.includes("Celková doba běhu:") ||
                        f.innerText.includes(
                            "Vyčerpání limitu na celý test, program násilně ukončen",
                        ) ||
                        f.innerText.includes("Program násilně ukončen po")
                    ) {
                        const time = [...f.innerText.matchAll(/(\d+.\d+)/g)];
                        if (time.length != 0) {
                            markForRemove.push(f);
                            const timeElem = document.createElement("badge");
                            timeElem.classList.add("info");
                            if (time.length == 2) {
                                const timeMe = parseFloat(time[0][1]);
                                const timeLimit = parseFloat(time[1][1]);
                                if (timeMe >= timeLimit) {
                                    timeElem.classList.replace(
                                        "info",
                                        "danger",
                                    );
                                }
                                timeElem.setAttribute(
                                    "title",
                                    "Celkový čas / limit",
                                );
                                timeElem.innerHTML =
                                    "<label>⏱️ <b>" +
                                    timeMe.toFixed(3) +
                                    "s</b> / " +
                                    timeLimit.toFixed(3) +
                                    "s</label>";
                            } else {
                                timeElem.setAttribute("title", "Celkový čas");
                                timeElem.innerHTML =
                                    "<label>⏱️ <b>" +
                                    parseFloat(time[0][1]).toFixed(3) +
                                    "s</b></label>";
                            }
                            badges.appendChild(timeElem);
                        }
                    } else if (f.innerText.includes("Využití paměti:")) {
                        const memory = [...f.innerText.matchAll(/(\d+)/g)];
                        if (memory.length != 0) {
                            markForRemove.push(f);
                            const memElem = document.createElement("badge");
                            memElem.classList.add("info");
                            if (memory.length == 2) {
                                const memMe = parseFloat(memory[0][1]) * 1024;
                                const memLimit =
                                    parseFloat(memory[1][1]) * 1024;
                                if (memMe >= memLimit) {
                                    memElem.classList.replace("info", "danger");
                                }
                                memElem.setAttribute(
                                    "title",
                                    "Celková paměť / limit",
                                );
                                memElem.innerHTML =
                                    "<label>💾 <b>" +
                                    Task.convertMemory(memMe) +
                                    "</b> / " +
                                    Task.convertMemory(memLimit) +
                                    "</label>";
                            } else {
                                memElem.setAttribute("title", "Celková paměť");
                                memElem.innerHTML =
                                    "<label>💾 <b>" +
                                    Task.convertMemory(
                                        parseFloat(memory[0][1]) * 1024,
                                    ) +
                                    "</b></label>";
                            }
                            badges.appendChild(memElem);
                        }
                    }
                });

                markForRemove.forEach((f) => e.removeChild(f));
            });

        document.querySelectorAll("li.testRes a").forEach((e) => {
            e.innerHTML = e.innerHTML.slice(1, -1);
        });
    }

    static convertMemory(size: number) {
        const i = Math.floor(Math.log(size) / Math.log(1024));
        return (
            Math.floor(size / Math.pow(1024, i)) * 1 +
            " " +
            ["B", "kB", "MB", "GB", "TB"][i]
        );
    }

    static autoHideResults() {
        // make ref solution clickable
        const checkbox = document.querySelector('input[name="SHOW_REF"]');
        if (checkbox) {
            const refHead = checkbox.parentNode.parentNode;
            if (!(refHead instanceof HTMLElement)) return;
            let refSib = refHead.nextElementSibling;

            while (refSib) {
                refSib.removeAttribute("style");
                refSib = refSib.nextElementSibling;
            }

            refHead.className += " dropDownHeader";
            refHead.addEventListener("click", toggleDropDown);
            refHead.click();
            checkbox.parentNode.removeChild(checkbox);
        }

        // hide the rest
        [
            "rtbSepCell",
            "rtbOkSepCell",
            "rtbHalfSepCell",
            "rtbXSepCell",
            "rtbFailSepCell",
            "rtbEditSepCell",
        ].forEach((n) => {
            document
                .querySelectorAll("td." + n + " > div.but1.w120")
                .forEach((e) => {
                    const resHead = e.parentNode.parentNode;
                    if (!(resHead instanceof HTMLElement)) return;
                    resHead.className += " dropDownHeader";
                    resHead.addEventListener("click", toggleDropDown);
                    resHead.click();
                });
        });
    }

    easterEgg() {
        // play Portal 2 turrent sound on successful task submission (you are welcome ;) )
        const storage = window.localStorage;
        if (!storage) {
            return;
        }

        const params = window.location.search.split("&");
        const task = btoa(
            (params[1] || "") + (params[2] || "") + (params[3] || ""),
        );

        if (document.getElementById("refProgress")) {
            storage.setItem("upload", "true");
            storage.setItem("task", task);
            return;
        } else if (
            storage.getItem("upload") == "true" &&
            storage.getItem("task") == task
        ) {
            // upload ended and ptt has never seen this page before (yay!)
            if (
                this.settings.playSounds &&
                document.querySelector(
                    "form > center > div.topLayout:nth-child(5) > div.outBox > table > tbody > tr.dropDownHeader > td.ltbOkSepCell",
                )
            ) {
                try {
                    new Audio(
                        chrome.runtime.getURL("./themes/assets/turret.ogg"),
                    ).play();
                } catch {
                    console.error("Failed to play sound");
                }
            }
        }
        storage.setItem("upload", "false");
        storage.setItem("task", task);
    }
}

export const toggleDropDown = (e: MouseEvent) => {
    if (e.button == 2) {
        return;
    }
    const element = e.target;
    if (!(element instanceof HTMLElement)) {
        return;
    }
    if (element?.nodeName == "A" || element?.nodeName == "BUTTON") {
        return;
    }
    let id = 0;
    for (const node of element.parentNode.children) {
        if (id++ == 0) {
            continue;
        }
        if (node.className.indexOf("dropDownHide") == -1) {
            node.className += " dropDownHide";
        } else {
            node.className = node.className.replace(" dropDownHide", "");
        }
    }
};
