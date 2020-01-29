'use strict'

const packageJSONPath = "package.json"
const chromeJSONPath  = "manifests/chrome.json"
const firefoxJSONPath = "manifests/firefox.json"
const updateJSONPath = "update.json"

const updateLink = "https://github.com/keombre/progtest-theme/releases/download/{version}/progtest_themes-{version}-an+fx.xpi"

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const root = __dirname + "/../"

let file = fs.readFileSync(path.normalize(root + packageJSONPath))
let pkg = JSON.parse(file)

rl.write("Current package version is: " + pkg.version + "\n")
rl.question('Do you want to update? (y/N) ', (answer) => {
    if (answer[0] == "y" || answer[0] == "Y")
        updateVersion()
    else {
        rl.write("Goodbye\n")
        rl.close()
    }
})

const updateVersion = () => {
    rl.question('Please type in new version: ', (version) => {
        pkg.version = version
        fs.writeFileSync(path.normalize(root + packageJSONPath), JSON.stringify(pkg, null, 4))

        rl.write("Updated global version\n")

        let chrome = JSON.parse(fs.readFileSync(path.normalize(root + chromeJSONPath)))
        chrome.version = version
        fs.writeFileSync(path.normalize(root + chromeJSONPath), JSON.stringify(chrome, null, 4))

        rl.write("Updated chrome version\n")

        let firefox = JSON.parse(fs.readFileSync(path.normalize(root + firefoxJSONPath)))
        firefox.version = version
        fs.writeFileSync(path.normalize(root + firefoxJSONPath), JSON.stringify(firefox, null, 4))

        rl.write("Updated firefox version\n")

        let updateInfo = JSON.parse(fs.readFileSync(path.normalize(root + updateJSONPath)))
        if (updateInfo.addons["progtest-themes@keombre"].updates.filter(upd => upd.version == version).length === 0) {
            updateInfo.addons["progtest-themes@keombre"].updates.push({
                version,
                update_link: updateLink.replace(/{version}/g, version)
            })
            fs.writeFileSync(path.normalize(root + updateJSONPath), JSON.stringify(updateInfo, null, 4))
            rl.write("Added new entry to update.json\n")
        } else {
            rl.write("Version found in update.json\n")
        }

        rl.write("Update finished\n")
        rl.close()
    })
}
