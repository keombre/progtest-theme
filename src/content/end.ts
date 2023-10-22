import { MessageType } from "../messages";
import { ExtensionSettings } from "../settings";
import { Course } from "./pages/Course/Course";
import { ErrorPage } from "./pages/Error/Error";
import { Exam } from "./pages/Exam";
import { Logged } from "./pages/Logged";
import { Login } from "./pages/Login";
import { Main } from "./pages/Main";
import { Results } from "./pages/Results";
import { Task } from "./pages/Task";
import { pttLoadedEvent } from "../events";
import { Page } from "./pages/Page";

const getMessage = (classes: string[], message: string) => {
    const div = document.createElement("div");
    div.classList.add(...classes);
    div.innerHTML = message.replace(/\n/g, "<br />");
    return div;
};

const main = async (settings: ExtensionSettings) => {
    if (!["/", "/index.php"].includes(window.location.pathname)) {
        console.log("unknown page", window.location.pathname);
        return;
    }

    const args = new URLSearchParams(window.location.search);

    // show message for new users
    const message = getMessage(
        ["install-message"],
        "PTT seems to be freshly installed.\nPlease force refresh the page to load the theme.\n(Ctrl+Shift+R / Cmd+Shift+R)",
    );
    message.style.fontSize = "40px";
    document.body.prepend(message);

    document.body.removeAttribute("bgcolor");
    document.body.removeAttribute("text");

    let page: Page;
    try {
        if (document.querySelector("select[name=UID_UNIVERSITY]") != null) {
            page = new Login();
        } else if (args.has("X")) {
            switch (args.get("X")) {
                case "FAQ":
                case "Preset":
                case "CompilersDryRuns":
                case "Extra":
                case "KNT":
                case "TaskGrp": {
                    page = new Logged(settings);
                    break;
                }
                case "KNTQ": {
                    page = new Exam(settings);
                    break;
                }
                case "Course": {
                    page = new Course(settings);
                    break;
                }
                case "Results": {
                    page = new Results(settings);
                    break;
                }
                case "Compiler":
                case "DryRun":
                case "Task":
                case "TaskU": {
                    page = new Task(settings);
                    break;
                }
                case "Main": {
                    page = new Main(settings);
                    break;
                }
                default: {
                    // determine if site is really main
                    const navlink =
                        document.querySelector<HTMLSpanElement>("span.navlink"); // first time login
                    if (
                        document.querySelector(
                            'span.navLink > a.navLink[href="?X=Main"]',
                        ) ||
                        (navlink && navlink.innerText.includes("Než"))
                    ) {
                        page = new Logged(settings);
                    } else {
                        page = new Main(settings);
                    }
                }
            }
        } else {
            page = new Main(settings);
        }

        await page.initialise();
    } catch (e) {
        if (e instanceof Error) {
            page = new ErrorPage(e);
            await page.initialise();
        } else {
            throw e;
        }
    }
    return page;
};

const replaceStyles = (theme: string) => {
    if (theme === "orig") return Promise.resolve();

    document.head.querySelectorAll('link[href$="/css.css"]').forEach((e) => {
        e.remove();
    });

    const link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");

    link.setAttribute(
        "href",
        chrome.runtime.getURL("themes/" + theme + ".css"),
    );
    document.getElementsByTagName("head")[0].appendChild(link);
    return new Promise((resolve) => {
        link.onload = resolve;
    });
};

chrome.runtime.sendMessage(
    { type: MessageType.GET_SETTINGS },
    async (settings: ExtensionSettings) => {
        console.log("PTT end with settings:", settings);
        await Promise.all([
            replaceStyles(settings.theme).then(() => {
                console.log("PTT styles loaded");
            }),
            !["orig", "orig-dark"].includes(settings.theme) && main(settings),
        ]);
        console.log("PTT loaded");
        document.dispatchEvent(pttLoadedEvent);
    },
);
