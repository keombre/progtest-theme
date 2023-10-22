<script lang="ts">
    import { slide } from "svelte/transition";
    import { MenuItem, Subjects } from "../Main";
    import cx from "classnames";
    import MenuItemComponent from "./menu-item.svelte";

    export let subjects: Subjects;
    export let settings: MenuItem[];

    let sortedSubjects = Object.entries(subjects).sort((a, b) => {
        const aSemester = parseInt(a[0].substring(1));
        const bSemester = parseInt(b[0].substring(1));
        if (aSemester < bSemester) return 1;
        if (aSemester > bSemester) return -1;
        return 0;
    });

    let expanded: Record<string, boolean> = {
        [sortedSubjects[0][0]]: true,
    };

    const getAcademicYear = (semester: string) => {
        const code = parseInt(semester.substring(1));
        const year = Math.round(code / 10);
        return `20${year}/${year + 1}`;
    };

    const getSemesterHeader = (semester: string) => {
        const code = parseInt(semester.substring(1));
        return `${code % 10 === 1 ? "Zimní" : "Letní"} semestr`;
    };

    const toggle = (id: string) => {
        expanded[id] = !expanded[id];
        expanded = { ...expanded };
    };
</script>

<main>
    {#each sortedSubjects as [semester, subjects]}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <button
            class={cx("subjectHeader", {
                active: expanded[semester],
            })}
            on:click={() => toggle(semester)}
            >{getSemesterHeader(semester)}
            <b>{getAcademicYear(semester)}</b></button
        >
        {#if expanded[semester]}
            <div class="subjectSelect" transition:slide={{ duration: 150 }}>
                {#each subjects as subject}
                    <MenuItemComponent data={subject} />
                {/each}
            </div>
        {/if}
    {/each}
    <div class="subjectSelect settings">
        {#each settings as item}
            <MenuItemComponent data={item} />
        {/each}
    </div>
</main>

<style>
    main {
        margin: 0 auto;
        padding: 10px 50px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        max-width: 900px;
    }

    .settings {
        margin-top: 30px !important;
    }

    .settings :global(a) {
        min-height: 90px;
    }

    .subjectHeader.active + .subjectSelect {
        margin-bottom: 10px;
    }

    .subjectSelect {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-gap: 20px 24px;
        place-content: center;
    }

    @media only screen and (max-width: 1000px) {
        main {
            max-width: 600px;
        }
        .subjectSelect {
            grid-template-columns: 1fr 1fr;
        }
    }

    @media only screen and (max-width: 700px) {
        main {
            max-width: 300px;
        }
        .subjectSelect {
            grid-template-columns: 1fr;
        }
    }

    .subjectHeader {
        display: block;
        width: 100%;
        height: 35px;
        background: linear-gradient(
            to right,
            #343a40 20%,
            rgba(0, 0, 0, 0) 99%
        );
        line-height: 35px;
        padding: 0 0 0 34px;
        font-size: 22px;
        border-bottom-left-radius: 8px;
        border-top-left-radius: 8px;
        color: #fff;
        font-weight: 200;
        cursor: pointer;
        user-select: none;
        border: none;
        outline: inherit;
        text-align: inherit;
        font-family: var(--font-family);
    }

    .subjectHeader:before {
        content: "";
        position: absolute;
        margin-top: 13px;
        margin-left: -21px;
        border: solid #c7c7c7;
        border-width: 0 3px 3px 0;
        display: inline-block;
        padding: 3px;
        -webkit-transform: rotate(-45deg);
        -ms-transform: rotate(-45deg);
        transform: rotate(-45deg);
        transition: all 0.1s ease;
    }

    .subjectHeader.active:before {
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }
</style>
