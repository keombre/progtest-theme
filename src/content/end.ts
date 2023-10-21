import { MessageType } from "../messages";
import { ExtensionSettings } from "../settings";
import { Course } from "./Course";
import { Err404 } from "./Err404";
import { Exam } from "./Exam";
import { Logged } from "./Logged";
import { Login } from "./Login";
import { Main } from "./Main";
import { Results } from "./Results";
import { Task } from "./Task";

const getMessage = (classes: string[], message: string) => {
    const div = document.createElement("div");
    div.classList.add(...classes);
    div.innerHTML = message.replace(/\n/g, "<br />");
    return div;
};

const main = (settings: ExtensionSettings) => {
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

    if (document.body.innerHTML == "") {
        return new Err404(settings);
    } else if (document.querySelector("select[name=UID_UNIVERSITY]") != null) {
        return new Login();
    } else if (args.has("X")) {
        switch (args.get("X")) {
            case "FAQ":
            case "Preset":
            case "CompilersDryRuns":
            case "Extra":
            case "KNT":
            case "TaskGrp":
                return new Logged(settings);
            case "KNTQ":
                return new Exam(settings);
            case "Course":
                return new Course(settings);
            case "Results":
                return new Results(settings);
            case "Compiler":
            case "DryRun":
            case "Task":
            case "TaskU":
                return new Task(settings);
            case "Main": {
                const page = new Main(settings);
                page.initialise();
                return page;
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
                    return new Logged(settings);
                } else {
                    return new Main(settings);
                }
            }
        }
    } else {
        const page = new Main(settings);
        page.initialise();
        return page;
    }
};

chrome.runtime.sendMessage({ type: MessageType.GET_SETTINGS }, (settings) => {
    console.log("Initializing PTT with settings", settings);
    // TODO: investigate whether this loaded check is necessary
    if (window.progtestThemes?.loaded) {
        main(settings);
    } else {
        window.addEventListener("pttLoaded", () => {
            main(settings);
        });
    }
});
