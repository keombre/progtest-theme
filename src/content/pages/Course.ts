import { ExtensionSettings } from "../../settings";
import { Logged } from "./Logged";
import { buildLink, getCourseId } from "../utils";

export class Course extends Logged {
    args: URLSearchParams;

    constructor(settings: ExtensionSettings) {
        super(settings);
    }

    async initialise() {
        await super.initialise();
        await Course.GetTasks().then((tasks) => {
            const cts = this.createContainers(tasks);

            const container = document.createElement("div");
            container.classList.add("course_container");

            cts.forEach((e) => container.appendChild(e));
            document.body.replaceChild(
                container,
                document.querySelector("center"),
            );

            document.addEventListener("keydown", (e) => {
                if (e.key == "Escape") {
                    Course.hideModal();
                }
            });

            document.addEventListener("click", () => Course.hideModal());
        });
    }

    static async GetTasks() {
        const page = await fetch(
            buildLink("X=CourseOverview&Cou=" + getCourseId()),
        )
            .then((res) => res.text())
            .catch((e) => {
                console.error("Failed to fetch course overview", e);
            });
        if (!page) return;
        const tree = new DOMParser().parseFromString(page, "text/html");
        const ret = [];
        const scores = [];
        document
            .querySelectorAll("table.topLayout > tbody > tr > .lBox > span")
            .forEach((e) => {
                const row: HTMLElement = e.parentElement.parentElement;
                const taskName: HTMLElement = row.children[1].querySelector(
                    ".menuListDis, .menuList, .menuListEarly",
                );
                const points: HTMLElement =
                    row.childElementCount === 4
                        ? row.children[2].querySelector(
                              ".menuListDis, .menuList, .menuListEarly",
                          )
                        : null;
                const link: HTMLAnchorElement =
                    row.children[row.childElementCount - 1].querySelector(
                        "a.butLink",
                    );
                scores.push({
                    name: taskName?.innerText,
                    score: points?.innerText ?? "--",
                    disabled: e.classList.contains("menuListDis"),
                    link: link?.href,
                });
            });

        tree.querySelectorAll("AssessmentGrp").forEach((e) => {
            const groups = [];
            e.querySelectorAll("TaskGrp, KNTest, ExtraPoints").forEach((f) => {
                if (f.getAttribute("id") === "2600") {
                    // debugger;
                }
                // const origLinkBase = {'TaskGrp': 'TaskGrp', 'KNTest': 'KNT', 'ExtraPoints': 'Extra'}[f.tagName]
                // const origLinkPart = {'TaskGrp': 'Tgr', 'KNTest': 'Knt', 'ExtraPoints': 'Ex'}[f.tagName]
                //
                // if (document.querySelector(`a[href="?X=${origLinkBase}&Cou=${args.Cou}&${origLinkPart}=${f.getAttribute('id')}"]`))
                // link = buildLink(`X=${origLinkBase}&Cou=${args.Cou}&${origLinkPart}=${f.getAttribute('id')}`)

                let type = {
                    taskgrp: "task",
                    kntest: "test",
                    extrapoints: "extra",
                }[f.tagName.toLowerCase()];
                if (
                    type == "test" &&
                    ["Training", "eLearning"].includes(
                        f.getAttribute("assignType"),
                    )
                ) {
                    type = "test-demo";
                }

                let name = f.getAttribute("name");
                if (name.startsWith("Code review")) {
                    name = scores.find((e) => e.name?.startsWith("Code review"))
                        ?.name;
                }
                let link = null;
                let score = 0;
                let disabled = false;
                scores.forEach((g) => {
                    if (
                        g.name === name ||
                        g.name === "Znalostní test - " + name
                    ) {
                        score = g.score;
                        disabled = g.disabled;
                        link = g.link ?? null;
                    }
                });

                groups.push({
                    id: f.getAttribute("id"),
                    name: name,
                    type: type,
                    link: link,
                    opens: new Date(f.getAttribute("openDate") + "+0000"),
                    closes: new Date(f.getAttribute("deadlineDate") + "+0000"),
                    score: score,
                    disabled: disabled,
                });
            });
            ret.push({
                name: e.getAttribute("name"),
                taskGrp: groups,
            });
        });
        return ret;
    }

