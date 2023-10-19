import archiver from "archiver";
import { cp, exists, mkdir, readdir, stat } from "fs/promises";
import { createWriteStream } from "fs";

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

export function zipDirectory(
    sourceDir: string,
    outPath: string,
    options?: {
        zipDestPath?: string;
    },
) {
    const archive = archiver("zip", { zlib: { level: 9 } });
    const stream = createWriteStream(outPath);

    return new Promise<void>((resolve, reject) => {
        archive
            .directory(sourceDir, options?.zipDestPath ?? false)
            .on("error", (err) => reject(err))
            .pipe(stream);

        stream.on("close", () => resolve()).on("error", (err) => reject(err));
        archive.finalize();
    });
}
