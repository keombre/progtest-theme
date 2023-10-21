import { pttLoadedEvent } from "../events";
import { MessageType } from "../messages";
import { ExtensionSettings } from "../settings";

const setTitle = () => {
    document.title = document.title
        .replace("@progtest.fit.cvut.cz -", " |")
        .replace("progtest.fit.cvut.cz - ", "");
};

const setFavicon = () => {
    const favicon: HTMLLinkElement =
        document.querySelector("link[rel*='icon']") ||
        document.createElement("link");
    favicon.type = "image/x-icon";
    favicon.rel = "shortcut icon";
    favicon.href = chrome.runtime.getURL("./themes/assets/favicon.ico");
    document.head.appendChild(favicon);
};

const addLoader = () => {
    const div = document.createElement("pttloader");
    div.id = "ptt-loader";
    document.documentElement.appendChild(div);

    const script = document.createElement("script");
    script.id = "ptt-loader-script";
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", chrome.runtime.getURL("content/loader.js"));
    document.documentElement.appendChild(script);
};

addLoader();
chrome.runtime.sendMessage(
    { type: MessageType.GET_SETTINGS },
    function (settings: ExtensionSettings) {
        if (settings === undefined) {
            throw new Error("Did not receive settings from background script");
        }
        console.log("PTT start with settings:", settings);
        if (settings.theme == "orig" || settings.theme == "orig-dark") {
            setTimeout(() => document.dispatchEvent(pttLoadedEvent), 0);
            return;
        }

        setTitle();
        setTimeout(setFavicon, 0);
    },
);
