<button {...$$props}>
    <slot />
</button>

<style>
    button {
        appearance: none;
        padding: 6px 12px;
        background: var(--foreground-color);
        color: var(--background-color);
        border-radius: 4px;

        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
    }

    button:hover {
        background: var(--foreground-color--muted);
    }
</style>
