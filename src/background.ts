import { MessageType } from "./messages";
import {
    DEFAULT_SETTINGS,
    ExtensionSettings,
    migrateSettingNames,
} from "./settings";

let settings: ExtensionSettings | undefined;

const updateConfig = async () => {
    console.log("updateConfig");
    chrome.storage.sync.get(DEFAULT_SETTINGS, (syncedSettings) => {
        console.log("syncedSettings", syncedSettings);
        settings = (syncedSettings as ExtensionSettings) || DEFAULT_SETTINGS;
    });
};

chrome.runtime.onInstalled.addListener(async () => {
    await migrateSettingNames();
    updateConfig();
});
chrome.runtime.onStartup.addListener(async () => {
    await migrateSettingNames();
    updateConfig();
});
chrome.storage.onChanged.addListener(updateConfig);

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    console.log("message", message, settings);
    if (message.type === MessageType.GET_SETTINGS) {
        sendResponse(settings);
    }
    return true;
});

chrome.webRequest.onBeforeRequest.addListener(
    () => {
        if (!settings?.theme) {
            throw new Error("Theme not loaded");
        }
        if (settings.theme == "orig") {
            return { cancel: false };
        }
        return {
            redirectUrl: chrome.runtime.getURL(`themes/${settings.theme}.css`),
        };
    },
    {
        urls: [
            "*://progtest.fit.cvut.cz/css.css",
            "*://ptmock.localhost/css.css",
        ],
    },
    ["blocking"],
);