    createContainers(tasks) {
        const ret = [];

        ret.push(Course.buildResultsLink());

        tasks.forEach((t) => {
            if (t.taskGrp.length == 0) {
                return;
            }
            const elem = document.createElement("div");
            elem.classList.add(`course_grp`);
            elem.appendChild(Course.createTitle(t.name));
            let lastType = t.taskGrp[0].type;
            const prev = [];
            t.taskGrp.forEach((e) => {
                if (e.type == lastType) {
                    prev.push(e);
                } else {
                    elem.appendChild(Course.writeContainerSum(prev));
                    prev.length = 0;
                    prev.push(e);
                    lastType = e.type;
                }
                elem.appendChild(this.createLink(e));
            });
            if (prev.length) {
                elem.appendChild(Course.writeContainerSum(prev));
            }
            ret.push(elem);
        });

        return ret;
    }

    static createTitle(name) {
        const elem = document.createElement("span");
        elem.classList.add("course_title");
        elem.innerText = name;
        return elem;
    }

    static buildResultsLink() {
        const res = document.createElement("div");
        res.classList.add("course_results_grp", "course_grp");

        const lin = document.createElement("a");
        lin.href = buildLink("X=Results&Cou=" + getCourseId()).toString();
        lin.classList.add("course_link");

        const span = document.createElement("span");
        span.classList.add("course_link_name");
        span.innerText = "Výsledky";

        lin.appendChild(span);
        res.appendChild(lin);
        return res;
    }

    createLink(entry) {
        let ret;
        if (entry.link) {
            ret = document.createElement("a");
            ret.href = entry.link;
            if (entry.type == "task") {
                ret.addEventListener("click", this.taskLink.bind(this));
            }
        } else {
            ret = document.createElement("span");
        }

        ret.classList.add("course_link", "course_link_type_" + entry.type);

        if (entry.disabled) {
            ret.classList.add("course_disabled");
        }

        if (entry.closes && entry.score) {
            ret.classList.add(
                Course.isToday(entry.closes) &&
                    (entry.score == "0.00" || entry.score == "--")
                    ? "course_deadline_today"
                    : "course_link",
            );
        }

        // TODO: Fix github security warnings:
        // "DOM text is reinterpreted as HTML without escaping meta-characters."
        // https://github.com/keombre/progtest-theme/security/code-scanning/4
        ret.innerHTML += `<span class="course_link_name">${entry.name}</span>`;
        ret.innerHTML += entry.score
            ? `<span class="course_link_score">${entry.score}</span>`
            : "";
        ret.innerHTML += entry.opens
            ? `<span class="course_link_deadline">${entry.opens.toLocaleDateString(
                  "cs-CZ",
              )}</span><br />`
            : "";
        ret.innerHTML += entry.closes
            ? `<span class="course_link_deadline" style="font-weight: 600">🏁 ${entry.closes.toLocaleDateString(
                  "cs-CZ",
              )} ${entry.closes.toLocaleTimeString("cs-CZ")}</span>`
            : "";
        return ret;
    }

    static isToday(d) {
        const today = new Date();
        return (
            d.getDate() == today.getDate() &&
            d.getMonth() == today.getMonth() &&
            d.getFullYear() == today.getFullYear()
        );
    }

    static writeContainerSum(tasks) {
        let sum = 0;
        tasks.forEach((e) => {
            if (e.score && e.score != "--") {
                sum += parseFloat(e.score);
            }
        });

        const sumElem = document.createElement("span");
        sumElem.innerText = sum.toFixed(2);
        sumElem.classList.add("course_link");
        sumElem.classList.add("course_link_score_sum");
        sumElem.classList.add("course_link_type_" + tasks[0].type);
        return sumElem;
    }

