import Loader from "../components/loader.svelte";

const loaderElement = document.createElement("pttloader");
document.documentElement.appendChild(loaderElement);
new Loader({
    target: loaderElement,
});
