# <img alt="P" src="https://raw.githubusercontent.com/keombre/progtest-theme/stable/src/themes/assets/favicon.ico" width="25" />rogtest Themes

[![Chrome Web Store](https://img.shields.io/chrome-web-store/stars/eoofjghfpdplnjhbfflfnfogdjnedgjf)](https://chrome.google.com/webstore/detail/progtest-themes/eoofjghfpdplnjhbfflfnfogdjnedgjf)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/eoofjghfpdplnjhbfflfnfogdjnedgjf)](https://chrome.google.com/webstore/detail/progtest-themes/eoofjghfpdplnjhbfflfnfogdjnedgjf)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/users/eoofjghfpdplnjhbfflfnfogdjnedgjf?label=chrome%20users&logo=google-chrome&logoColor=fff)](https://chrome.google.com/webstore/detail/progtest-themes/eoofjghfpdplnjhbfflfnfogdjnedgjf)
[![GitHub All Releases](https://img.shields.io/github/downloads/keombre/progtest-theme/total?label=firefox%20download&logo=mozilla-firefox&logoColor=fff)](https://github.com/keombre/progtest-theme/releases/latest)
[![CodeFactor](https://www.codefactor.io/repository/github/keombre/progtest-theme/badge)](https://www.codefactor.io/repository/github/keombre/progtest-theme/overview)

**ProgTest Themes** is a WebExtension for Google Chrome and Mozilla Firefox which works as a theme manager for [ProgTest](https://progtest.fit.cvut.cz). It adds other useful features, such as syntax highlighting or notifications.

## Download

[Chrome Web Store](https://chrome.google.com/webstore/detail/progtest-themes/eoofjghfpdplnjhbfflfnfogdjnedgjf)

[Firefox Addon](https://github.com/keombre/progtest-theme/releases/latest)

[Microsoft Edge Addons](https://microsoftedge.microsoft.com/addons/detail/knkajihkihfoadhcgjibkhlhdfdmliem)

## Building from source

In order to build from source, you are going to need `bun`.

The current version of **ProgTest Themes** has been successfully compiled using `bun 1.0.6`.

1. Install all dev dependencies using `bun install`
2. Run `bun dev` to get a hot-reloading version of the extension in `build/`. Alternatively, run `bun build:chrome` or `bun build:firefox` to build it just once (and with the proper manifests; the dev version uses `manifests/debug.json`).
3. Load the extension to your browser
    - `chrome://extensions` in Chrome
    - `about:addons` (if building) / `about:debugging#/runtime/this-firefox` (if developing) in Firefox

## Privacy policy

In short, we don't collect any data, but you can read it in full [here](https://github.com/keombre/progtest-theme/blob/stable/privacy_policy.md).

## Creating new theme

Checkout from [primer branch](https://github.com/keombre/progtest-theme/tree/primer). The project there is restructured to allow multiple theme engines. To see how it all works look at `src/content/end.js` and into `src\themes`.

Good luck!
