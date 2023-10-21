import { watch } from "fs";
import { cp } from "fs/promises";
import { build } from "./build";
import { walkDir } from "./utils";

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

                // test page list endpoint
                if (url.pathname === "/test_pages") {
                    const pages: { url: string; description: string }[] = [];
                    for await (const filePath of walkDir("./test_pages")) {
                        const file = await Bun.file(filePath).text();
                        const description = file
                            .split("\n")[0]
                            .replace("<!--", "")
                            .replace("-->", "")
                            .trim();

                        const splitPath = filePath.split("/");
                        const folderName = splitPath.slice(-2)[0];
                        const fileName = splitPath.slice(-1)[0];

                        const url = new URL("/index.php", req.url);
                        url.searchParams.set("X", folderName);
                        url.searchParams.set(
                            "Cou",
                            fileName.replace(".html", ""),
                        );

                        pages.push({
                            url: url.toString(),
                            description: description.includes(
                                'xml version="1.0" encoding="utf-8"',
                            )
                                ? filePath
                                : description,
                        });
                    }
                    return Response.json(pages);
                }

                // test page endpoints
                if (url.pathname.startsWith("/test_pages")) {
                    return new Response(Bun.file(`.${url.pathname}`));
                }
                if (url.pathname === "/index.php") {
                    return new Response(
                        Bun.file(
                            `./test_pages/${url.searchParams.get(
                                "X",
                            )}/${url.searchParams.get("Cou")}.html`,
                        ),
                    );
                }
                if (url.pathname.endsWith("css.css")) {
                    return fetch("https://progtest.fit.cvut.cz/css.css");
                }
                if (url.pathname.endsWith("shared.js")) {
                    return fetch("https://progtest.fit.cvut.cz/shared.js");
                }

                // dev server index
                if (url.pathname === "/") {
                    return Response.redirect("/dev/index.html");
                }

                return new Response(Bun.file(`./build/${url.pathname}`));
            },
        });
        console.log(`Dev server running on http://localhost:${server.port}/`);
    });
