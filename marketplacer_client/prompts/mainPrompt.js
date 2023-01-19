const inquirer = require('inquirer');
const store = require('../store')();
const actionsPrompt = require('./operationsPrompt').actionsPrompt();

const mainPrompt = () => {
    const prompt = {
        greetingsPrompt: () => {
            console.log("Welcome to Marketplacer!");
        },

        usernamePrompt: () => {
            return new Promise(fulfill => {
                inquirer.prompt({
                    type: 'input',
                    name: 'username',
                    message: 'Enter your username:'
                })
                    .then(async ({username}) => {
                        store.setUsername(username);
                        await actionsPrompt.selectActionProductsListOrShoppingCartOrLogoutPrompt();
                        fulfill();
                    })
            })

        },

        startPrompt: () => {
            return new Promise(async fulfill => {
                console.clear();
                prompt.greetingsPrompt();
                await prompt.usernamePrompt();
                fulfill();
            })
        }
    }

    return prompt;
}

module.exports = mainPrompt;