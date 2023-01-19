const mainPrompt = require('./prompts/mainPrompt')();
const store = require('./store')();

(async () => {
    await mainPrompt.startPrompt();
    console.log("done");
    console.log(store.username());
})(); 