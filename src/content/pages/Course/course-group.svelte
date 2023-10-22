<script lang="ts">
    import { CourseGroup, CourseItem, isToday } from "./Course";
    import cx from "classnames";

    export let group: CourseGroup;
    export let onTaskClick: (event: MouseEvent, entry: CourseItem) => boolean;

    const itemsByType = Object.entries(
        group.taskGrp.reduce(
            (acc, curr) => {
                if (acc[curr.type] === undefined) {
                    acc[curr.type] = [];
                }
                acc[curr.type].push(curr);
                return acc;
            },
            {} as Record<string, CourseItem[]>,
        ),
    );
    const sum = (entries: CourseItem[]) =>
        entries.reduce((acc, curr) => acc + curr.score ?? 0, 0);

    const onEntryClick = (event: MouseEvent, entry: CourseItem) => {
        if (!entry.link || entry.link.startsWith("javascript:")) {
            event.preventDefault();
            return false;
        }
        if (entry.type === "task") {
            return onTaskClick(event, entry);
        }
    };
</script>

{#if group.taskGrp.length > 0}
    <div class="course_grp">
        <span class="course_title">{group.name}</span>
        {#each itemsByType as [_type, items]}
            {#each items as entry}
                <a
                    href={entry.link}
                    class={cx("course_link", `course_link_type_${entry.type}`, {
                        course_disabled: entry.disabled,
                        course_deadline_today:
                            isToday(entry.closes) && entry.score === 0,
                    })}
                    on:click={(event) => onEntryClick(event, entry)}
                >
                    <span class="course_link_name">{entry.name}</span>
                    {#if entry.score !== undefined}
                        <span class="course_link_score"
                            >{entry.score === null
                                ? "--"
                                : entry.score.toFixed(2)}</span
                        >
                    {/if}
                    {#if entry.opens}
                        <span class="course_link_deadline"
                            >{entry.opens.toLocaleDateString("cs-CZ")}</span
                        >
                        <br />
                    {/if}
                    {#if entry.bonusEnd}
                        <span class="course_link_deadline"
                            >🚀 {entry.bonusEnd.toLocaleString("cs-CZ")} /
                        </span>
                    {/if}
                    {#if entry.closes}
                        <span
                            class="course_link_deadline"
                            style="font-weight: 600"
                            >🏁 {entry.closes.toLocaleString("cs-CZ")}</span
                        >
                    {/if}
                </a>
            {/each}
            <span
                class={cx(
                    "course_link course_link_score_sum",
                    `course_link_type_${items[0].type}`,
                )}>{sum(items).toFixed(2)}</span
            >
        {/each}
    </div>
{/if}

<style>
    .course_grp {
        border-radius: 5px;
        box-shadow: 0 2px 4px -2px rgba(0, 0, 0, 0.25);
        height: fit-content;
        overflow: hidden;
    }

    span.course_title {
        display: block;
        font-size: 18pt;
        font-weight: 100;
        border-bottom: 1px solid #37474f;
        padding: 7px 0 7px 11px;
        color: #fff;
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.4);
        background: #45535a;
    }

    .course_link {
        display: block;
        font-size: 13pt;
        position: relative;
        padding: 6px 0 6px 6px;
        border-left: 3px solid transparent;
        font-weight: 500;
    }

    span.course_link_score_sum:before {
        content: "Σ = ";
    }

    span.course_link_score_sum {
        text-align: right;
        padding: 2px 14px 2px 0;
        background: rgba(0, 0, 0, 0.1);
    }

    .course_link.course_disabled {
        font-weight: 400;
    }

    span.course_link_name {
        display: block;
        margin-right: 72px;
    }

    span.course_link_score {
        position: absolute;
        right: 8px;
        top: 4px;
        font-weight: 400;
        color: #fff;
        background: #45535a;
        border-radius: 9px;
        padding: 4px 8px;
    }

    .course_link.course_disabled span.course_link_deadline {
        text-decoration: line-through;
    }

    span.course_link_deadline {
        font-weight: 100;
        font-size: 10pt;
        color: #a0a0a0;
    }

    .course_tasks_grp {
        order: 2;
    }

    .course_tests_grp {
        order: 3;
    }

    .course_sem_grp {
        order: 4;
    }

    .course_extras_grp {
        order: 5;
    }

    .course_tasks_extra_grp {
        order: 6;
    }

    .course_exams_grp {
        order: 7;
    }

    .course_unknown_grp {
        order: 8;
    }

    .course_link_type_task {
        border-color: #4caf50;
    }

    .course_link_type_test-demo {
        border-color: #2196f3;
    }

    .course_link_type_extra {
        border-color: #fb8c00;
    }

    .course_link_type_test {
        border-color: #9c27b0;
    }

    .course_link_type_task.course_link_score_sum {
        background-color: rgba(76, 175, 80, 0.3) !important;
    }

    .course_link_type_test-demo.course_link_score_sum {
        background-color: rgba(33, 150, 243, 0.3) !important;
    }

    .course_link_type_extra.course_link_score_sum {
        background-color: rgba(251, 140, 0, 0.3) !important;
    }

    .course_link_type_test.course_link_score_sum {
        background-color: rgba(156, 39, 176, 0.3) !important;
    }

    .course_deadline_today {
        background-color: #ffc107 !important;
    }

    .course_deadline_today:hover {
        background-color: #ffb300 !important;
    }
</style>
