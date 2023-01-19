const inquirer = require('inquirer');
const productsApi = require('../apiRequests/products.api')();
const store = require('../store')();

// Cannot have separate files for prompts due to cyclic dependency

const actionsPrompt = () => {
    const prompt = {
        selectActionProductsListOrShoppingCartOrLogoutPrompt: () => {
            return new Promise(fulfill => {
                inquirer.prompt({
                    type: 'list',
                    name: 'action',
                    message: 'What do you want to do?',
                    choices: [
                        'See the list of products',
                        'View my shopping cart',
                        'Log out'
                    ]
                })
                    .then(async ({ action }) => {
                        if (action === 'See the list of products') {
                            console.log("Products: ");
                            await productsPrompt().buyAProductPrompt();
                        }
                        else if (action === 'View my shopping cart') {
                            console.log("Shopping Cart");
                        }
                        else if (action === 'Log out') {
                            console.log("Log out");
                        }
                        fulfill();
                    })
            })
        },
    }
    return prompt;
}

const productsPrompt = () => {
    const prompt = {
        buyAProductPrompt: () => {
            return new Promise(async (fulfill, reject) => {
                try {
                    const products = await productsApi.getProducts();
                    store.setProducts(products);

                    const productChoices = products.map(product => ({
                        name: `${product.productName} - $${product.productPrice}`,
                        value: product.productId
                    }))
                 
                    console.clear();
                    inquirer.prompt({
                        type: 'list',
                        name: 'productIdOrCancel',
                        message: 'Which product do you want to buy?',
                        choices: [...productChoices, "Cancel"]
                    })
                        .then(async ({productIdOrCancel}) => {
                            if (productIdOrCancel === "Cancel") {
                                await actionsPrompt().selectActionProductsListOrShoppingCartOrLogoutPrompt();
                            }
                            else {
                                const productId = productIdOrCancel;
                                console.log(productId);
                            }
                 
                        })
                    fulfill();
                }
                catch (error) {
                    console.error(error);
                    reject(error);
                }
            })
        }
    }

    return prompt;
}

module.exports.actionsPrompt = actionsPrompt;
module.exports.productsPrompt = productsPrompt;