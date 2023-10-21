export interface ExtensionSettings {
    theme: "automatic" | "orig" | "orig-dark" | "dark" | "light";
    autohideResults: boolean;
    showNotifications: boolean;
    syntaxHighlighting: boolean;
    playSounds: boolean;
}

export const DEFAULT_SETTINGS: ExtensionSettings = {
    theme: "automatic",
    autohideResults: true,
    showNotifications: true,
    syntaxHighlighting: true,
    playSounds: true,
} as const;

export async function migrateSettingNames(): Promise<void> {
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
