export const SRC_DIR = "./src" as const;
export const ENTRYPOINTS = [
    "./src/background.ts",
    "./src/content/end.ts",
    "./src/content/start.ts",
    "./src/settings/index.js",
] as const;

export const BUILD_DIR = "./build" as const;
export const OUT_DIR = "./out" as const;

export const CHROME_MANIFEST = "./manifests/chrome.json" as const;
export const FIREFOX_MANIFEST = "./manifests/firefox.json" as const;
