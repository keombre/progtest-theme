<script lang="ts">
    let data = fetch("/test_pages").then((res) => res.json());
</script>

<main style="max-width: 500px; margin: 0 auto; padding: 16px;">
    <h1>Dev page</h1>

    <section>
        <h2>Extension pages</h2>
        <p>
            <a href="/settings/index.html">Settings</a>
        </p>
    </section>

    <section>
        <h2>Test pages</h2>
        {#await data}
            <p>Loading...</p>
        {:then list}
            {#each list as item}
                <p>
                    <a href={item.url}>{item.description}</a>
                </p>
            {/each}
        {:catch error}
            <p>Error: {error.message}</p>
            <p>
                Check that you have test pages in
                <code>test_pages/</code>.
            </p>
        {/await}
    </section>
</main>

<style>
    :global(html) {
        background-color: var(--background-color);
        color: var(--foreground-color);
    }

    a {
        color: var(--foreground-color);
    }

    section {
        margin: 16px 0;
    }
</style>
