import { watch } from "fs";
import { cp } from "fs/promises";
import { build } from "./build";

const watchedExtensions = [".ts", ".js", ".json", ".html", ".css", ".svelte"];

async function additionalDevSteps() {
    await cp("./manifests/debug.json", "./build/manifest.json");
    await cp("./scripts/crx-hot-reload.js", "./build/crx-hot-reload.js");
}

console.log("Building extension...");
build({ verbose: false, clean: true })
    .then(additionalDevSteps)
    .then(() => {
        const exit = () => {
            watchers.forEach((w) => w.close());
            process.exit(0);
        };

        const onChange = async (eventType: string, filename: string | null) => {
            if (!watchedExtensions.some((ext) => filename?.endsWith(ext))) {
                console.log(`Ignoring change in ${filename}`);
                return;
            }
            if (eventType === "error") {
                console.error(`Error occurred with ${filename}, exiting...`);
                exit();
            }
            console.log(`${eventType} detected in ${filename}, rebuilding...`);
            await build({ verbose: false, clean: false });
            await additionalDevSteps();
            console.log("Extension rebuilt");
        };

        const watchers = [
            watch("./src/", { recursive: true }, onChange),
            watch("./manifests/", { recursive: true }, onChange),
            watch("./scripts/crx-hot-reload.js", {}, onChange),
        ];
        process.on("SIGINT", exit);
        console.log("Watching for changes...");
    })
    .then(() => {
        const server = Bun.serve({
            async fetch(req: Request) {
                const url = new URL(req.url);
                console.log(`Serving ${url}`);

                if (url.pathname === "/") {
                    return Response.redirect("/settings/index.html");
                }

                return new Response(Bun.file(`./build/${url.pathname}`));
            },
        });
        console.log(`Dev server running on http://localhost:${server.port}/`);
    });
