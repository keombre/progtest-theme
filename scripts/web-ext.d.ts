/// <reference types="web-ext" />
declare module "web-ext" {
    export const cmd: {
        [K in keyof WebExtConfig]: (
            options: WebExtSharedOptions & WebExtConfig[K],
            { shouldExitProgram }: { shouldExitProgram: boolean }
        ) => Promise<void>;
    };

    type WebExtSharedOptions = {
        /**
         * Show version number
         */
        version?: boolean;

        /**
         * Web extension source directory.
         * @default "./"
         */
        sourceDir?: string;

        /**
         * Directory where artifacts will be saved.
         * @default "./web-ext-artifacts"
         */
        artifactsDir?: string;

        /**
         * Show verbose output
         */
        verbose?: boolean;

        /**
         * A list of glob patterns to define which files should be ignored.
         * @example ["path/to/first.js", "path/to/second.js" "dir/*.log"]
         */
        ignoreFiles?: string[];

        /**
         * Disable all features that require standard input
         */
        noInput?: boolean;

        /**
         * Path to a CommonJS config file to set option defaults
         */
        config?: string;

        /**
         * Discover config files in home directory and working directory. Disable with --no-config-discovery.
         * @default true
         */
        configDiscovery?: boolean;

        /**
         * Show help
         */
        help?: boolean;
    };

    type WebExtBuildCommandOptions = {
        /**
         * Watch for file changes and re-build as needed
         */
        asNeeded?: boolean;

        /**
         * Name of the created extension package file.
         */
        filename?: string;

        /**
         * Overwrite destination package if it exists.
         */
        overwriteDest?: boolean;
    };

    type WebExtSignCommandOptions = {
        /**
         * Signing API URL prefix - only used with `use-submission-api`
         * @default "https://addons.mozilla.org/api/v5/"
         */
        amoBaseUrl?: string;

        /**
         * API key (JWT issuer) from addons.mozilla.org
         */
        apiKey: string;

        /**
         * API secret (JWT secret) from addons.mozilla.org
         */
        apiSecret: string;

        /**
         * Signing API URL prefix
         * @default "https://addons.mozilla.org/api/v4"
         */
        apiUrlPrefix?: string;

        /**
         * Use a proxy to access the signing API.
         * @example "https://yourproxy:6000"
         */
        apiProxy?: string;

        /**
         * Sign using the addon submission API
         */
        useSubmissionApi?: boolean;

        /**
         * A custom ID for the extension. This has no effect if the extension already declares an explicit ID in its manifest.
         */
        id?: string;

        /**
         * Number of milliseconds to wait before giving up
         */
        timeout?: number;

        /**
         * Disable the progress bar in sign-addon
         */
        disableProgressBar?: boolean;

        /**
         * The channel for which to sign the addon. Either 'listed' or 'unlisted'
         */
        channel?: string;

        /**
         * Path to a JSON file containing an object with metadata to be passed to the API.
         * Only used with `use-submission-api`
         * @see https://addons-server.readthedocs.io/en/latest/topics/api/addons.html
         */
        amoMetadata?: string;
    };

