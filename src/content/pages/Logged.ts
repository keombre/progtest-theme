import { ExtensionSettings } from "../../settings";
import { Page } from "./Page";

export class Logged implements Page {
    topButton = `
<svg id="upTop" xmlns="http://www.w3.org/2000/svg" viewBox="-1 -0.5 26 26">
    <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"></path>
</svg>
`;

    tButton: HTMLElement;
    header: HTMLElement;
    oldScroll: number | undefined;

    constructor(protected settings: ExtensionSettings) {
        this.tButton = document.getElementById("upTop") as HTMLElement;
        const header = document.querySelector<HTMLElement>("body > table");
        if (!header) {
            throw new Error("Header not found");
        }
        this.header = header;
    }

    async initialise() {
        this.header.className += " navbar";
        // add scroll to top button
        document.body.innerHTML += this.topButton;
        if (this.tButton) {
            this.tButton.addEventListener("click", () => {
                this.tButton.removeAttribute("style");
                document.body.scrollIntoView({
                    block: "start",
                    behavior: "smooth",
                });
            });
        }

        if (typeof this.header != "undefined" && this.header != null) {
            window.onscroll = this.scrollCheck.bind(this);
            window.addEventListener("load", this.scrollCheck.bind(this));
        }

        window.addEventListener("beforeunload", this.scrollHigh.bind(this));

        this.displayBell();
        this.highlightCode();
        this.notifications();
    }

    displayBell() {
        if (!window.localStorage || !this.settings.showNotifications) {
            return;
        }
        const bell = document.createElement("div");
        bell.classList.add("notify", "off");
        bell.addEventListener("click", Logged.notifyToggle.bind(this));
        const logout = document.querySelector('.navLink[href*="Logout"]');
        logout?.parentNode?.insertBefore(bell, logout);

        document.addEventListener("click", (e) => {
            if (e.target != bell) {
                document
                    .getElementsByClassName("notifications")[0]
                    .classList.add("notifications-hide");
            }
        });

        const notify = document.createElement("div");
        notify.classList.add("notifications", "notifications-hide");
        notify.innerHTML = "<b>Žádná upozornění</b>";
        document.body.insertBefore(notify, document.body.firstElementChild);
    }

    scrollCheck() {
        if (
            document.body.scrollTop > 40 ||
            document.documentElement.scrollTop > 40
        ) {
            this.scrollLow();
        } else {
            this.scrollHigh();
        }

        this.oldScroll = window.scrollY;
    }

    scrollHigh() {
        if (this.header && this.header.getAttribute("style")) {
            this.header.removeAttribute("style");
        }
        if (this.tButton && this.tButton.getAttribute("style")) {
            this.tButton.removeAttribute("style");
        }
    }

    scrollLow() {
        if (this.header && !this.header.getAttribute("style")) {
            this.header.style.padding = "0px 16px";
        }
        if (
            this.tButton &&
            !this.tButton.getAttribute("style") &&
            this.oldScroll &&
            (this.oldScroll <= window.scrollY || !this.oldScroll)
        ) {
            this.tButton.style.transform = "scale(1)";
        }
    }

    highlightCode() {
        document
            .querySelectorAll<HTMLElement>("pre, code, tt")
            .forEach((block) => {
                if (this.settings.syntaxHighlighting) {
                    window.hljs.highlightBlock(block);
                } else {
                    block.classList.add("hljs");
                }
            });
    }

    async notifications() {
        if (!window.localStorage || !this.settings.showNotifications) {
            return;
        }

        const tasks = await Logged.taskSpider();

        if (!localStorage.tasks) {
            localStorage.tasks = JSON.stringify(
                tasks?.map((e) => {
                    e["seen"] = true;
                    return e;
                }),
            );
        } else {
            const localTasks = JSON.parse(localStorage.tasks);
            const notify = tasks?.filter((t) => {
                return !localTasks.some((e) => e.link === t.link);
            });
            this.displayNotifications(
                notify?.concat(localTasks.filter((e) => e.seen == false)),
            );
            localStorage.tasks = JSON.stringify(localTasks.concat(notify));
        }
    }

    displayNotifications(elems) {
        if (!elems.length) {
            return;
        }
        document
            .getElementsByClassName("notify")[0]
            .classList.replace("off", "on");
        const frame = document.getElementsByClassName("notifications")[0];
        frame.innerHTML = "";
        elems.forEach((e) => {
            const node = document.createElement("a");
            node.href = e.link;
            node.innerHTML = `<i>${e.subject}</i> Nová úloha:<br /><b>${e.name}</b>`;
            node.addEventListener("click", Logged.notifySeen.bind(this));
            frame.appendChild(node);
        });
    }

    static getLinksFromHTML(text, href) {
        text = text.replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, "");
        const doc = new DOMParser().parseFromString(text, "text/html");
        const allLinks = doc.querySelectorAll<HTMLAnchorElement>(
            `.butLink[href*="${href}"]`,
        );
        const links: HTMLAnchorElement[] = [];
        allLinks.forEach((link) => {
            if (link.href && !link.href.includes("javascript:")) {
                links.push(link);
            }
        });
        return links;
    }

    static async taskSpider() {
        const main = await fetch(
            new URL(
                "index.php?X=Main",
                window.location.protocol + "//" + window.location.hostname,
            ),
        );
        if (!main.ok || main.redirected) {
            return [];
        }

        const mainText = await main.text();
        const subjects = Logged.getLinksFromHTML(mainText, "Course");
        if (!subjects) {
            return [];
        }
        const tasks: {
            subject: string;
            link: string;
            name: string;
            seen: boolean;
        }[] = [];

        for (const e of subjects) {
            const course = await fetch(e.href);
            if (!course.ok || course.redirected) {
                return;
            }
            const text = await course.text();
            const taskLinks = Logged.getLinksFromHTML(text, "TaskGrp");
            if (!taskLinks) {
                return;
            }

            taskLinks.forEach((f) => {
                const url = new URL(f.href);
                const name = (f.parentNode?.parentNode?.parentNode?.parentNode
                    ?.firstElementChild || undefined) as
                    | HTMLElement
                    | undefined;
                if (!name) {
                    return;
                }
                tasks.push({
                    subject: e.innerText,
                    link: "/" + url.search,
                    name: name?.innerText,
                    seen: false,
                });
            });
        }
        return tasks;
    }

    static notifyToggle() {
        document
            .getElementsByClassName("notifications")[0]
            .classList.toggle("notifications-hide");
    }

    static notifySeen(event) {
        const localTasks = JSON.parse(localStorage.tasks);
        const linkNode =
            event.target.nodeName == "A"
                ? event.target
                : event.target.parentElement;
        const link = new URL(linkNode.href);
        localTasks.map((e) => {
            if (e.link == "/" + link.search) {
                e.seen = true;
            }
            return e;
        });
        localStorage.tasks = JSON.stringify(localTasks);
        const frame = document.getElementsByClassName("notifications")[0];
        frame.removeChild(linkNode);
        if (!frame.childElementCount) {
            frame.innerHTML = "<b>Žádná upozornění</b>";
            document
                .getElementsByClassName("notify")[0]
                .classList.replace("on", "off");
        }
    }
}
