import { MessageType } from "../messages";
import { ExtensionSettings } from "../settings";

const pttLoaded = new Event("ptt-loaded");

const loader = `
<div id="loadWrapper">
    <div class="anim-load anim-1"></div>
    <div class="anim-load anim-2"></div>
    <div class="anim-load anim-3"></div>
    <svg class="anim-logo" width="18.85mm" version="1.1" viewBox="0 0 23.272 34.408" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(-91.281 -156.77)">
        <path transform="scale(.26458)" d="m345 592.52v130.04h22.191v-46.16h23.389c26.86-0.2507 42.835-24.438 42.367-45.045-0.42142-18.58-13.702-38.75-40-38.84zm22.191 17.232h19.506c15.165 0 22.945 12.225 23.125 23.125 0.18935 11.453-10.085 25.09-23.482 25.09h-19.148z" fill="#565f7c"/>
        </g>
    </svg>
</div>`;

const errorReporter = () => {
    window.onerror = (event, source, lineno) => {
        if (document.body == null) {
            return true;
        }
        if (!source?.includes("chrome-extension:")) {
            return true;
        }
        const err = document.createElement("div");
        err.innerHTML =
            event +
            " at " +
            source.substr(source.lastIndexOf("/") + 1) +
            ":" +
            lineno;
        err.classList.add("errorReporter");
        document.body.appendChild(err);
        return false;
    };
};

const addLoader = () => {
    const ld = document.createElement("pttloader");
    ld.innerHTML = loader;
    document.children[0].appendChild(ld);
    window.addEventListener("load", () => {
        document
            .getElementById("loadWrapper")
            ?.classList.add("loadWrapperHide");
        setTimeout(() => {
            const wrapper = document.getElementById("loadWrapper");
            if (wrapper) {
                wrapper.style.visibility = "hidden";
            }
        }, 200);
    });

    window.addEventListener("beforeunload", () => {
        const wrapper = document.getElementById("loadWrapper");
        if (wrapper) {
            wrapper.style.visibility = "visible";
            wrapper.classList.remove("loadWrapperHide");
        }
    });
};

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
    favicon.href = chrome.extension.getURL("./themes/assets/favicon.ico");
    document.head.appendChild(favicon);
};

chrome.runtime.sendMessage(
    { type: MessageType.GET_SETTINGS },
    function (settings: ExtensionSettings) {
        if (settings === undefined) {
            throw new Error("Did not receive settings from background script");
        }
        if (settings.theme == "orig" || settings.theme == "orig-dark") {
            return;
        }

        errorReporter();

        window.progtestThemes = { loaded: true };
        window.dispatchEvent(pttLoaded);

        setTitle();
        addLoader();
        setTimeout(setFavicon, 0);
    },
);
