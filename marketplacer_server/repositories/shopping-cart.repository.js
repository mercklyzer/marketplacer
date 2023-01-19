const DBServerError = require("../httpcodes/DBServerError");

const shoppingCartRepository = (knex) => {
    const repository = {
        getShoppingCartByUsername: async (username) => {
            try{
                const queryResponse = await knex.raw("CALL getShoppingCartByUsername(?);", [username]);
                const shoppingCartItems = queryResponse[0][0];
                return shoppingCartItems;
            }
            catch(error){
                console.error(error);
                throw new DBServerError(1000, error.message);
            }
        },

        getShoppingCartItemByUsernameAndProductId: async (username, productId) => {
            try{
                const queryResponse = await knex.raw("CALL getShoppingCartItemByUsernameAndProductId(?,?);", [username, productId]);
                const shoppingCartItem = queryResponse[0][0][0];
                return shoppingCartItem;
            }
            catch(error){
                console.error(error);
                throw new DBServerError(1000, error.message);
            }
        },

        getShoppingCartItemByShoppingCartItemId: async (shoppingCartItemId) => {
            try{
                const queryResponse = await knex.raw("CALL getShoppingCartItemByShoppingCartItemId(?);", [shoppingCartItemId]);
                const shoppingCartItem = queryResponse[0][0][0];
                return shoppingCartItem;
            }
            catch(error){
                console.error(error);
                throw new DBServerError(1000, error.message);
            }
        },

        addShoppingCartItem: async (shoppingCartItemId, username, productId, productName, productPrice, createdAt) => {
            try{
                await knex.raw("CALL addShoppingCartItem(?,?,?,?,?,?);", [shoppingCartItemId, username, productId, productName, productPrice, createdAt]);
            }
            catch(error){
                console.error(error);
                throw new DBServerError(1000, error.message);
            }
        },

        deleteShoppingCartItem: async (shoppingCartItemId) => {
            try {
                await knex.raw("CALL deleteShoppingCartItem(?);", [shoppingCartItemId]);
            }
            catch(error){
                console.error(error);
                throw new Error(error);
            }
        }
    };

    return repository;
};

module.exports = shoppingCartRepository;