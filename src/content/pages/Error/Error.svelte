<script lang="ts">
    export let error: Error;

    const goBack = () => {
        history.back();
        return false;
    };
</script>

<main>
    <h1>An unexpected error occurred</h1>
    <p>The following error has occurred:</p>
    <code>{error.toString()}</code>
    {#if error.stack}
        {#each error.stack.split("\n") as line}
            <code>{line}</code>
        {/each}
    {/if}
    <p>
        Try <a href={document.referrer} on:click={goBack}>going back</a>, if
        that doesn't help,
        <a href="https://github.com/keombre/progtest-theme/issues"
            >file an issue on GitHub</a
        >.
    </p>
</main>

<style>
    code {
        display: block;
    }

    main {
        font-size: 14px;
        max-width: 640px;
        margin: 0 auto;
    }
</style>
