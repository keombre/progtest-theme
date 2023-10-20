import { ExtensionSettings } from "../settings";

export class Err404 {
    siteBody = `
<div class="e404">
    <h1>HTTP/1.1 404 Not Found</h1>
    <h2>Stránka nenalezena</h2>
    <span>Zkuste se vrátit <a href="#" onclick="window.history.back()">zpátky</a></span>
</div>`;

    constructor(settings: ExtensionSettings) {
        document.title = "404 | ProgTest";

        const link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");

        link.setAttribute(
            "href",
            chrome.extension.getURL("./themes/404/" + settings.theme + ".css"),
        );
        document.getElementsByTagName("head")[0].appendChild(link);

        document.body.innerHTML = this.siteBody;
    }
}
