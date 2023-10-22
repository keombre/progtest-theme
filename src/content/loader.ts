import Loader from "../components/loader.svelte";

const loaderElement = document.getElementById("ptt-loader");
if (loaderElement) {
    new Loader({
        target: loaderElement,
    });
}
