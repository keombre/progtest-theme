<script lang="ts">
    import { onMount } from "svelte";
    import { DEFAULT_SETTINGS, ExtensionSettings } from "../settings";
    import packageJson from "../../package.json";
    import { slide } from "svelte/transition";

    const version = packageJson.version;

    let settings: ExtensionSettings = DEFAULT_SETTINGS;
    let showSuccess: boolean = false;

    onMount(async () => {
        if (typeof chrome !== "object") return;
        chrome.storage.sync.get(DEFAULT_SETTINGS, function (syncedSettings) {
            if (syncedSettings === undefined) return;
            settings = syncedSettings as ExtensionSettings;
        });
    });

    function handleSubmit() {
        const onSetSettings = () => {
            console.log("Settings saved!");
            showSuccess = true;
            if (typeof chrome === "object") {
                chrome.tabs.reload({ bypassCache: true });
            }
            setTimeout(function () {
                showSuccess = false;
            }, 1500);
        };

        if (typeof chrome === "object") {
            chrome.storage.sync.set(settings, onSetSettings);
        } else {
            onSetSettings;
        }
    }
</script>

<main
    style="
            display: flex; 
            flex-direction: column; 
            gap: 10px;
        "
>
    <div
        style="
            display: flex;
            align-items: end;
            justify-content: center;
            gap: 8px;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--divider-color);
        "
    >
        <img
            src="../themes/assets/favicon.ico"
            alt="Progtest"
            style="width: 24px;"
        />
        <p style="line-height: 20px;">Themes</p>
    </div>

    <form on:submit|preventDefault={handleSubmit} style="flex-grow: 1;">
        <div
            style="
                display: flex; 
                flex-direction: column; 
                gap: 4px;
            "
        >
            <div
                style="
                    display: flex; 
                    gap: 2px; 
                    align-items: center;
                "
            >
                <iconify-icon
                    icon="tabler:palette"
                    style="width: 16px; display: block;"
                ></iconify-icon>
                <p style="font-weight: 500;">Select your theme</p>
            </div>
            <select bind:value={settings.theme} style="padding: 0 2px;">
                <option value="orig">Original</option>
                <option value="orig-dark">Original Dark</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="automatic">Automatic</option>
            </select>
        </div>

        {#if !["orig", "orig-dark"].includes(settings.theme)}
            <div
                style="
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    margin-top: 10px;
                    border-top: 1px solid var(--divider-color);
                    padding-top: 10px;
                "
            >
                <div
                    style="
                        display: flex; 
                        gap: 2px; 
                        align-items: center;
                    "
                >
                    <iconify-icon
                        icon="tabler:settings"
                        style="width: 16px; display: block;"
                    ></iconify-icon>
                    <p style="font-weight: 500;">Theme settings</p>
                </div>
                <div
                    style="
                        display: flex;
                        flex-direction: column;
                        gap: 2px;
                    "
                >
                    <label>
                        <input
                            type="checkbox"
                            bind:checked={settings.autohideResults}
                        />
                        Autohide results
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            bind:checked={settings.showNotifications}
                        />
                        Show notifications
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            bind:checked={settings.syntaxHighlighting}
                        />
                        Syntax highlighting
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            bind:checked={settings.playSounds}
                        />
                        Play sounds
                    </label>
                </div>
            </div>
        {/if}

        <div
            style="
                padding-top: 10px;
                margin-top: 10px;
                border-top: 1px solid var(--divider-color);
            "
        >
            <button
                type="submit"
                style="
                    appearance: none;
                    padding: 4px 12px;
                    width: 100%;
                    background-color: var(--foreground-color);
                    color: var(--background-color);
                    border-radius: 4px;

                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                "
            >
                <iconify-icon icon="tabler:device-floppy" />
                <p>Save</p>
            </button>
        </div>
    </form>

    {#if showSuccess}
        <div
            transition:slide={{ duration: 150 }}
            style="
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
                padding: 8px;
                background-color: var(--divider-color);
                border-radius: 4px;
            "
        >
            <iconify-icon icon="tabler:check"></iconify-icon>
            <p>Settings saved!</p>
        </div>
    {/if}

    <div
        style="
            padding-top: 10px;
            border-top: 1px solid var(--divider-color);
            text-align: center
        "
    >
        <a
            class="version"
            href="https://github.com/keombre/progtest-theme"
            target="_blank"
            style="
                display: inline-flex; 
                gap: 6px;
                align-items: center;
                justify-content: center;
                text-decoration: none;
                color: var(--foreground-color);
            "
        >
            <iconify-icon icon="tabler:brand-github"></iconify-icon>
            <span>Version {version}</span>
        </a>
    </div>
</main>

<style>
    @layer light, dark;

    @layer light {
        :root {
            --background-color: hsl(0 0% 100%);
            --foreground-color: hsl(240 10% 3.9%);
            --divider-color: #eee;
        }
    }

    @layer dark {
        @media screen and (prefers-color-scheme: dark) {
            :root {
                --background-color: hsl(240 10% 3.9%);
                --foreground-color: hsl(0 0% 98%);
                --divider-color: hsl(0 0% 15%);
            }
        }
    }

    :root {
        font-family: "Inter", sans-serif;
    }

    @supports (font-variation-settings: normal) {
        :root {
            font-family: "Inter var", sans-serif;
        }
    }

    * {
        font-size: 14px;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    :global(button) {
        border: none;
        margin: 0;
        padding: 0;
        width: auto;
        overflow: visible;

        background: transparent;

        /* inherit font & color from ancestor */
        color: inherit;
        font: inherit;

        /* Normalize `line-height`. Cannot be changed from `normal` in Firefox 4+. */
        line-height: normal;

        /* Corrects font smoothing for webkit */
        -webkit-font-smoothing: inherit;
        -moz-osx-font-smoothing: inherit;

        /* Corrects inability to style clickable `input` types in iOS */
        appearance: none;
        -webkit-appearance: none;
    }

    main {
        color: var(--foreground-color);
        background-color: var(--background-color);
        height: 350px;
        width: 200px;
        padding: 10px;
    }

    label {
        display: block;
    }
</style>
