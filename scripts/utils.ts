import archiver from "archiver";
import { cp, rm, exists, mkdir, readdir, stat } from "fs/promises";
import { createWriteStream } from "fs";
import { BUILD_DIR } from "./constants";

export async function* walkDir(dir: string): AsyncGenerator<string> {
    const files = await readdir(dir);
    for (const file of files) {
        const path = `${dir}/${file}`;
        const stats = await stat(path);
        if (stats.isDirectory()) {
            yield* walkDir(path);
        } else {
            yield path;
        }
    }
}

export async function copyDirectory(
    from: string,
    to: string,
    options?: {
        filter?: (path: string) => boolean;
        verbose?: boolean;
    },
) {
    // cut trailing slash if present
    from = from.replace(/\/$/, "");
    to = to.replace(/\/$/, "");

    for await (const filePath of walkDir(from)) {
        if (options?.filter && !options.filter(filePath)) {
            continue;
        }

        const directoryPath = filePath
            .substring(0, filePath.lastIndexOf("/"))
            .replace(from, to);
        if (!(await exists(directoryPath))) {
            options?.verbose &&
                console.log(`Creating directory ${directoryPath}`);
            await mkdir(directoryPath, { recursive: true });
        }

        const toPath = filePath.replace(from, to);
        options?.verbose && console.log(`Copying ${filePath} to ${toPath}`);
        await cp(filePath, toPath);
    }
}

export async function zipDirectory(
    sourceDir: string,
    outPath: string,
    options?: {
        zipDestPath?: string;
        useSystemUtilities?: boolean;
    },
) {
    if (options?.useSystemUtilities) {
        console.info("Zipping with system utilities");
        await rm(outPath, { force: true });
        // . + ./ => ../
        const proc = Bun.spawn(["zip", "-r", `.${outPath}`, "."], {
            cwd: BUILD_DIR,
        });
        await proc.exited;
        const output = await new Response(proc.stdout).text();
        const error = await new Response(proc.stderr).text();
        console.log(output);
        console.error(error);
    } else {
        console.log(`Zipping ${sourceDir} to ${outPath}`);
        const archive = archiver("zip", { zlib: { level: 9 } });

        const stream = createWriteStream(outPath);
        stream.on("error", (err) => {
            console.error(err);
            throw err;
        });

        archive
            .on("error", (err) => {
                console.error(err);
                throw err;
            })
            .directory(sourceDir, options?.zipDestPath ?? false)
            .pipe(stream);

        await archive.finalize();
    }
}
