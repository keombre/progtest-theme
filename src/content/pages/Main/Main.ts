import { ExtensionSettings } from "../../../settings";
import { Logged } from "../Logged";
import MainComponent from "./Main.svelte";

export type MenuItem = {
    title: string;
    text: string;
    icon: string;
    link: string;
    subjectHomepage?: string;
    footer?: string;
};

export type Subjects = Record<string, MenuItem[]>;

type ParsedItem = Pick<MenuItem, "title" | "text" | "link">;

type CoursesInfo = {
    semester: string;
    generatedAt: string;
    courses: Record<
        string,
        {
            department: number;
            nameCs: string;
            nameEn: string;
            programmeType: string;
            classesLang: string;
            season: string;
            homepage: string;
            grades: string;
            pagesRepo: string;
            active: boolean;
        }
    >;
};

export class Main extends Logged {
    orderC = 1000;
    constructor(settings: ExtensionSettings) {
        super(settings);
    }

    async initialise() {
        await super.initialise();

        const center = document.querySelector<HTMLElement>("body > center");
        if (center) {
            center.style.display = "none";
        }

        // collect all elements
        const items = parseItems();
        if (items.length === 0) {
            if (!center) return;
            center.style.display = "block";
            return;
        }

        // get subject URLs from courses
        const subjectInfo: CoursesInfo = await fetch(
            "https://courses.fit.cvut.cz/data/courses-all.json",
            {
                method: "GET",
                mode: "cors",
                credentials: "omit",
            },
        ).then((response) => response.json());

        const subjects: Subjects = {};
        const settings: MenuItem[] = [];
        items.forEach((item) => {
            const icon = getMenuIcon(item.title);

            // create semester code from subject code
            const semester = item.text.substring(
                item.text.indexOf("(") + 1,
                item.text.indexOf(")"),
            );

            // settings have no semester
            if (semester === "") {
                // overrides
                if (item.title === "FAQ") {
                    item.text = "Často kladené dotazy";
                }
                if (item.title === item.text) {
                    item.text = "";
                }
                settings.push({
                    title: item.title,
                    text: item.text,
                    icon,
                    link: item.link,
                });
                return;
            }

            const footer = "20" + semester;
            const semesterKey = `B${semester.split("/")[0]}${
                semester.includes("ZS") ? 1 : 2
            }`;
            const subjectHomepage =
                subjectInfo.courses[item.title]?.homepage ??
                `https://courses.fit.cvut.cz/${item.title}`;

            if (!subjects[semesterKey]) {
                subjects[semesterKey] = [];
            }
            subjects[semesterKey].push({
                title: item.title,
                text: item.text.substring(0, item.text.indexOf("(")),
                icon,
                link: item.link,
                subjectHomepage,
                footer,
            });
        });

        const container = document.createElement("div");
        document.body.insertBefore(container, center);
        new MainComponent({
            target: container,
            props: { subjects, settings },
        });
    }
}

function parseItems(): ParsedItem[] {
    return [
        ...document.querySelectorAll<HTMLTableRowElement>(
            "body > center > table > tbody > tr",
        ),
    ]
        .map((e: HTMLElement) => {
            const ch = e.children[1]?.children[0]?.children[0]?.children[0];
            if (!(ch instanceof HTMLAnchorElement)) {
                console.error("Subject button not found");
                return null;
            }
            const firstChild = e.children[0];
            if (!(firstChild instanceof HTMLElement)) {
                console.error("Subject name not found");
                return null;
            }
            return {
                title: ch.innerText,
                text: firstChild.innerText,
                link: ch.href,
            };
        })
        .filter((e) => e !== null) as ParsedItem[];
}

function getMenuIcon(title: string) {
    return (
        {
            "BI-AAG": "icon-aag",
            "BI-AG1": "icon-ag1",
            "BI-OSY": "icon-osy",
            "BI-PA1": "icon-pa1",
            "BI-PA2": "icon-pa2",
            "BI-PJV": "icon-pjv",
            "BI-PS1": "icon-ps1",
            "BI-PYT": "icon-pyt",
            "NI-PDP": "icon-pdp",
            Nastavení: "icon-setting",
            Překladače: "icon-compile",
            FAQ: "icon-faq",
        }[title] || "icon-unknown"
    );
}
