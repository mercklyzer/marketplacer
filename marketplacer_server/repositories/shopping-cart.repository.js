const shoppingCartRepository = (knex) => {
    const repository = {
        getShoppingCartByUsername: async (username) => {
            try{
                const shoppingCartItems = await knex.raw("CALL getShoppingCartByUsername(?);", [username]);
                return shoppingCartItems[0][0];
            }
            catch(error){
                console.error(error);
                throw new Error(error);
            }
        },

        getShoppingCartItemByUsernameAndProductId: async (username, productId) => {
            try{
                const shoppingCartItem = await knex.raw("CALL getShoppingCartItemByUsernameAndProductId(?,?);", [username, productId]);
                return shoppingCartItem[0][0][0];
            }
            catch(error){
                console.error(error);
                throw new Error(error);
            }
        },

        getShoppingCartItemByShoppingCartItemId: async (shoppingCartItemId) => {
            try{
                const shoppingCartItem = await knex.raw("CALL getShoppingCartItemByShoppingCartItemId(?);", [shoppingCartItemId]);
                return shoppingCartItem[0][0][0];
            }
            catch(error){
                console.error(error);
                throw new Error(error);
            }
        },

        addShoppingCartItem: async (shoppingCartItemId, username, productId, productName, productPrice, createdAt) => {
            try{
                const shoppingCartItem = await knex.raw("CALL addShoppingCartItem(?,?,?,?,?,?);", [shoppingCartItemId, username, productId, productName, productPrice, createdAt]);
                return shoppingCartItem[0][0];
            }
            catch(error){
                console.error(error);
                throw new Error(error);
            }
        },

        deleteShoppingCartItem: async (shoppingCartItemId) => {
            try {
                const deletedShoppingCartItem = await knex.raw("CALL deleteShoppingCartItem(?);", [shoppingCartItemId]);
                return deletedShoppingCartItem[0][0];
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