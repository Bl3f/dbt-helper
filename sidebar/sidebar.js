function displaydbtInfo(manifest) {
    document.getElementById("step-2").style.display = "block";

    const sources = manifest.sources;
    const nodes = manifest.nodes;

    console.log(manifest);

    document.getElementById("nb-sources").innerText = Object.entries(sources).length;
    document.getElementById("nb-nodes").innerText = Object.entries(nodes).length;

    browser.tabs.query({currentWindow: true, active: true}, function (tabs){
        const activeTab = tabs[0];
        browser.tabs.sendMessage(activeTab.id, {...sources, ...nodes});
    });
}

function handleFile(e) {
    e.preventDefault();
    const file = this.files[0];
    const reader = new FileReader();
    reader.onload = () => { displaydbtInfo(JSON.parse(reader.result)) };
    reader.readAsText(file);
}

document.getElementById("uploadFile").addEventListener("change", handleFile, false);


