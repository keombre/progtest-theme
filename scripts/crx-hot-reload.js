// original source: https://github.com/xpl/crx-hotreload

const filesInDirectory = (dir) =>
    new Promise((resolve) =>
        dir.createReader().readEntries((entries) =>
            Promise.all(
                entries
                    .filter((e) => e.name[0] !== ".")
                    .map((e) =>
                        e.isDirectory
                            ? filesInDirectory(e)
                            : new Promise((resolve) => e.file(resolve)),
                    ),
            )
                .then((files) => [].concat(...files))
                .then(resolve),
        ),
    );

const timestampForFilesInDirectory = (dir) =>
    filesInDirectory(dir).then((files) =>
        files.map((f) => f.name + f.lastModifiedDate).join(),
    );

const reload = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.tabs.reload(tabs[0].id);
        }
        chrome.runtime.reload();
    });
};

let reloadInProgress = false;

const reloadAfterManifest = (dir, force) => {
    if (!force && reloadInProgress) return;
    reloadInProgress = true;
    dir.createReader().readEntries((entries) => {
        if (entries.filter((e) => e.name === "manifest.json").length !== 0) {
            reload();
            reloadInProgress = false;
        } else {
            setTimeout(() => reloadAfterManifest(dir, true), 1000);
        }
    });
};

const watchChanges = (dir, lastTimestamp) => {
    timestampForFilesInDirectory(dir).then((timestamp) => {
        if (!lastTimestamp || lastTimestamp === timestamp) {
            setTimeout(() => watchChanges(dir, timestamp), 1000);
        } else {
            reloadAfterManifest(dir, false);
        }
    });
};

chrome.management.getSelf((self) => {
    if (self.installType === "development") {
        chrome.runtime.getPackageDirectoryEntry((dir) => watchChanges(dir));
    }
});
