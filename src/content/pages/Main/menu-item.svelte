<script lang="ts">
    import { MenuItem } from "../Main";
    import cx from "classnames";

    export let data: MenuItem;
</script>

<article>
    <a href={data.link} class="subject">
        <div class="subject-title">{data.title}</div>
        <div class={cx("icon", data.icon)}></div>
        <div class="subject-body">{data.text}</div>
        {#if data.footer}
            <div class="subject-footer">{data.footer}</div>
        {/if}
    </a>
    {#if data.subjectHomepage}
        <a class="subject-homepage" href={data.subjectHomepage}
            >Stránky předmětu</a
        >
    {/if}
</article>

<style>
    article {
        position: relative;
    }

    .subject {
        display: block;
        border-radius: 7px;
        padding: 16px 12pt;
        min-height: 140px;
        position: relative;
        overflow: hidden;
        box-shadow: 0 1px 3px -1px rgba(0, 0, 0, 0.25);
    }

    .subject:hover {
        box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.25);
    }

    .subject-title {
        font-size: 16pt;
        width: calc(100% - 80px);
    }

    .subject-body {
        font-size: 12pt;
        width: calc(100% - 85px);
        margin-top: 5px;
    }

    .subject-footer {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        text-align: center;
        font-size: 12pt;
        padding: 7px 0;
    }

    .subject-homepage {
        position: absolute;
        bottom: 45px;
        right: 7px;
        font-size: 12px;
        font-weight: 500;
        width: auto;
        padding: 2px 5px;
        color: inherit;
        border-radius: 2px;
        text-shadow: 0 1px 0 #455a64;
    }
</style>
