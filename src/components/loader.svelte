<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { pttLoadedEvent } from "../events";

    let isVisible = true;

    function showLoader() {
        isVisible = true;
    }

    function hideLoader() {
        isVisible = false;
    }

    onMount(() => {
        window.addEventListener("beforeunload", showLoader);
        document.addEventListener(pttLoadedEvent.type, hideLoader);

        return () => {
            window.removeEventListener("beforeunload", showLoader);
            document.removeEventListener(pttLoadedEvent.type, hideLoader);
        };
    });
</script>

{#if isVisible}
    <div class="loader" transition:fade={{ duration: 150 }}>
        <div class="anim-load anim-1"></div>
        <div class="anim-load anim-2"></div>
        <div class="anim-load anim-3"></div>
        <svg
            class="anim-logo"
            width="18.85mm"
            version="1.1"
            viewBox="0 0 23.272 34.408"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g transform="translate(-91.281 -156.77)">
                <path
                    transform="scale(.26458)"
                    d="m345 592.52v130.04h22.191v-46.16h23.389c26.86-0.2507 42.835-24.438 42.367-45.045-0.42142-18.58-13.702-38.75-40-38.84zm22.191 17.232h19.506c15.165 0 22.945 12.225 23.125 23.125 0.18935 11.453-10.085 25.09-23.482 25.09h-19.148z"
                    fill="#565f7c"
                />
            </g>
        </svg>
    </div>
{/if}

<style>
    .loader {
        font-family: "Open Sans", "Noto Color Emoji";
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        user-select: none;
        z-index: 1000;
        background: #1c1e1f;
    }

    .anim-load {
        animation-play-state: running;
        position: absolute;
        height: 30px;
        background: #565f7c;
        width: 30px;
        border-radius: 3px;
        left: calc(50% - 34px);
        transform-origin: right center;
    }

    @keyframes width {
        0% {
            transform: scale(1, 1);
        }
        50% {
            transform: scale(2.5, 1);
        }
        100% {
            transform: scale(1, 1);
        }
    }

    .anim-1 {
        top: calc(50% - 93px);
        animation: 1s width infinite;
    }

    .anim-2 {
        top: calc(50% - 55px);
        animation: 1s width infinite;
        animation-delay: 0.33s;
    }

    .anim-3 {
        top: calc(50% - 18px);
        animation: 1s width infinite;
        animation-delay: 0.66s;
    }

    .anim-logo {
        position: absolute;
        top: calc(50% - 93px);
        left: calc(50% + 5px);
    }
</style>
