let models, isEnabled, isDebug;

let div = document.createElement('div'),
    h1 = document.createElement("h1"),
    debugContentDiv = document.createElement('div');

h1.innerHTML = "Debug";
div.classList.add("dbtHelperDebugger");
div.appendChild(h1);
div.appendChild(debugContentDiv);

function activateDebug() {
    document.body.appendChild(div);

    document.addEventListener("input", (event) => {
        if (event.isComposing || event.keyCode === 229) {
            return;
        }

        if ((event.target.type === "textarea") && (event.target.classList.contains("inputarea"))) {
            debugContentDiv.innerText = replaceSQL(event.target.value, models);
        }

    })

    debugContentDiv.innerText = "Type SQL in the SQL editor to activate the live debugger."
}

function deactivateDebug() {
    document.body.removeChild(div);
}

browser.storage.local.get("state").then(state => {
    models = state.state.models;
});

browser.storage.local.get("enable").then(state => {
    isEnabled = state.enable;
});

browser.storage.local.get("debug").then(state => {
    isDebug = state.debug;

    if (isDebug) activateDebug();
});

browser.storage.onChanged.addListener((changes) => {
    if (changes.hasOwnProperty("state")) models = changes.state.newValue.models;
    if (changes.hasOwnProperty("enable")) isEnabled = changes.enable.newValue;
    if (changes.hasOwnProperty("debug")) isDebug = changes.debug.newValue;

    if (changes.hasOwnProperty("debug") && isDebug) {
        activateDebug();
    } else if (changes.hasOwnProperty("debug") && !isDebug) {
        deactivateDebug();
    }
})

window.addEventListener('copy', (event) => {
    if (isEnabled) {
        const selectionText = event.clipboardData.getData('text/plain') || event.target.value;
        event.clipboardData.setData('text/plain', replaceSQL(selectionText, models));
        event.preventDefault();
    }
});