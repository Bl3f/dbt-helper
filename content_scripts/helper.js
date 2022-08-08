let models;

browser.runtime.onMessage.addListener((message) => {
    console.log(`Got message ${message}`);
});

browser.storage.local.get("state").then(state => {
    models = state.state.models;
});

browser.storage.onChanged.addListener((changes) => {
    models = changes.state.newValue.models;
})

window.addEventListener('copy', (event) => {
    const selectionText = event.clipboardData.getData('text/plain');
    event.clipboardData.setData('text/plain', replaceSQL(selectionText, models));
    event.preventDefault();
});
