export const buildLink = (arg: string) =>
    new URL(
        "index.php?" + arg,
        window.location.protocol + "//" + window.location.hostname,
    );

export function getCourseId() {
    const args = new URLSearchParams(window.location.search);
    return args.get("Cou");
}
