import { cp, mkdir, rm } from "fs/promises";
import webExt from "web-ext";
import {
    BUILD_DIR,
    CHROME_MANIFEST,
    FIREFOX_MANIFEST,
    OUT_DIR,
} from "./constants";
import { zipDirectory } from "./utils";
import minimist from "minimist";

const MANIFEST_TARGET = `${BUILD_DIR}/manifest.json` as const;
const FIREFOX_DIST_DIR = `${OUT_DIR}/firefox` as const;
const CHROME_DIST_DIR = `${OUT_DIR}/chrome` as const;

async function pack(distDir: string, useSystemUtilities: boolean) {
    await rm(distDir, { recursive: true });
    await mkdir(distDir);
    await zipDirectory(BUILD_DIR, `${distDir}/progtest_themes.zip`, {
        useSystemUtilities,
    });
}

async function signFirefox() {
    if (!process.env.WEB_EXT_API_KEY || !process.env.WEB_EXT_API_SECRET) {
        throw new Error(
            "WEB_EXT_API_KEY and WEB_EXT_API_SECRET must be set in the environment",
        );
    }

    await cp(FIREFOX_MANIFEST, MANIFEST_TARGET);
    await rm(FIREFOX_DIST_DIR, { recursive: true });
    await mkdir(FIREFOX_DIST_DIR);
    await webExt.cmd.sign(
        {
            sourceDir: BUILD_DIR,
            artifactsDir: FIREFOX_DIST_DIR,
            apiKey: process.env.WEB_EXT_API_KEY,
            apiSecret: process.env.WEB_EXT_API_SECRET,
            channel: "unlisted",
            /** upcoming Mozilla API */
            // useSubmissionApi: true,
            // amoBaseUrl: "https://addons.mozilla.org/api/v5",
        },
        { shouldExitProgram: false },
    );
}

async function packChrome(useSystemUtilities: boolean) {
    cp(CHROME_MANIFEST, MANIFEST_TARGET);
    pack(CHROME_DIST_DIR, useSystemUtilities);
}

async function packFirefox(useSystemUtilities: boolean) {
    cp(FIREFOX_MANIFEST, MANIFEST_TARGET);
    pack(FIREFOX_DIST_DIR, useSystemUtilities);
}

async function main() {
    const args = minimist(process.argv.slice(2), {
        boolean: ["chrome", "firefox", "sign", "system"],
        default: {
            chrome: false,
            firefox: false,
            sign: false,
            system: false,
        },
    });

    if (args.chrome) {
        if (args.sign) {
            throw new Error("Cannot sign Chrome extension");
        }
        await packChrome(args.system);
        return;
    }

    if (args.firefox) {
        if (args.sign) {
            if (args.system) {
                throw new Error("System utilities cannot be used with signing");
            }
            await signFirefox();
        } else {
            await packFirefox(args.system);
        }
        return;
    }

    console.log(
        "Use '--chrome' or '--firefox' to build a specific browser extension",
    );
    console.log("Use '--firefox --sign' to create a signed Firefox extension");
    console.log("Use '--system' to use system utilities for zipping");
}

main();
