let models;

browser.runtime.onMessage.addListener((message) => { models = message });

window.addEventListener('copy', (event) => {
    const selectionText = event.clipboardData.getData('text/plain');
    event.clipboardData.setData('text/plain', replaceSQL(selectionText, models));
    event.preventDefault();
});
