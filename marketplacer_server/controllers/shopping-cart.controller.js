const {nanoid} = require('nanoid');
const moment = require('moment');

const shoppingCartController = (shoppingCartRepository, productsRepository) => {
    const controller = {
        getShoppingCartByUsername: async (req, res, next) => {
            try{
                const username = req.params.username
                if(!username){
                    res.status(404).error({error: "Username not found."})
                }

                else{
                    const shoppingCart = await shoppingCartRepository.getShoppingCartByUsername(username);
                    let total = 0;
                    shoppingCart.forEach(item => {
                        total += item.productPrice;
                    });

                    res.status(200).json({data: {shoppingCart, total}});
                }
            }
            catch(error){
                console.error(error);
                throw new Error(error);
            }
        },

        addShoppingCartItem: async (req, res, next) => {
            const username = req.params.username;
            const productId = req.body.data.productId;

            try{
                // get the product if it exists
                const product = await productsRepository.getProductByProductId(productId);

                if(!product){
                    res.status(404).json({error: "Product doesn't exist."})
                }

                // check if username + productId already exists (so just ignore since quantity is not yet a factor)
                const shoppingCartItem = await shoppingCartRepository.getShoppingCartItemByUsernameAndProductId(username, productId);
                if(shoppingCartItem){
                    res.status(404).json({error: "Item is already in your shopping cart."})
                }
                else{
                    // else add shopping cart item
                    const shoppingCartItemId = nanoid(12);
                    const {productName, productPrice} = product;
                    const createdAt = moment().unix();
    
                    await shoppingCartRepository.addShoppingCartItem(shoppingCartItemId, username, productId, productName, productPrice, createdAt);
    
                    res.status(200).json({data: {shoppingCartItemId, username, productId, productName, productPrice, createdAt}});
                }

            }
            catch(error){
                console.error(error);
                throw new Error(error);
            }
        },

        deleteShoppingCartItem: async (req, res, next) => {
            try {
                const username = req.params.username;
                const shoppingCartItemId = req.params.shoppingCartItemId;

                // check if username and shoppingCartItemId matches
                const shoppingCartItem = await shoppingCartRepository.getShoppingCartItemByShoppingCartItemId(shoppingCartItemId);
                if(!shoppingCartItem){
                    res.status(404).json({error: "Item does not exist."});
                }
                else if(shoppingCartItem.username !== username){
                    res.status(404).json({error: "User has no authority to do this action."});
                }
                else{
                    await shoppingCartRepository.deleteShoppingCartItem(shoppingCartItemId);
                    res.status(200).json({data: shoppingCartItemId});
                }
            }
            catch(error){
                console.error(error);
                throw new Error(error);
            }
        }
    };

    return controller;
};

module.exports = shoppingCartController;