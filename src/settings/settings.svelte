<script lang="ts">
    import { onMount } from "svelte";
    import { DEFAULT_SETTINGS, ExtensionSettings } from "../settings";
    import packageJson from "../../package.json";
    import { slide } from "svelte/transition";
    import Button from "../components/button.svelte";

    const version = packageJson.version;

    let settings: ExtensionSettings = DEFAULT_SETTINGS;
    let showSuccess: boolean = false;
    let hasPermissions: boolean = false;

    onMount(async () => {
        if (typeof chrome !== "object") return;
        chrome.storage.local.get(DEFAULT_SETTINGS, function (localSettings) {
            if (localSettings === undefined) return;
            settings = localSettings as ExtensionSettings;
            console.log("Settings loaded!", settings);
        });
        hasPermissions = await chrome.permissions.contains({
            origins: [
                "https://progtest.fit.cvut.cz/*",
                "https://courses.fit.cvut.cz/data/courses-all.json",
            ],
        });
        console.log("Permission check", hasPermissions);

        // explicit click listener needed because Firefox is dumb
        document
            .getElementById("permissionBtn")
            ?.addEventListener("click", grantPermissions);
    });

    function handleSubmit() {
        const onSetSettings = () => {
            console.log("Settings saved!", settings);
            showSuccess = true;
            if (typeof chrome === "object") {
                chrome.tabs.reload({ bypassCache: true });
            }
            setTimeout(function () {
                showSuccess = false;
            }, 1500);
        };

        if (typeof chrome === "object") {
            chrome.storage.local.set(settings, onSetSettings);
        } else {
            onSetSettings();
        }
    }

    function grantPermissions() {
        if (typeof chrome === "object") {
            chrome.permissions
                .request({
                    origins: [
                        "https://progtest.fit.cvut.cz/*",
                        "https://courses.fit.cvut.cz/data/courses-all.json",
                    ],
                })
                .then((granted) => {
                    if (granted) {
                        hasPermissions = true;
                        chrome.tabs.reload({ bypassCache: true });
                    }
                    console.log(granted);
                });
        }
    }
</script>

<main
    style="
            display: flex; 
            flex-direction: column; 
            gap: 12px;
            
            color: var(--foreground-color);
            background-color: var(--background-color);
            height: 386px;
            width: 200px;
            padding: 12px;
        "
>
    {#if hasPermissions}
        <div
            style="
        display: flex;
        align-items: end;
        justify-content: center;
        gap: 8px;
        padding-bottom: 12px;
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
            gap: 8px;
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
                <select
                    bind:value={settings.theme}
                    style="padding: 2px 4px; border-radius: 4px;"
                >
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
                gap: 8px;
                margin-top: 12px;
                border-top: 1px solid var(--divider-color);
                padding-top: 12px;
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
                    gap: 4px;
                "
                    >
                        <label style="display: block">
                            <input
                                type="checkbox"
                                bind:checked={settings.autohideResults}
                            />
                            Autohide results
                        </label>
                        <label style="display: block">
                            <input
                                type="checkbox"
                                bind:checked={settings.showNotifications}
                            />
                            Show notifications
                        </label>
                        <label style="display: block">
                            <input
                                type="checkbox"
                                bind:checked={settings.syntaxHighlighting}
                            />
                            Syntax highlighting
                        </label>
                        <label style="display: block">
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
            padding-top: 12px;
            margin-top: 12px;
            border-top: 1px solid var(--divider-color);
        "
            >
                <Button type="submit" style="width: 100%;">
                    <iconify-icon icon="tabler:device-floppy" />
                    <p>Save</p>
                </Button>
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
        padding-top: 12px;
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
    {:else}<div
            style="
        display: flex; 
        flex-direction: column; 
        gap: 8px;
        height: 100%;
    "
        >
            <p style="text-align: center">Welcome to</p>
            <div
                style="
        display: flex;
        align-items: end;
        justify-content: center;
        gap: 8px;
        padding-bottom: 12px;
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
            <p>This extension allows you to change the look of Progtest.</p>
            <p>
                For the extension to work properly, please grant it permissions
                to access the following sites:
            </p>
            <ul style="flex-grow: 1;">
                <li>
                    <code>progtest.fit.cvut.cz</code>,<br />
                    so you can change the theme of Progtest;
                </li>
                <li>
                    <code>courses.fit.cvut.cz</code>,<br />
                    so you can have a button to go to Courses.
                </li>
            </ul>

            <Button id="permissionBtn" style="width: 100%;">
                <iconify-icon icon="tabler:shield" />
                <p>Grant permissions</p>
            </Button>
        </div>
    {/if}
</main>
