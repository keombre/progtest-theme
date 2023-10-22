<script lang="ts">
    import { fade } from "svelte/transition";
    import { TaskItem } from "./Course";
    import { onMount } from "svelte";

    export let task: Promise<TaskItem>;
    export let showModal = false;

    const close = () => {
        showModal = false;
    };

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape" && showModal) {
            close();
        }
    };

    const onClickOutside = (event: MouseEvent) => {
        if (
            showModal &&
            (event.target as Element).closest("a") === null &&
            (event.target as Element).closest(".dialog") === null
        ) {
            close();
            event.preventDefault();
            return false;
        }
        return true;
    };

    onMount(() => {
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("click", onClickOutside);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("click", onClickOutside);
        };
    });
</script>

{#if showModal}
    <div class="dialog" transition:fade={{ duration: 150 }}>
        {#await task then data}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
                on:click|stopPropagation
                class="modal"
                transition:fade={{ duration: 150 }}
            >
                <div class="modal-close" on:click={close}>✖️</div>

                <div class="modal-header">
                    <div class="modal-title">
                        {data.info.title}
                    </div>
                    <div class="modal-score">
                        <span class="modal-score-my">
                            {data.info.score.toFixed(2)}
                        </span>
                        <span class="modal-score-max">
                            {data.info.scoreMax.toFixed(2)}
                        </span>
                    </div>
                    <div class="modal-deadline">
                        <span class="modal-deadline-norm">
                            {data.info.deadline.toLocaleString("cs-CZ")}
                        </span>
                        {#if data.info.lateDeadline}
                            <span class="modal-deadline-late">
                                {data.info.lateDeadline.toLocaleString("cs-CZ")}
                            </span>
                        {/if}
                    </div>
                </div>
                <div class="modal-body">
                    {#each data.tasks as task}
                        <a href={task.link} class="modal-line">
                            <div class="mtask-title">{task.title}</div>
                            <div class="mtask-sub">
                                <span class="mtask-sub-my"
                                    >{task.submissions ?? "-"}</span
                                >
                                <span class="mtask-sub-max"
                                    >/ {task.submissionsMax ?? "-"}</span
                                >
                                {#if task.submissions !== null}
                                    <span class="mtask-sub-pen"
                                        >(+{task.submissions})</span
                                    >
                                {/if}
                            </div>
                            <div class="mtask-score">
                                <span class="mtask-score-my"
                                    >{task.score.toFixed(2)}</span
                                >
                                <span class="mtask-score-max"
                                    >{task.scoreMax.toFixed(2)}</span
                                >
                            </div>
                            <div class="mtask-text">
                                {task.text}
                            </div>
                        </a>
                    {/each}
                </div>
            </div>
        {/await}
    </div>
{/if}

<style>
    .dialog {
        position: fixed;
        top: 0;
        left: 0;
        height: 0;
        width: 0;
    }

    @keyframes fade {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    /* common.css */

    .modal {
        position: fixed;
        top: 150px;
        width: 50%;
        left: 25%;
        min-height: 100px;
        z-index: 50;
        border-radius: 5px;
        overflow: hidden;
    }

    .modal-show {
        animation: 0.2s modal-slide;
    }

    .modal-hide {
        animation: 0.2s modal-slide-reverse running;
        visibility: hidden;
    }

    .modal-body {
        max-height: calc(100vh - 280px);
        overflow-y: auto;
    }

    .modal-spinner {
        position: absolute;
        top: calc(50% - 100px);
        left: calc(50% - 100px);
        width: 200px;
        height: 200px;
        z-index: 99;
    }

    /* need another keyframe to restart animation */
    @keyframes modal-slide-reverse {
        0% {
            opacity: 1;
            transform: translate(0, 0);
            visibility: visible;
        }
        99% {
            visibility: visible;
        }
        100% {
            visibility: hidden;
            opacity: 0;
            transform: translate(0, -10px);
        }
    }

    @keyframes modal-slide {
        0% {
            opacity: 0;
            transform: translate(0, -10px);
            visibility: hidden;
        }
        99% {
            visibility: visible;
        }
        100% {
            visibility: visible;
            opacity: 1;
            transform: translate(0, 0);
        }
    }

    @media only screen and (max-width: 900px) {
        .modal {
            width: 75%;
            left: 12.5%;
        }
    }

    @media only screen and (max-width: 750px) {
        .modal {
            width: 90%;
            left: 5%;
        }
    }

    .modal-close {
        position: absolute;
        top: 0;
        right: 0;
        width: 50px;
        text-align: center;
        height: 20px;
        border-bottom-left-radius: 5px;
        line-height: 20px;
        cursor: pointer;
        z-index: 500;
    }

    .modal-header {
        padding: 15px;
    }

    .modal-title {
        font-size: 20pt;
        font-weight: 500;
    }

    .modal-score {
        position: absolute;
        top: 10px;
        right: 15px;
    }

    .modal-score-my {
        font-size: 30pt;
    }

    .modal-score-my::after {
        content: "/";
        font-weight: 100;
    }

    .modal-score-max {
        font-size: 22pt;
        font-weight: 100;
    }

    .modal-deadline {
        margin-top: 7px;
    }

    .modal-deadline-norm {
        font-size: 14pt;
        font-weight: 100;
    }

    .modal-deadline-late {
        font-size: 11pt;
        margin-left: 5pt;
        font-weight: 100;
    }

    .modal-line {
        padding: 15px;
        display: block;
        position: relative;
        padding-right: 140px;
    }

    .mtask-title {
        font-size: 16pt;
    }

    .mtask-text {
        margin-top: 5px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .mtask-score {
        position: absolute;
        top: 7px;
        right: 15px;
    }

    .mtask-score-my {
        font-size: 22pt;
    }

    .mtask-score-my::after {
        content: "/";
        font-weight: 100;
    }

    .mtask-score-max {
        font-size: 15pt;
        font-weight: 100;
    }

    .mtask-sub {
        font-size: 10pt;
        position: absolute;
        top: 37pt;
        right: 15px;
    }

    .mtask-sub-pen {
        font-weight: 100;
    }
</style>
