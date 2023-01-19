const inquirer = require('inquirer');
const productsApi = require('../apiRequests/products.api')();
const shoppingCartApi = require('../apiRequests/shopping-cart.api')();
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
                            const products = await productsApi.getProducts();
                            store.setProducts(products);

                            console.log("Products: ");
                            await productsPrompt().buyAProductPrompt();
                        }
                        else if (action === 'View my shopping cart') {
                            const username = store.username();
                            const shoppingCart = await shoppingCartApi.getShoppingCart(username);
                            store.setShoppingCart(shoppingCart);

                            shoppingCartPrompt().displayShoppingCart(username, shoppingCart);
                            await prompt.selectActionShoppingCart();
                        }
                        else if (action === 'Log out') {
                            console.log("Log out");
                        }
                        fulfill();
                    })
            })
        },

        selectActionShoppingCart: () => {
            return new Promise(fulfill => {
                inquirer.prompt({
                    type: 'list',
                    name: 'action',
                    message: 'What do you want to do?',
                    choices: [
                        'Remove item',
                        'Go back',
                    ]
                })
                    .then(async ({ action }) => {
                        if (action === "Go back") {
                            prompt.selectActionProductsListOrShoppingCartOrLogoutPrompt();
                        }
                        else if (action === "Remove item") {
                            const username = store.username();
                            const shoppingCart = store.shoppingCart();
                            await shoppingCartPrompt().deleteShoppingCartItemPrompt(username, shoppingCart);
                        }
                        fulfill();
                    })
            })
        }
    }
    return prompt;
}

const productsPrompt = () => {
    const prompt = {
        buyAProductPrompt: () => {
            return new Promise(async (fulfill, reject) => {
                try {
                    const products = store.products();

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
                        .then(async ({ productIdOrCancel }) => {
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

const shoppingCartPrompt = () => {
    const prompt = {
        displayShoppingCart: (username, shoppingCart) => {
            console.clear();
            console.log(`${username}'s Shopping Cart:`);
            console.log("Items:")
            shoppingCart.shoppingCartItems.forEach((item, index) => {
                console.log(`${index + 1}.) ${item.productName} - $${item.productPrice}`);
            })

            const discount = shoppingCart.discount;

            if (discount > 0) {
                let greaterThanThreshold = 0;
                if (discount === 0.2) {
                    greaterThanThreshold = 100;
                }
                else if (discount === 0.15) {
                    greaterThanThreshold = 50;
                }
                else if (discount === 0.1) {
                    greaterThanThreshold = 20;
                }
                console.log(`Discount applied: ${shoppingCart.discount * 100}% off on total greater than $${greaterThanThreshold}.`);
            }

            console.log(`Total: $${shoppingCart.total}`);
        },

        deleteShoppingCartItemPrompt: (username, shoppingCart) => {
            const shoppingCartItems = shoppingCart.shoppingCartItems.map((item, index) => ({
                name: `${index + 1}.) ${item.productName} - $${item.productPrice}`,
                value: item.shoppingCartItemId
            }));

            return new Promise((fulfill, reject) => {
                inquirer.prompt({
                    type: 'list',
                    name: 'actionOrId',
                    message: 'Select an item you want to remove.',
                    choices: [...shoppingCartItems, "Cancel"]
                })
                    .then(async ({actionOrId}) => {
                        try{
                            if (actionOrId !== "Cancel") {
                                const shoppingCartItemId = actionOrId;
                                const username = store.username();
                                const updatedShoppingCart = await shoppingCartApi.deleteShoppingCartItem(username, shoppingCartItemId);
                                store.setShoppingCart(updatedShoppingCart);
                                console.clear();
                                shoppingCartPrompt().displayShoppingCart(username, updatedShoppingCart);
                            }
                            else{
                                shoppingCartPrompt().displayShoppingCart(username, shoppingCart);
                            }
                            await actionsPrompt().selectActionShoppingCart();
                            fulfill();
                        }
                        catch(error){
                            console.error(error);
                            reject(error);
                        }
                    })
            })

        }
    }

    return prompt;
}

module.exports.actionsPrompt = actionsPrompt;
module.exports.productsPrompt = productsPrompt;