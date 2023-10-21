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
