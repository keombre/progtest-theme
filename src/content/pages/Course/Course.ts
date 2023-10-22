import { ExtensionSettings } from "../../../settings";
import { Logged } from "../Logged";
import { buildLink, getCourseId } from "../../utils";
import CourseComponent from "./Course.svelte";

export interface CourseItem {
    id: string;
    name: string;
    type: string;
    link: string | undefined;
    opens: Date;
    bonusEnd: Date | undefined;
    closes: Date;
    score: number | undefined;
    disabled: boolean;
}

export interface CourseGroup {
    name: string;
    taskGrp: CourseItem[];
}

export class Course extends Logged {
    constructor(settings: ExtensionSettings) {
        super(settings);
    }

    async initialise() {
        await super.initialise();

        const center = document.querySelector<HTMLElement>("body > center");
        if (center) {
            center.style.display = "none";
        }

        const tasks = await GetTasks();

        const container = document.createElement("div");
        document.body.insertBefore(container, center);
        new CourseComponent({
            target: container,
            props: { courseGroups: tasks },
        });
    }
}

export async function GetTasks() {
    const page = await fetch(buildLink("X=CourseOverview&Cou=" + getCourseId()))
        .then((res) => res.text())
        .catch((e) => {
            console.error("Failed to fetch course overview", e);
        });
    if (!page) return;
    const tree = new DOMParser().parseFromString(page, "text/html");
    const ret: CourseGroup[] = [];
    const scores: Partial<CourseItem>[] = [];
    document
        .querySelectorAll("table.topLayout > tbody > tr > .lBox > span")
        .forEach((e) => {
            const row = e.parentElement?.parentElement;
            const taskName = row?.children[1]?.querySelector<HTMLElement>(
                ".menuListDis, .menuList, .menuListEarly",
            );
            const bonusEnd =
                row?.children[1]?.querySelector<HTMLElement>(
                    ".mBox span + div",
                );
            const points =
                row?.childElementCount === 4
                    ? row.children[2].querySelector<HTMLElement>(
                          ".menuListDis, .menuList, .menuListEarly",
                      )
                    : null;
            const link =
                row?.children[
                    row.childElementCount - 1
                ].querySelector<HTMLAnchorElement>("a.butLink");

            const bonusEndLine = bonusEnd?.textContent
                ?.trim()
                .split("\n")
                .find((line) => line.includes("Včasné odevzdání"))
                ?.trim();

            if (!taskName) return;
            scores.push({
                name: taskName?.innerText,
                score: points ? parseFloat(points?.innerText) : undefined,
                bonusEnd: bonusEndLine
                    ? textToDate(
                          bonusEndLine
                              .substring(bonusEndLine.indexOf(":") + 1)
                              .trim(),
                      )
                    : undefined,
                disabled: e.classList.contains("menuListDis"),
                link: link?.href ?? "",
            });
        });

    tree.querySelectorAll("AssessmentGrp").forEach((e) => {
        const groups: CourseItem[] = [];
        e.querySelectorAll("TaskGrp, KNTest, ExtraPoints").forEach((f) => {
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
                    f.getAttribute("assignType") ?? "",
                )
            ) {
                type = "test-demo";
            }

            let name = f.getAttribute("name") || undefined;
            if (name?.startsWith("Code review")) {
                name = scores.find((e) => e.name?.startsWith("Code review"))
                    ?.name;
            }
            let link: string | undefined = undefined;
            let bonusEnd: Date | undefined = undefined;
            let score = 0;
            let disabled = false;
            scores.forEach((g) => {
                if (g.name === name || g.name === "Znalostní test - " + name) {
                    score = g.score || score;
                    bonusEnd = g.bonusEnd || bonusEnd;
                    disabled = g.disabled || disabled;
                    link = g.link || link;
                }
            });

            const id = f.getAttribute("id");
            if (!id || !name || !type) {
                throw new Error(
                    "Missing required properties: " +
                        JSON.stringify([id, name, type]),
                );
            }
            groups.push({
                id,
                name,
                type,
                link: link,
                opens: new Date(f.getAttribute("openDate") + "+0000"),
                bonusEnd: bonusEnd,
                closes: new Date(f.getAttribute("deadlineDate") + "+0000"),
                score: score,
                disabled: disabled,
            });
        });
        const name = e.getAttribute("name");
        if (!name) {
            throw new Error(
                "Missing required group name: " + JSON.stringify(name),
            );
        }
        ret.push({
            name,
            taskGrp: groups,
        });
    });
    return ret;
}

export function isToday(d: Date) {
    const today = new Date();
    return (
        d.getDate() == today.getDate() &&
        d.getMonth() == today.getMonth() &&
        d.getFullYear() == today.getFullYear()
    );
}

/**
 * [title]
 *
 * Termín odevzdání: [deadline]
 *
 * Termín odevzdání s penalizací: <b>[lateDeadline]</b> [lateDeadlineInfo]
 *
 * Hodnocení: <b>[score] / [scoreMax]</b> [scoreInfo]
 */
