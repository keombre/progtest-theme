<script lang="ts">
    import { buildLink, getCourseId } from "../../utils";
    import { CourseGroup, CourseItem, TaskItem, parseTaskGrp } from "./Course";
    import CourseGroupComponent from "./course-group.svelte";
    import TaskModal from "./task-modal.svelte";

    let courseId: string = getCourseId();
    export let courseGroups: CourseGroup[] = [];
    let taskItem: Promise<TaskItem> | null = null;
    let showModal = false;

    const onTaskClick = (event: MouseEvent, item: CourseItem) => {
        console.log(item);

        taskItem = fetch(item.link)
            .then((r) => {
                if (!r || r.redirected) {
                    return Promise.reject();
                }
                return r.text();
            })
            .then(parseTaskGrp)
            .catch((e) => {
                if (item.link) {
                    window.location.assign(new URL(item.link));
                }
                console.error(e);
                return Promise.reject(e);
            });
        showModal = true;
        event.preventDefault();
        return false;
    };
</script>

<main class="course_container">
    <div class="course_results_grp course_grp">
        <a
            href={buildLink(`X=Results&Cou=${courseId}`).toString()}
            class="course_link"
        >
            <span class="course_link_name">Výsledky</span>
        </a>
    </div>
    {#each courseGroups as group}
        <CourseGroupComponent {group} {onTaskClick} />
    {/each}
    {#if taskItem}
        <TaskModal task={taskItem} bind:showModal />
    {/if}
</main>

<style>
    .course_container {
        display: grid;
        grid-gap: 20px 35px;
        grid-template-columns: repeat(4, 330px);
        justify-content: center;
    }

    @media only screen and (max-width: 1500px) {
        .course_container {
            grid-template-columns: repeat(3, 330px);
        }
    }

    @media only screen and (max-width: 1150px) {
        .course_container {
            grid-template-columns: repeat(2, 330px);
        }
    }

    @media only screen and (max-width: 750px) {
        .course_container {
            grid-template-columns: repeat(1, 330px);
        }
    }

    .course_grp {
        border-radius: 5px;
        box-shadow: 0 2px 4px -2px rgba(0, 0, 0, 0.25);
        height: fit-content;
        overflow: hidden;
    }

    .course_link {
        display: block;
        font-size: 13pt;
        position: relative;
        padding: 6px 0 6px 6px;
        border-left: 3px solid transparent;
        font-weight: 500;
    }

    span.course_link_name {
        display: block;
        max-width: calc(100% - 75px);
    }

    .course_results_grp {
        order: 1;
        grid-row: 1;
        grid-column-end: -1;
        grid-column-start: 1;
        padding-bottom: 0;
    }

    .course_results_grp .course_link_name {
        text-align: center;
    }

    .course_results_grp .course_link_name::before {
        content: "🏆";
        margin-right: 7px;
    }
</style>
