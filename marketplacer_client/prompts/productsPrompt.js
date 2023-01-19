const productsApi = require('../apiRequests/products.api')();
const inquirer = require('inquirer');
const store = require('../store')();
const actionsPrompt = require('./operationsPrompt')();

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
                                await actionsPrompt.selectActionProductsListOrShoppingCartOrLogoutPrompt();
                            }
                            else {
                                const productId = productIdOrCancel;
                                console.log(productId);
                                // if (!isProductInShoppingCart(productId)) {
                                //     await addProductToCart(productId);
                                // }
                                // else {
                                //     console.log("Item is already in the shopping cart.");
                                // }
                                // selectAction();
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

module.exports = productsPrompt;