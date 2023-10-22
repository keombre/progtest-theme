import { ExtensionSettings } from "../../settings";
import { Logged } from "./Logged";

type MenuItem = {
    order: number;
    icon: string;
    text?: string;
    footer?: string;
    push?: HTMLDivElement;
};

export class Main extends Logged {
    orderC = 1000;
    constructor(settings: ExtensionSettings) {
        super(settings);
    }

    async initialise() {
        await super.initialise();

        const subjects = document.createElement("div");
        subjects.classList.add("subjectSelect");

        const settings = document.createElement("div");
        settings.classList.add("subjectSelect");
        settings.classList.add("mainInfo");

        const orders: { [K in number]: string } = {};

        // get subject URLs from courses
        const subjectInfo = await fetch(
            "https://courses.fit.cvut.cz/data/courses-all.json",
            {
                method: "GET",
                mode: "cors",
                credentials: "omit",
            },
        ).then((response) => response.json());

        // collect all elements
        Main.getSubjects().forEach((e) => {
            const {
                order,
                icon,
                text = e[0],
                footer = "",
                push = settings,
            } = Main.parseSettings(e[2]) || {
                ...this.parseSubject(e[2], e[0]),
                push: e[1]?.includes("X=Course") ? subjects : settings,
            };
            orders[order] = footer;

            let link: string | null = null;
            if (push !== settings) {
                try {
                    link = subjectInfo["courses"][e[2]]["homepage"];
                } catch (_) {
                    console.info(
                        "Could not get link from Courses for subject ",
                        e[2],
                    );
                }

                // construct fallback URL
                if (link === null) {
                    link = "https://courses.fit.cvut.cz/" + e[2];
                }
            }

            push.innerHTML += `
<a href="${e[1]}" class="subject" style="order: ${order}" pttorder="${order}">
    <div class="subject-title">${e[2]}</div>
    <div class="icon ${icon}"></div>
    <div class="subject-body">${text}</div>
    ${
        link
            ? `<button class="updButton" onclick="window.open('${link}');return false;">Stránky předmětu</button>`
            : ""
    }
    ${footer ? `<div class="subject-footer">${footer}</div>` : ""}
</a>`;
        });

        const orderNumbers = Object.keys(orders).map(Number);
        for (const order of orderNumbers) {
            if (order >= 1000) {
                continue;
            }
            const header = document.createElement("span");
            header.classList.add("subjectHeader");
            header.style.order = (order - 1).toString();
            header.setAttribute("pttcolorder", order.toString());
            header.innerHTML =
                (order % 20 ? "Letní" : "Zimní") +
                " semestr <b>" +
                orders[order].substr(0, 7) +
                "</b>";
            header.addEventListener("click", Main.collapseSem.bind(this));
            subjects.appendChild(header);
        }
        const cent = document.querySelector("center");
        cent?.parentNode?.replaceChild(settings, cent);
        settings.parentNode?.insertBefore(subjects, settings);

        const min = Math.min(...orderNumbers);
        for (const order of orderNumbers) {
            const elm = document.querySelector<HTMLElement>(
                '[pttcolorder="' + order + '"]',
            );
            if (elm && order != min) {
                elm.click();
            }
        }
    }

    static collapseSem(event: MouseEvent) {
        let elm = event.target;
        if (!(elm instanceof HTMLElement)) {
            return;
        }
        if (elm.nodeName == "B") {
            elm = elm.parentNode;
            if (!(elm instanceof HTMLElement)) {
                return;
            }
        }
        elm?.classList.toggle("active");
        document
            .querySelectorAll(
                '[pttorder="' + elm.getAttribute("pttcolorder") + '"]',
            )
            .forEach((e) => {
                e.classList.toggle("subject-hidden");
            });
    }

    static parseSettings(title: string): MenuItem | undefined {
        return {
            Nastavení: { order: 10001, icon: "icon-setting", text: "" },
            Překladače: { order: 10000, icon: "icon-compile" },
            FAQ: {
                order: 10002,
                icon: "icon-faq",
                text: "Často kladené dotazy",
            },
        }[title];
    }

    parseSubject(title: string | undefined, text: string | undefined) {
        const bracketPos = text?.lastIndexOf("(");
        if (
            bracketPos === -1 ||
            bracketPos === undefined ||
            title === undefined ||
            text === undefined
        ) {
            return {
                order: this.orderC++,
                icon: "icon-unknown",
                text,
                footer: "",
            };
        } else {
            return {
                order:
                    (100 -
                        Number(text.substring(bracketPos + 1, bracketPos + 3)) *
                            2 -
                        (text.includes("LS)") ? 1 : 0)) *
                    10,
                icon: Main.getSubjectIcon(title),
                text: text.substring(0, bracketPos - 1),
                footer: "20" + text.slice(bracketPos + 1, -1),
            };
        }
    }

    static getSubjectIcon(title: string) {
        return (
            {
                "BI-AAG": "icon-aag",
                "BI-AG1": "icon-ag1",
                "BI-OSY": "icon-osy",
                "BI-PA1": "icon-pa1",
                "BI-PA2": "icon-pa2",
                "BI-PJV": "icon-pjv",
                "BI-PS1": "icon-ps1",
                "BI-PYT": "icon-pyt",
                "NI-PDP": "icon-pdp",
            }[title] || "icon-unknown"
        );
    }

    static getSubjects() {
        return [
            ...document.querySelectorAll<HTMLTableRowElement>(
                "body > center > table > tbody > tr",
            ),
        ].map(Main.getSubjectNames);
    }

    static getSubjectNames(e: HTMLElement) {
        const ch = e.children[1].children[0].children[0].children[0];
        if (!(ch instanceof HTMLAnchorElement)) {
            throw new Error("Subject button not found");
        }
        const firstChild = e.children[0];
        if (!(firstChild instanceof HTMLElement)) {
            throw new Error("Subject name not found");
        }
        return [firstChild.innerText, ch.href, ch.innerText];
    }
}
