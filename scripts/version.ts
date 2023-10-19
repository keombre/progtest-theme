import minimist from "minimist";
import { CHROME_MANIFEST, FIREFOX_MANIFEST } from "./constants";
import { format, resolveConfig } from "prettier";

async function writeFormattedJson<Data>(
    filePath: string,
    content: Data extends object ? Data : never,
) {
    const prettierConfig = await resolveConfig(filePath);
    const output = await format(JSON.stringify(content), {
        parser: "json",
        ...prettierConfig,
    });
    Bun.write(filePath, output);
}

async function incrementVersionInFile(
    filePath: string,
    type: "major" | "minor" | "patch",
) {
    const file = Bun.file(filePath);
    const content = await file.json();
    const version = content.version as string;
    const [major, minor, patch] = version.split(".").map((v) => parseInt(v));
    switch (type) {
        case "major":
            content.version = `${major + 1}.0.0`;
            break;
        case "minor":
            content.version = `${major}.${minor + 1}.0`;
            break;
        case "patch":
            content.version = `${major}.${minor}.${patch + 1}`;
            break;
    }

    console.log(`Updating ${filePath} to ${content.version}`);
    writeFormattedJson(filePath, content);
}

async function addUpdateToList(updateFile: string) {
    const packageJson = await Bun.file("./package.json").json();
    const version = packageJson.version as string;
    const updateJson = await Bun.file(updateFile).json();
    updateJson.updates.push({
        version,
        update_link: `https://github.com/keombre/progtest-theme/releases/download/${version}/progtest_themes-${version}-an+fx.xpi`,
    });
    console.log(`Adding ${version} to ${updateFile}`);
    writeFormattedJson(updateFile, updateJson);
}

async function main() {
    const args = minimist(process.argv.slice(2), {
        boolean: ["major", "minor", "patch"],
        default: {
            major: false,
            minor: false,
            patch: false,
        },
    });

    if (
        (args.major && args.minor) ||
        (args.major && args.patch) ||
        (args.minor && args.patch)
    ) {
        throw new Error("Cannot increment multiple numbers at the same time");
    }

    if (!args.major && !args.minor && !args.patch) {
        throw new Error(
            "Must specify a version increment type ('--major', '--minor', or '--patch')",
        );
    }

    const type = args.major ? "major" : args.minor ? "minor" : "patch";

    for (const file of [
        CHROME_MANIFEST,
        FIREFOX_MANIFEST,
        "./manifests/debug.json",
        "./package.json",
    ]) {
        await incrementVersionInFile(file, type);
    }

    await addUpdateToList("./update.json");
}

main();
