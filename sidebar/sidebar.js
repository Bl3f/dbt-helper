const MODEL = 'model', SOURCE = 'source';

function sendMessage(type, value) {
    browser.tabs.query({currentWindow: true}, function (tabs){
        tabs.forEach(tab => browser.tabs.sendMessage(tab.id, {type, value}))
    });
}

function displaydbtInfo(state, nbSources, nbNodes) {
    const {models, info} = state.state;

    document.getElementById("step-2").style.display = "block";
    document.getElementById("step-3").style.display = "block";

    document.getElementById("manifestUploadedAt").innerText = info.modifiedAt;
    document.getElementById("nbSources").innerText = nbSources || Object.entries(models).filter(([key, model]) => model.resource_type === SOURCE).length;
    document.getElementById("nbNodes").innerText = nbNodes || Object.entries(models).filter(([key, model]) => model.resource_type === MODEL).length;

    //sendMessage("hello");
}

function handleManifest(manifest) {
    const sources = manifest.sources;
    const nodes = manifest.nodes;

    const models = {...sources, ...nodes};
    const info = {
        modifiedAt: new Date()
    }
    const state = {
        models,
        info,
    }

    browser.storage.local.set({state});

    displaydbtInfo({state});
}

function handleFile(e) {
    e.preventDefault();
    const file = this.files[0];
    const reader = new FileReader();
    reader.onload = () => { handleManifest(JSON.parse(reader.result)); };
    reader.readAsText(file);
}

function handleEnable() {
    const value = this.checked;
    browser.storage.local.set({enable: value});
}

function handleDebug() {
    const value = this.checked;
    browser.storage.local.set({debug: value});
}

document.getElementById("uploadFile").addEventListener("change", handleFile, false);
document.getElementById("enable").addEventListener("change", handleEnable, false);
document.getElementById("debug").addEventListener("change", handleDebug, false);

browser.storage.local.get("state").then(state => {
    if (state && Object.keys(state).length) displaydbtInfo(state);
});

browser.storage.local.get("debug").then(debug => {
    if (debug) document.getElementById("debug").checked = debug.debug;
});