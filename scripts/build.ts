import { BUILD_DIR, ENTRYPOINTS, SRC_DIR } from "./constants";
import { mkdir, rm, cp } from "fs/promises";
import { copyDirectory } from "./utils";
import { sveltePlugin } from "./sveltePlugin";

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
    const buildOutput = await Bun.build({
        entrypoints: Array(...ENTRYPOINTS),
        outdir: BUILD_DIR,
        plugins: [sveltePlugin],
    });
    if (!buildOutput.success) {
        console.error("Build failed:", buildOutput);
        return;
    }
    console.log("Build finished", buildOutput);

    console.log("Copying other files");
    await copyDirectory(SRC_DIR, BUILD_DIR, {
        filter: (path) => {
            if (path.endsWith("highlight.min.js")) {
                return true;
            }
            if (
                path.endsWith(".js") ||
                path.endsWith(".ts") ||
                path.endsWith(".svelte")
            ) {
                return false;
            }
            return true;
        },
        verbose: options.verbose,
    });
    await cp(
        `./node_modules/normalize.css/normalize.css`,
        `${BUILD_DIR}/external/normalize.css`,
    );
    await cp(
        `./node_modules/iconify-icon/dist/iconify-icon.min.js`,
        `${BUILD_DIR}/external/iconify-icon.min.js`,
    );
}
