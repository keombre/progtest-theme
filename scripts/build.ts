import { BUILD_DIR, ENTRYPOINTS, SRC_DIR } from "./constants.ts";
import { mkdir, rm } from "fs/promises";
import { copyDirectory } from "./utils.ts";

export async function build(options: { verbose: boolean; clean: boolean }) {
    if (options.clean) {
        await rm(BUILD_DIR, { recursive: true, force: true });
    }

    try {
        await mkdir(BUILD_DIR);
    } catch (e) {
        if ((e as ErrnoException)?.code !== "EEXIST") {
            console.error(e);
        }
    }

    console.log("Building .js files");
    await Bun.build({
        entrypoints: Array(...ENTRYPOINTS),
        outdir: BUILD_DIR,
    });

    console.log("Copying other files");
    await copyDirectory(SRC_DIR, BUILD_DIR, {
        filter: (path) =>
            !path.endsWith(".js") || path.endsWith("highlight.pack.js"),
        verbose: options.verbose,
    });
}
