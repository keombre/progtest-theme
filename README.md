# ProgTest Themes

**ProgTest Themes** is a WebExtension for Google Chrome and Mozilla Firefox which works as a theme manager for [ProgTest](https://progtest.fit.cvut.cz). It also adds other useful features to ProgTest, such as syntax highlighting or notifications.

## Download

[Chrome Web Store](https://chrome.google.com/webstore/detail/progtest-themes/eoofjghfpdplnjhbfflfnfogdjnedgjf)

[~~Firefox Addons~~]() Coming soon

## Building from source

In order to build from source, you are going to need `npm` and `make`.

The current version of **ProgTest Themes** has been successfully compiled using `nodejs 12.12.0`, `npm 6.12.0` and `GNU Make 4.2.1`.

1. Install all dev dependencies using `npm install`
2. Run `make zip` to create an extension zip file in `web-ext-artifacts/` (Note: all code that is packaged in the zip file can also be found in the `build/` directory)
3. Import the zip file into the browser of your choice (Note: for Firefox, you need to either use `about:debugging` to temporarily install the extension or modify `applications.gecko.id` in `manifest.json` and sign the extension yourself)