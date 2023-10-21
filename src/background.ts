import { MessageType } from "./messages";
import { DEFAULT_SETTINGS } from "./settings";

async function migrateSettingNames(): Promise<void> {
    return new Promise((resolve) => {
        chrome.storage.sync.get(
            [
                "selectedTheme",
                "autoHide",
                "notifications",
                "highlighting",
                "sounds",
            ],
            function (items) {
                if (items === undefined) {
                    return resolve();
                }
                if (items.selectedTheme) {
                    items.theme = items.selectedTheme;
                    delete items.selectedTheme;
                }
                if (items.autoHide) {
                    items.autohideResults = items.autoHide;
                    delete items.autoHide;
                }
                if (items.notifications) {
                    items.showNotifications = items.notifications;
                    delete items.notifications;
                }
                if (items.highlighting) {
                    items.syntaxHighlighting = items.highlighting;
                    delete items.highlighting;
                }
                if (items.sounds) {
                    items.playSounds = items.sounds;
                    delete items.sounds;
                }
                chrome.storage.sync.set(items, resolve);
            },
        );
    });
}

const syncSettings = async () => {
    console.log("Syncing PTT settings");
    const localSettings = await chrome.storage.local.get(DEFAULT_SETTINGS);
    const syncSettings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
    console.log("localSettings", localSettings);
    console.log("syncSettings", syncSettings);
    if (localSettings !== syncSettings) {
        if (
            localSettings === DEFAULT_SETTINGS &&
            syncSettings !== DEFAULT_SETTINGS
        ) {
            await chrome.storage.sync.set(localSettings);
        }
        if (
            localSettings !== DEFAULT_SETTINGS &&
            syncSettings === DEFAULT_SETTINGS
        ) {
            await chrome.storage.local.set(syncSettings);
        }
    }
};

chrome.runtime.onInstalled.addListener(async () => {
    await migrateSettingNames();
    syncSettings();
});
chrome.runtime.onStartup.addListener(async () => {
    await migrateSettingNames();
    syncSettings();
});
chrome.storage.sync.onChanged.addListener(syncSettings);
chrome.storage.local.onChanged.addListener(syncSettings);

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    console.log("message", message);
    if (message.type === MessageType.GET_SETTINGS) {
        chrome.storage.local.get(DEFAULT_SETTINGS, (settings) => {
            sendResponse(settings);
        });
    }
    return true;
});
