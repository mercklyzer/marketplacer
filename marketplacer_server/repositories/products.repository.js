const DBServerError = require("../httpcodes/DBServerError");

const productsRepository = (knex) => {
    const repository = {
        getProducts: async () => {
            try{
                const queryResponse = await knex.raw("CALL getProducts();");
                const products = queryResponse[0][0];
                return products;
            }
            catch(error){
                console.error(error);
                throw new DBServerError(1000, error.message);
            }
        },

        getProductByProductId: async (productId) => {
            try{
                const queryResponse = await knex.raw("CALL getProductByProductId(?);", [productId]);
                const products = queryResponse[0][0];
                const product = products[0];
                return product;
            }
            catch(error){
                console.error(error);
                throw new DBServerError(1000, error.message);
            }
        },

        addProduct: async (productId, productName, productPrice) => {
            try{
                await knex.raw("CALL addProduct(?,?,?);", [productId, productName, productPrice]);
            }
            catch(error){
                console.error(error);
                throw new DBServerError(1000, error.message);
            }
        },

        addProducts: async (products) => {
            try {
                const seedProducts = products.map(({productId, productName, productPrice}) => knex.raw("CALL addProduct(?,?,?);", [productId, productName, productPrice]))
                await Promise.all(seedProducts)
            }
            catch(error){
                console.error(error);
                throw new DBServerError(1000, error.message);
            }
        }
    };

    return repository;
};

module.exports = productsRepository;