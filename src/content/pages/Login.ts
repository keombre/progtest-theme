import { Page } from "./Page";

export class Login implements Page {
    langGlobe = `
<svg id="langGlobe" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
</svg>`;

    async initialise() {
        const loginForm = document.getElementsByTagName("form")[0];
        if (typeof loginForm != "undefined") {
            const title = document.createElement("div");
            title.className = "app_name";
            title.innerHTML = "FIT: <b>ProgTest</b>";
            loginForm.parentElement.insertBefore(title, loginForm);
            loginForm.className += " loginForm";

            const uniselect = document.createElement("div");
            uniselect.id = "uniSel";

            document
                .querySelector(
                    "#main > tbody > tr:nth-child(2) > td.rtbCell > select",
                )
                .childNodes.forEach((e) => {
                    if (!(e instanceof HTMLOptionElement)) return;
                    const uni = document.createElement("div");
                    uni.innerText = e.innerText;
                    uni.setAttribute("uni", e.value);
                    uni.className = "uniVal";
                    uni.addEventListener("click", uniChange);
                    uniselect.appendChild(uni);
                });

            uniselect.children[0].setAttribute("active", "true");

            loginForm.appendChild(uniselect);

            // add title mover
            document
                .querySelector("#ldap1 > td.ltCell.al > b")
                .addEventListener("click", moveInputLabel);
            document
                .querySelector("#ldap2 > td.al.lbCell > b")
                .addEventListener("click", moveInputLabel);

            const inputs = document.getElementsByTagName("input");
            inputs[0].addEventListener("focus", loginFocus);
            inputs[1].addEventListener("focus", loginFocus);

            inputs[0].addEventListener("focusout", loginFocusOut);
            inputs[1].addEventListener("focusout", loginFocusOut);

            document.getElementsByName("lang")[0].outerHTML += this.langGlobe;

            // in firefox, when opening the page, load the selected login type
            // @ts-expect-error browser is only defined in Chrome and thus is not in types as a global variable
            if (typeof browser !== "undefined") {
                document
                    .querySelector<HTMLElement>("#uniSel > .uniVal")
                    .click();
            }
        }
    }
}

export const moveInputLabel = (event) => {
    event.target.setAttribute("moved", true);
    event.target.parentNode.parentNode.children[1].children[0].focus();
};

export const loginFocusOut = (event) => {
    if (event.target.value == "") {
        event.target.parentNode.parentNode.children[0].children[0].removeAttribute(
            "moved",
        );
    }
};

export const loginFocus = (event: FocusEvent) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
        return;
    }
    const login = target?.parentNode?.parentNode?.children[0].children[0];
    if (login instanceof HTMLElement) {
        login.click();
    }
};

export const uniChange = (event) => {
    let c = 0,
        i;
    document.getElementById("uniSel").childNodes.forEach((e) => {
        if (!(e instanceof HTMLElement)) return;
        e.removeAttribute("active");
        if (e == event.target) {
            i = c;
        }
        c++;
    });

    event.target.setAttribute("active", "true");

    const select = document.querySelector<HTMLSelectElement>(
        'select[name="UID_UNIVERSITY"]',
    );
    select.selectedIndex = i;
    const trigger = new Event("change");
    select.dispatchEvent(trigger);
};
