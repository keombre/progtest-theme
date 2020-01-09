'use strict';

const args = window.location.search.substr(1).split("&").reduce((f, e) => {
    let k = e.split("=")
    f[k[0]] = k[1]
    return f
}, {})

let parser

const preload = () => {

    let base
    if (theme == 'light' || theme == 'dark')
        base = NewStyle
    else if (theme == 'primer-light' || theme == 'primer-dark')
        base = Primer

    document.body.removeAttribute('bgcolor')
    document.body.removeAttribute('text')

    // 404
    if (document.body.innerHTML == "")
        parser = new base.Err404()
    // login
    else if (document.querySelector('select[name=UID_UNIVERSITY]') != null)
        parser = new base.Login()
    else if ('X' in args)
        switch (args['X']) {
            case "FAQ":
            case "Preset":
            case "CompilersDryRuns":
            case "Extra":
            case "KNT":
            case "TaskGrp":
                parser = new base.Logged()
                break
            case "KNTQ":
                parser = new base.Exam()
                break
            case "Course":
                parser = new base.Course()
                break
            case "Results":
                parser = new base.Results()
                break
            case "Compiler":
            case "DryRun":
            case "Task":
            case "TaskU":
                parser = new base.Task()
                break
            case "Main":
                parser = new base.Main()
                break
            default:
                // determine if site is really main
                let navlink = document.querySelector("span.navlink") // first time login
                if (
                    document.querySelector('span.navLink > a.navLink[href="?X=Main"]') || (
                        navlink && navlink.innerText.includes("Než")
                    ))
                    parser = new base.Logged()
                else
                    parser = new base.Main()

        }
    else
        parser = new base.Main()
}

if (!settingsLoaded)
    window.addEventListener('ppt-loaded', preload)
else
    preload()