export interface TaskItemInfo {
    title: string;
    deadline: Date;
    lateDeadline: Date | undefined;
    lateDeadlineInfo: string | undefined;
    score: number;
    scoreMax: number;
    scoreInfo: string | undefined;
}

/**
 * Vybraná / zadaná úloha: [title]
 *
 * Odevzdaná řešení: [submissions] / [submissionsMax] + [submissionsWithPenalty]
 *
 * Hodnocení: [score] / [scoreMax]
 */
export interface TaskItemTask {
    title: string;
    link: string;
    text: string;
    submissions: number | null;
    submissionsMax: number | null;
    submissionsWithPenalty: number | null;
    score: number;
    scoreMax: number;
}

export interface TaskItem {
    info: TaskItemInfo;
    tasks: TaskItemTask[];
}

function isDateValid(date: Date) {
    return !isNaN(date.getTime());
}

function textToDate(text: string | null): Date {
    if (!text) {
        throw new Error("Failed to parse date");
    }
    // parse "DD.MM.YYYY HH:MM:SS"
    const [date, time] = text.split(" ") ?? [];
    const [day, month, year] = (date.split(".") ?? []).map((s) => parseInt(s));
    const [hour, minute, second] = (time?.split(":") ?? []).map((s) =>
        parseInt(s),
    );
    const parsedDate = new Date(year, month - 1, day, hour, minute, second);
    if (!isDateValid(parsedDate)) {
        throw new Error(`Failed to parse date: ${text}\n
        ${JSON.stringify([day, month, year, hour, minute, second])}`);
    }
    return parsedDate;
}

function parseItemInfo(document: Document): TaskItemInfo {
    const title = document.querySelector("td.header")?.textContent?.trim();

    const deadlineText = document
        .querySelector("#maintable")
        ?.querySelector("tr > td + td.tCell")?.textContent;
    if (deadlineText === undefined) {
        throw new Error("Failed to parse deadline");
    }
    const deadline = textToDate(deadlineText);

    const lateDeadlineEl = document
        .querySelector("#maintable")
        ?.querySelector("tr > td + td.rCell");
    const lateDeadlineText = lateDeadlineEl?.querySelector("b")?.textContent;
    const lateDeadline = lateDeadlineText
        ? textToDate(lateDeadlineText)
        : undefined;
    const lateDeadlineInfo = lateDeadlineEl
        ? (lateDeadlineEl.textContent ?? "")
              .replace(lateDeadlineEl.querySelector("b")?.textContent ?? "", "")
              .trim()
        : undefined;

    const scoreEl = document
        .querySelector("#maintable")
        ?.querySelector("tr > td + td.rbCell");
    const scoreText = scoreEl?.querySelector("b")?.textContent;
    const [score, scoreMax] = (scoreText?.split("/") ?? []).map(parseFloat);
    const scoreInfo = scoreEl?.textContent
        ?.replace(scoreEl.querySelector("b")?.textContent ?? "", "")
        .trim();

    if (!title) {
        throw new Error("Failed to parse course item title");
    }
    return {
        title,
        deadline,
        lateDeadline,
        lateDeadlineInfo,
        score,
        scoreMax,
        scoreInfo,
    };
}

function parseItemTasks(document: Document): TaskItemTask[] {
    const tasks: TaskItemTask[] = [];
    const taskEls = document.querySelectorAll("table#maintable");
    taskEls.forEach((val, key) => {
        // skip first as that one contains ItemInfo
        if (key === 0) return;

        const title = val.querySelector("tr > td + td")?.textContent;
        const link = val.querySelector<HTMLAnchorElement>(
            "tr + tr + tr + tr + tr a:last-child",
        )?.href;
        const text = val
            .querySelector("tr + tr + tr + tr")
            ?.textContent?.trim();

        const submissionsText =
            val.querySelector("tr + tr > td + td")?.textContent;

        const [
            submissions = null,
            submissionsMax = null,
            submissionsWithPenalty = null,
        ] = (submissionsText?.split("/") ?? [])
            .flatMap((s) => s.split("+"))
            .map((s) => {
                s = s.trim();
                if (s === "-") {
                    return null;
                }
                return parseInt(s);
            });

        const scoreText = val.querySelector("tr + tr + tr > td + td")
            ?.textContent;
        const [score, scoreMax] = (scoreText?.split("/") ?? []).map(parseFloat);

        if (!title || !link || !text) {
            throw new Error(
                "Failed to parse item task: " +
                    JSON.stringify({ title, link, text }),
            );
        }
        tasks.push({
            title,
            link,
            text,
            submissions,
            submissionsMax,
            submissionsWithPenalty,
            score,
            scoreMax,
        });
    });
    return tasks;
}

export async function parseTaskGrp(text: string): Promise<TaskItem> {
    const doc = new DOMParser().parseFromString(text, "text/html");
    return { info: parseItemInfo(doc), tasks: parseItemTasks(doc) };
}
