import { Page } from "../Page";
import ErrorComponent from "./Error.svelte";

export class ErrorPage implements Page {
    constructor(private error: Error) {}

    async initialise() {
        document.title = "Error | ProgTest";

        const center = document.querySelector<HTMLElement>("body > center");
        if (center) {
            center.style.display = "none";
        }

        const container = document.createElement("div");
        document.body.insertBefore(container, center);
        new ErrorComponent({
            target: container,
            props: { error: this.error },
        });
    }
}
