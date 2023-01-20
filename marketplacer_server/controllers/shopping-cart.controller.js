const {nanoid} = require('nanoid');
const moment = require('moment');
const getDiscountAndDiscountedTotal = require('../utils/getDiscountAndDiscountedTotal');
const InvalidParameterError = require('../httpcodes/InvalidParameterError');
const InvalidPayloadError = require('../httpcodes/InvalidPayloadError');
const Ok = require('../httpcodes/Ok');
const DoesNotExistError = require('../httpcodes/DoesNotExistError');
const AlreadyExistsError = require('../httpcodes/AlreadyExistsError');
const UnauthorizedError = require('../httpcodes/UnauthorizedError');

const shoppingCartController = (shoppingCartRepository, productsRepository) => {
    const controller = {
        getShoppingCartByUsername: async (req, res, next) => {
            try{
                const username = req.params.username.toLowerCase();
                if(!username){
                    return next(new InvalidParameterError(100));
                }

                else{
                    const shoppingCart = await shoppingCartRepository.getShoppingCartByUsername(username);
                    let total = 0;
                    shoppingCart.forEach(item => {
                        total += item.productPrice;
                    });

                    const [discount, discountedTotal] = getDiscountAndDiscountedTotal(total);
                    return next(new Ok({shoppingCart: {shoppingCartItems: shoppingCart, total: discountedTotal, discount}}))
                }
            }
            catch(error){
                return next(error);
            }
        },

        addShoppingCartItem: async (req, res, next) => {
            const username = req.params.username.toLowerCase();
            const productId = req.body.data?.productId;

            if(!req.body.data){
                return next(new InvalidPayloadError(201));
            }

            if(!username){
                return next(new InvalidParameterError(100));
            }

            if(!productId){
                return next(new InvalidPayloadError(200));
            }

            try{
                const product = await productsRepository.getProductByProductId(productId);
                if(!product){
                    return next(new DoesNotExistError(300));
                }

                const shoppingCartItem = await shoppingCartRepository.getShoppingCartItemByUsernameAndProductId(username, productId);
                if(shoppingCartItem){
                    return next(new AlreadyExistsError(400));
                }
                else{
                    const shoppingCartItemId = nanoid(12);
                    const {productName, productPrice} = product;
                    const createdAt = moment().unix();
    
                    await shoppingCartRepository.addShoppingCartItem(shoppingCartItemId, username, productId, productName, productPrice, createdAt);

                    const updatedShoppingCartItems = await shoppingCartRepository.getShoppingCartByUsername(username);
                    let total = 0;
                    updatedShoppingCartItems.forEach(item => {
                        total += item.productPrice;
                    });
                    const [discount, discountedTotal] = getDiscountAndDiscountedTotal(total);

                    return next(new Ok({shoppingCart: {shoppingCartItems: updatedShoppingCartItems, total: discountedTotal, discount}}))
                }

            }
            catch(error){
                console.error(error);
                return next(error);
            }
        },

        deleteShoppingCartItem: async (req, res, next) => {
            try {
                const username = req.params.username.toLowerCase();
                const shoppingCartItemId = req.params.shoppingCartItemId;

                if(!username){
                    return next(new InvalidParameterError(100));
                }

                if(!shoppingCartItemId){
                    return next(new InvalidParameterError(101));
                }

                // check if username and shoppingCartItemId matches
                const shoppingCartItem = await shoppingCartRepository.getShoppingCartItemByShoppingCartItemId(shoppingCartItemId);
                if(!shoppingCartItem){
                    return next(new DoesNotExistError(301));
                }
                else if(shoppingCartItem.username !== username){
                    return next(new UnauthorizedError(500));
                }
                else{
                    await shoppingCartRepository.deleteShoppingCartItem(shoppingCartItemId);

                    const updatedShoppingCartItems = await shoppingCartRepository.getShoppingCartByUsername(username);
                    let total = 0;
                    updatedShoppingCartItems.forEach(item => {
                        total += item.productPrice;
                    });
                    const [discount, discountedTotal] = getDiscountAndDiscountedTotal(total);
                    
                    return next(new Ok({shoppingCart: {shoppingCartItems: updatedShoppingCartItems, total: discountedTotal, discount}}))
                }
            }
            catch(error){
                console.error(error);
                return next(error);
            }
        }
    };

    return controller;
};

module.exports = shoppingCartController;