    type WebExtRunCommandOptions = {
        /**
         * The extensions runners to enable. Specify this option multiple times to run against multiple targets.
         * @default "firefox-desktop"
         */
        target?: ("firefox-desktop" | "firefox-android" | "chromium")[];

        /**
         * Path or alias to a Firefox executable such as firefox-bin or firefox.exe. If not specified,
         * the default Firefox will be used. You can specify the following aliases in lieu of a path:
         * `firefox`, `beta`, `nightly`, `firefoxdeveloperedition`. For Flatpak, use
         * `flatpak:org.mozilla.firefox` where `org.mozilla.firefox` is the application ID.
         */
        firefox?: string;

        /**
         * Run Firefox using a copy of this profile. The profile can be specified as a directory
         * or a name, such as one you would see in the Profile Manager. If not specified, a new
         * temporary profile will be created.
         */
        firefoxProfile?: string;

        /**
         * Path or alias to a Chromium executable such as google-chrome, google-chrome.exe
         * or opera.exe etc. If not specified, the default Google Chrome will be used.
         */
        chromiumBinary?: string;

        /**
         * Path to a custom Chromium profile
         */
        chromiumProfile?: string;

        /**
         * Create the profile directory if it does not already exist
         */
        profileCreateIfMissing?: boolean;

        /**
         * Run Firefox directly in custom profile. Any changes to the profile will be saved.
         */
        keepProfileChanges?: boolean;

        /**
         * Reload the extension when source files change.Disable with --no-reload.
         * @default true
         */
        reload?: boolean;

        /**
         * Reload the extension only when the contents of this file changes.This is useful
         * if you use a custom build process for your extension.
         */
        watchFile?: string[];

        /**
         * Paths and globs patterns that should not be watched for changes. This is useful
         * if you want to explicitly prevent web-ext from watching part of the extension
         * directory tree, e.g. the `node_modules` folder.
         */
        watchIgnored?: string[];

        /**
         * Pre-install the extension into the profile before startup.
         * This is only needed to support older versions of Firefox.
         */
        preInstall?: boolean;

        /**
         * Launch firefox with a custom preferences.
         * @example ["general.useragent.locale=fr-FR"]
         */
        pref?: string[];

        /**
         * Launch firefox at specified page
         */
        startUrl?: string[];

        /**
         * Open the DevTools for the installed add-on (Firefox 106 and later)
         */
        devtools?: boolean;

        /**
         * Open the DevTools Browser Console.
         */
        browserConsole?: boolean;

        /**
         * Additional CLI options passed to the Browser binary
         */
        args?: string[];

        /**
         * Turn on developer preview features in Firefox (defaults to "mv3")
         */
        firefoxPreview?: string[];

        /**
         * Specify a custom path to the adb binary
         */
        adbBin?: string;

        /**
         * Connect to adb on the specified host
         */
        adbHost?: string;

        /**
         * Connect to adb on the specified port
         */
        adbPort?: string;

        /**
         * Connect to the specified adb device name
         */
        adbDevice?: string;

        /**
         * Number of milliseconds to wait before giving up
         */
        adbDiscoveryTimeout?: number;

        /**
         * Remove old artifacts directories from the adb device
         */
        adbRemoveOldArtifacts?: boolean;

        /**
         * Run a specific Firefox for Android APK
         * @example "org.mozilla.fennec_aurora"
         */
        firefoxApk?: string;

        /**
         * Run a specific Android Component (defaults to <firefox-apk>/.App)
         */
        firefoxApkComponent?: string;
    };

    type WebExtLintCommandOptions = {
        /**
         * The type of output to generate
         * @default "text"
         */
        output?: "json" | "text";

        /**
         * Output only metadata as JSON
         * @default false
         */
        metadata?: boolean;

        /**
         * Treat warnings as errors by exiting non-zero for warnings
         * @default false
         */
        warningsAsErrors?: boolean;

        /**
         * Prettify JSON output
         * @default false
         */
        pretty?: boolean;

        /**
         * Treat your extension as a privileged extension
         * @default false
         */
        privileged?: boolean;

        /**
         * Your extension will be self-hosted. This disables messages related to hosting on addons.mozilla.org.
         * @default false
         */
        selfHosted?: boolean;

        /**
         * Disables colorful shell output
         * @default false
         */
        boring?: boolean;

        /**
         * Turn on developer preview features in Firefox
         * @default "mv3"
         */
        firefoxPreview?: string[];
    };

    /**
     * Options used by commands in the `web-ext` CLI.
     * @see https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext
     */
    export type WebExtConfig = {
        build: WebExtBuildCommandOptions;
        sign: WebExtSignCommandOptions;
        run: WebExtRunCommandOptions;
        lint: WebExtLintCommandOptions;
    };
}
