import { compile, preprocess } from "svelte/compiler";
import { readFile } from "fs/promises";
import svelte from "svelte-preprocess";
import { BunPlugin } from "bun";

export const sveltePlugin: BunPlugin = {
    name: "svelte loader",
    async setup(builder) {
        builder.onLoad({ filter: /\.svelte$/ }, async ({ path }) => {
            const preprocessed = await preprocess(
                await readFile(path, "utf8"),
                svelte(),
                {
                    filename: path,
                },
            );

            return {
                // Use the preprocessor of your choice.
                contents: compile(preprocessed.code, {
                    filename: path,
                    generate: "dom",
                }).js.code,
                loader: "js",
            };
        });
    },
};