    static hideModal() {
        const modal = document.querySelector(".modal");
        if (modal) {
            modal.classList.remove("modal-show");
            modal.classList.add("modal-hide");
        }
    }

    taskLink(event) {
        // skip middle button & control+click
        if (event.which != 1 || event.ctrlKey) {
            return true;
        }

        let target = event.target;
        while (target.getAttribute("href") == null) {
            target = target.parentElement;
        }
        // only prevent default action if anything
        // is going to be done with the link
        if (this.getTaskGroups(target.getAttribute("href"))) {
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    }

    getTaskGroups(link) {
        if (link.includes("javascript:")) {
            return false;
        }
        Course.displaySpinner();
        fetch(link)
            .then((e) => {
                if (!e.ok || e.redirected) {
                    return Promise.reject();
                }
                return e.text();
            })
            .then(Course.parseTaskGrp.bind(this))
            //.then(this.checkSingleLink.bind(this))
            .then(this.createModal.bind(this))
            .catch(() => {
                window.location.assign(link);
                Course.hideSpinner();
            });
        return true;
    }

    static hideSpinner() {
        const spinner = document.getElementsByClassName("modal-spinner")[0];
        if (spinner) {
            spinner.parentNode.removeChild(spinner);
        }
    }

    static trimDeadline(text) {
        if (text.includes(" 23:59:59")) {
            return text.substr(0, text.lastIndexOf(" "));
        }
        return text;
    }

    static displaySpinner() {
        const spinner = document.createElement("div");
        spinner.classList.add("modal-spinner");
        document.body.insertBefore(
            spinner,
            document.querySelector(".course_container"),
        );
    }
    /*
        // not stable enough
        checkSingleLink(data) {
            if (data.tasks.length == 1)
                window.location.assign(data.tasks[0].link)
            Promise.resolve(data)
        }
    */
    createModal(data) {
        // create/get modal
        let modal = document.querySelector(".modal");
        if (modal == null) {
            modal = document.createElement("div");
            modal.classList.add("modal");
            document.body.insertBefore(
                modal,
                document.querySelector(".course_container"),
            );
        }
        modal.innerHTML = "";
        modal.classList.remove("modal-hide");
        modal.classList.add("modal-show");
        const modalClose = document.createElement("div");
        modalClose.classList.add("modal-close");
        modalClose.innerText = "✖️";
        modalClose.addEventListener("click", Course.hideModal.bind(this));
        modal.appendChild(modalClose);

        const modalHeader = document.createElement("div");
        modalHeader.classList.add("modal-header");
        modalHeader.innerHTML = `
<div class="modal-title">${data.info.title}</div>
<div class="modal-score">
    <span class="modal-score-my">${data.info.score}</span><span class="modal-score-max">${data.info.scoreMax}</span>
</div>
<div class="modal-deadline">
    <span class="modal-deadline-norm">${data.info.deadline}</span><span class="modal-deadline-late">${data.info.lateDeadline}</span>
</div>
`;
        modal.appendChild(modalHeader);
        const modalBody = document.createElement("div");
        modalBody.classList.add("modal-body");
        data.tasks.forEach((task) => {
            const modalLine = document.createElement("a");
            modalLine.classList.add("modal-line");
            modalLine.href = task.link;
            modalLine.innerHTML = `
<div class="mtask-title">${task.title}</div>
<div class="mtask-sub">
    <span class="mtask-sub-my">${task.sub}</span><span class="mtask-sub-max">/${task.subMax} </span><span class="mtask-sub-pen">(+${task.subPen})</span>
</div>
<div class="mtask-score">
    <span class="mtask-score-my">${task.score}</span><span class="mtask-score-max">${task.scoreMax}</span>
</div>
<div class="mtask-text">${task.text}</div>
`;
            modalBody.appendChild(modalLine);
        });
        Course.hideSpinner();
        modal.appendChild(modalBody);
    }

    // TODO: Fix github security warnings:
    // "Incomplete multi-character sanitization"
    // https://github.com/keombre/progtest-theme/security/code-scanning/6
    static parseTaskGrp(text) {
        // sanitize page
        text = text.replace(/<script[^>]*>([\S\s]*?)<\/script>/gim, "");
        const doc = new DOMParser().parseFromString(text, "text/html");

        /* data schema
        {
            'info': {
                'title': '',
                'deadline': '',
                'lateDeadline': '',
                'lateDeadlineInfo': '',
                'score': '',
                'scoreMax': '',
                'scoreInfo': ''
            },
            'tasks': [
                {
                    'title': '',
                    'link': '',
                    'text': '',
                    'sub': '',
                    'subMax': '',
                    'subPen': '',
                    'score': '',
                    'scoreMax': ''
                }
            ]
        }
        */

        const data = { info: {}, tasks: [] };

        // gather global task info
        data.info["title"] = doc
            .querySelector<HTMLElement>("body > center")
            .innerText.trim();
        data.info["deadline"] = Course.trimDeadline(
            doc.querySelector<HTMLElement>(
                "#maintable > tbody > tr:nth-child(1) > td.tCell",
            ).innerText,
        );
        const deadline = doc.querySelector<HTMLElement>(
            "#maintable > tbody > tr:nth-child(2) > td.rCell > b",
        );
        let score: string;
        if (deadline) {
            data.info["lateDeadline"] =
                "(" + Course.trimDeadline(deadline.innerText) + ")";
            data.info["lateDeadlineInfo"] = doc
                .querySelector<HTMLElement>(
                    "#maintable > tbody > tr:nth-child(2) > td.rCell",
                )
                .innerText.slice(data.info["lateDeadline"].length + 2, -1);
            score = doc.querySelector<HTMLElement>(
                "#maintable > tbody > tr:nth-child(3) > td.rbCell > b",
            ).innerText;
        } else {
            data.info["lateDeadline"] = "";
            data.info["lateDeadlineInfo"] = "";
            score = doc.querySelector<HTMLElement>(
                "#maintable > tbody > tr:nth-child(2) > td.rbCell > b",
            ).innerText;
        }
        const scoreDivPos = score.indexOf("/");
        data.info["score"] = score.substr(0, scoreDivPos - 3);
        data.info["scoreMax"] = score.slice(scoreDivPos + 2, -2);
        data.info["scoreInfo"] = doc
            .querySelector<HTMLElement>(
                "#maintable > tbody > tr:nth-child(3) > td.rbCell",
            )
            .innerText.slice(score.length + 2, -1);

        // gather info about individual assignments
        doc.querySelectorAll("#maintable").forEach((e, i) => {
            // Why are there multiple elements with same id?! :-(
            if (!i) {
                return;
            }
            const task = {};
            task["title"] = e.querySelector<HTMLElement>(
                "tbody > tr:nth-child(1) > td.tbSepCell",
            ).innerText;
            task["link"] = e.querySelector<HTMLAnchorElement>(
                "tbody > tr:nth-child(5) > td > div > div > a",
            ).href;
            task["text"] = e.querySelector<HTMLElement>(
                "tbody > tr:nth-child(4) > td",
            ).innerText;
            const subms = e.querySelector<HTMLElement>(
                "tbody > tr:nth-child(2) > td.rtCell",
            ).innerText;
            const submsSl = subms.indexOf("/"),
                submsPl = subms.indexOf("+");
            task["sub"] = subms.substr(0, submsSl - 1);
            task["subMax"] = subms.substr(submsSl + 2, submsPl - submsSl - 3);
            task["subPen"] = subms.substr(submsPl + 2);
            const taskScore = e.querySelector<HTMLElement>(
                "tbody > tr:nth-child(3) > td.rbCell",
            ).innerText;
            const taskScoreDiv = taskScore.indexOf("/");
            task["score"] = taskScore.substr(0, taskScoreDiv - 3);
            task["scoreMax"] = taskScore.slice(taskScoreDiv + 2, -2);

            data.tasks.push(task);
        });

        return Promise.resolve(data);
    }
}
